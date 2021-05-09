//Imports
import { stringify } from "https://deno.land/std@0.95.0/encoding/yaml.ts"
import { ensureDir } from "https://deno.land/std@0.95.0/fs/mod.ts"
//import { assertObjectMatch } from "https://deno.land/std@0.95.0/testing/asserts.ts"
import { clone } from "./clone.ts"
import { loose, PATCH, rw } from "./constants.ts"
import { ExportedMapData, map } from "./map.ts"

/** Patch computer */
export async function patch(name: string, { main: __main, head: __head, sha }: { main: string; head?: string; sha: string }) {
  //Init data
  const _main = __main.match(/(?<user>[\w-]+):(?<branch>[\w-]+)/)?.groups ?? {}
  const _head = __head?.match(/(?<user>[\w-]+):(?<branch>[\w-]+)/)?.groups ?? null
  console.debug(`processing patch: ${name} (${_head?.user ?? "local"}:${_head?.branch ?? "head"} => ${_main.user}:${_main.branch})`)
  const main = await fetch(`https://raw.githubusercontent.com/${_main.user}/gracidea/${_main.branch}/server/data/maps/${name}.gracidea.json`).then(res =>
    res.json()
  ) as ExportedMapData
  if (_head) {
    await clone({ repository: `${_head.user}/gracidea`, target: "build/head", branch: _head.branch, clean: true })
    await map("overworld", { from: "build/head/" })
  }
  const head = JSON.parse(await Deno.readTextFile(`${_head ? "build/head/" : ""}server/data/maps/${name}.gracidea.json`)) as ExportedMapData

  //Prepare data
  const areas = {
    main: new Map(main.areas.map(area => [`${area.type}#${area.id}`, area])),
    head: new Map(head.areas.map(area => [`${area.type}#${area.id}`, area])),
  }
  const pins = {
    main: new Map(Object.entries(main.pins.regions).flatMap(([region, { pins }]) => pins.map(pin => [pin.id, { ...pin, region }]))),
    head: new Map(Object.entries(head.pins.regions).flatMap(([region, { pins }]) => pins.map(pin => [pin.id, { ...pin, region }]))),
  }
  const changes = {
    map: name,
    regions: { created: [], deleted: [], edited: [] },
    areas: { created: [], deleted: [], edited: [] },
    pins: { created: [], deleted: [], edited: [] },
    tiles: { created: 0, deleted: 0, edited: 0, unchanged: 0 },
    chunks: { created: [], deleted: [], edited: [] },
  } as loose
  await ensureDir("patches")

  //Created and deleted regions
  console.debug("checking: regions")
  changes.regions.created = Object.keys(head.pins.regions).filter(region => !Object.keys(main.pins.regions).includes(region))
  changes.regions.deleted = Object.keys(main.pins.regions).filter(region => !Object.keys(head.pins.regions).includes(region))

  //Edited pins
  console.debug("checking: pins")
  const editedRegions = new Set()
  for (const [id, pin] of pins.head) {
    if (!pins.main.has(id)) {
      void ((pins as rw).patchCreated = true)
      changes.pins.created.push({ id, name: pin.name })
      continue
    }
    try {
      //assertObjectMatch(pins.main.get(id) as loose, pins.head.get(id) as loose)
      head.pins.regions[pin.region].pins.splice(head.pins.regions[pin.region].pins.indexOf(pin), 1)
    }
    catch {
      void ((pins as rw).patchEdited = true)
      editedRegions.add(pin.region)
      changes.pins.edited.push({ id, name: pin.name })
    }
    pins.main.delete(id)
  }
  //Deleted pins (present in main but not in head)
  for (const [id, pin] of pins.main) {
    void ((pins as rw).patchDeleted = true)
    editedRegions.add(pin.region)
    changes.pins.deleted.push({ id, name: pin.name })
    head.pins.regions[pin.region].pins.push(pin)
  }
  //Clean untouched regions
  for (const [id, { pins }] of Object.entries(head.pins.regions)) {
    if ((!pins.length) && (!editedRegions.has(id)))
      delete head.pins.regions[id]
  }
  changes.regions.edited = [...editedRegions]

  //Edited areas
  console.debug("checking: areas")
  for (const [id, area] of areas.head) {
    if (!areas.main.has(id)) {
      changes.areas.created.push({ id, name: area.name })
      area.properties.patchCreated = true
      continue
    }
    try {
      //assertObjectMatch(areas.main.get(id) as loose, areas.head.get(id) as loose)
      head.areas.splice(head.areas.indexOf(area), 1)
    }
    catch {
      area.properties.patchEdited = true
      changes.areas.edited.push({ id, name: area.name })
    }
    areas.main.delete(id)
  }
  //Deleted areas (present in main but not in head)
  for (const [id, area] of areas.main) {
    area.properties.patchDeleted = true
    changes.areas.deleted.push({ id, name: area.name })
    head.areas.push(area)
  }

  //Edited chunks
  console.debug("checking: chunk")
  for (const [id, { layers }] of Object.entries(head.chunks)) {
    for (const name in layers) {
      const layer = layers[name]
      let changed = false
      for (let i = 0; i < layer.length; i++) {
        const p = main.chunks[id]?.layers[name]?.[i] ?? -1
        const c = layer[i]
        //Created
        if ((p < 0) && (c >= 0)) {
          changed = true
          changes.tiles.created++
          layer[i] += PATCH.CREATED
          continue
        }
        //Deleted
        if ((c < 0) && (p >= 0)) {
          changed = true
          changes.tiles.deleted++
          layer[i] = p + PATCH.DELETED
          continue
        }
        //Edited
        if (p !== c) {
          changed = true
          changes.tiles.edited++
          layer[i] += PATCH.EDITED
          continue
        }
        changes.tiles.unchanged++
      }
      if (changed)
        changes.chunks[id in main.chunks ? "edited" : "created"].push({ id })
      else
        delete head.chunks[id]?.layers[name]
      delete main.chunks[id]?.layers[name]
    }
  }
  //Deleted chunks (present in main but not in head)
  for (const [id, { layers }] of Object.entries(main.chunks)) {
    head.chunks[id] ??= { layers: {} }
    for (const name in layers) {
      head.chunks[id].layers[name] = layers[name].map(tile => tile + PATCH.DELETED)
      changes.tiles.deleted += layers[name].length
      changes.chunks.deleted.push(id)
    }
  }
  //Clean empty chunks
  for (const [id, { layers }] of Object.entries(head.chunks)) {
    if (!Object.keys(layers).length)
      delete head.chunks[id]
  }

  //Save
  const target = `patches/${sha}.json`
  console.debug(`saving: ${target}`)
  try {
    const { isFile } = await Deno.stat(target)
    if (!isFile)
      throw new Error("Error: Target directory already in use")
  }
  catch (error) {
    if (!(error instanceof Deno.errors.NotFound))
      throw error
    await Deno.writeTextFile(target, "{}")
  }
  const patch = JSON.parse(await Deno.readTextFile(target))
  patch[name] = head
  await Deno.writeTextFile(target, JSON.stringify(patch))
  console.debug(stringify(changes))
  return changes
}
