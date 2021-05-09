//Imports
import { CHUNK_SIZE, loose, rw } from "../../build/constants.ts"
import { Quadtree, Rectangle } from "./structs/quadtree.ts"

/** Area data */
type Area = { bounds: Rectangle; data: loose }

//Load maps and build quadtrees
const pending = new Map<string, Promise<void>>()
const maps = {} as loose
const quadtrees = {} as { [key: string]: Quadtree }

/** Map loader */
async function load(map: string, {patch}:{patch?:string|null}) {
  if (!pending.has(map)) {
    pending.set(map, new Promise<void>(solve =>
      json(map).then(content => {
        const { areas = [] } = maps[map] = JSON.parse(content)
        quadtrees[map] = Quadtree.from(areas.map((data: Area) => ({ ...data.bounds, data })))
        console.debug(`loaded: ${map}`)
        solve()
      })
    ))
  }
  await pending.get(map)
  const data = maps[map]
  let patched = null
  if (patch) {
    console.debug(`patching: ${map} with ${patch}`)
    patched = JSON.parse(await json(patch, MapData.patch))?.[map] ?? null
    console.log(patched)
  }
  return {quadtree:quadtrees[map], map:data, patched}
}

/** Get pins */
export async function pins({ map, patch }: { map: string, patch?:string|null }) {
  return (await load(map, {patch})).map.pins
}

/** Get chunk data */
export async function chunk({ section, map, patch }: { section: string; map: string, patch?:string|null }) {
  if (!/^(?<x>-?\d+);(?<y>-?\d+)$/.test(section))
    return null
  const [x, y] = section.split(";").map(Number)
  const chunk = { x: x * CHUNK_SIZE, y: y * CHUNK_SIZE, width: CHUNK_SIZE, height: CHUNK_SIZE }
  const {quadtree, map:data, patched} = await load(map, {patch})
  const areas = [...quadtree.get(chunk)].filter(area => Quadtree.contains(area, chunk)).map(({ data }: loose) => data)
  return {
    id: section,
    chunk: patched?.chunks[section] ?? data.chunks[section],
    areas: patched?.areas.length ? [...areas, ...patched.areas] : areas
  }
}

/** Map data types */
const enum MapData {
  map = "map",
  patch = "patch",
}

/** JSON loader */
async function json(name: string, type = "map" as MapData) {
  let local = `server/data/maps/${name}.gracidea.json`
  let remote = `https://raw.githubusercontent.com/lowlighter/gracidea/main/server/data/maps/${name}.gracidea.json`
  if (type === MapData.patch) {
    local = `patches/${name}.json`
    remote = `https://raw.githubusercontent.com/lowlighter/gracidea/patches/patches/${name}.json`
  }
  try {
    return (Deno as rw).readTextFile(local)
  }
  catch (error) {
    console.warn(error)
    const body = await fetch(new URL(remote)).then(res => res.body)
    const reader = body?.getReader() as ReadableStreamDefaultReader<Uint8Array>
    let content = ""
    while (true) {
      const { done, value } = await reader.read()
      content += new TextDecoder().decode(value)
      if (done)
        break
    }
    return content
  }
}
