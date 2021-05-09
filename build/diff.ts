//Imports
import { stringify } from "https://deno.land/std@0.95.0/encoding/yaml.ts"
import { ensureDir } from "https://deno.land/std@0.95.0/fs/mod.ts"
import { assertObjectMatch } from "https://deno.land/std@0.95.0/testing/asserts.ts"
import { DIFF, loose, rw } from "./constants.ts"
import type { ExportedMapData } from "./map.ts"

/** Diff computer */
export async function diff(name: string, { main: __main, head: __head, sha }: { main: string; head: string; sha: string }) {
  //Load data
  const _main = __main.match(/(?<user>[\w-]+):(?<branch>[\w-]+)/)?.groups ?? {}
  const _head = __head.match(/(?<user>[\w-]+):(?<branch>[\w-]+)/)?.groups ?? {}
  console.debug(`processing diff: ${name} (${_head.user}:${_head.branch} => ${_main.user}:${_main.branch})`)
  const main = await fetch(`https://raw.githubusercontent.com/${_main.user}/gracidea/${_main.branch}/server/data/maps/${name}.gracidea.json`).then(res =>
    res.json()
  ) as ExportedMapData
  const head = await fetch(`https://raw.githubusercontent.com/${_head.user}/gracidea/${_head.branch}/server/data/maps/${name}.gracidea.json`).then(res =>
    res.json()
  ) as ExportedMapData
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
  await ensureDir("diff")

  //Created and deleted regions
  console.debug("checking: regions")
  changes.regions.created = Object.keys(head.pins.regions).filter(region => !Object.keys(main.pins.regions).includes(region))
  changes.regions.deleted = Object.keys(main.pins.regions).filter(region => !Object.keys(head.pins.regions).includes(region))

  //Edited pins
  console.debug("checking: pins")
  const editedRegions = new Set()
  for (const [id, pin] of pins.head) {
    if (!pins.main.has(id)) {
      void ((pins as rw).diffCreated = true)
      changes.pins.created.push({ id, name: pin.name })
      continue
    }
    try {
      assertObjectMatch(pins.main.get(id) as loose, pins.head.get(id) as loose)
    }
    catch {
      void ((pins as rw).diffEdited = true)
      editedRegions.add(pin.region)
      changes.pins.edited.push({ id, name: pin.name })
    }
    pins.main.delete(id)
  }
  //Deleted pins (present in main but not in head)
  for (const [id, pin] of pins.main) {
    void ((pins as rw).diffDeleted = true)
    editedRegions.add(pin.region)
    changes.pins.deleted.push({ id, name: pin.name })
    head.pins.regions[pin.region].pins.push(pin)
  }
  changes.regions.edited = [...editedRegions]

  //Edited areas
  console.debug("checking: areas")
  for (const [id, area] of areas.head) {
    if (!areas.main.has(id)) {
      changes.areas.created.push({ id, name: area.name })
      area.properties.diffCreated = true
      continue
    }
    try {
      assertObjectMatch(areas.main.get(id) as loose, areas.head.get(id) as loose)
    }
    catch {
      area.properties.diffEdited = true
      changes.areas.edited.push({ id, name: area.name })
    }
    areas.main.delete(id)
  }
  //Deleted areas (present in main but not in head)
  for (const [id, area] of areas.main) {
    area.properties.diffDeleted = true
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
        const p = main.chunks[id]?.layers[name][i] ?? -1
        const c = layer[i]
        //Created
        if ((p < 0) && (c >= 0)) {
          changed = true
          changes.tiles.created++
          layer[i] += DIFF.CREATED
          continue
        }
        //Deleted
        if ((c < 0) && (p >= 0)) {
          changed = true
          changes.tiles.deleted++
          layer[i] = p + DIFF.DELETED
          continue
        }
        //Edited
        if (p !== c) {
          changed = true
          changes.tiles.edited++
          layer[i] += DIFF.EDITED
          continue
        }
        changes.tiles.unchanged++
      }
      if (changed)
        changes.chunks[id in main.chunks ? "edited" : "created"].push({ id })
      delete main.chunks[id]?.layers[name]
    }
  }
  //Deleted chunks (present in main but not in head)
  for (const [id, { layers }] of Object.entries(main.chunks)) {
    head.chunks[id] ??= { layers: {} }
    for (const name in layers) {
      head.chunks[id].layers[name] = layers[name].map(tile => tile + DIFF.DELETED)
      changes.tiles.deleted += layers[name].length
      changes.chunks.deleted.push(id)
    }
  }

  //Save
  console.debug(`saving: diff/${name}_${sha}_diff.gracidea.json`)
  await Deno.writeTextFile(`diff/${name}_${sha}_diff.gracidea.json`, JSON.stringify(head))
  console.debug(stringify(changes))
  return changes
}
