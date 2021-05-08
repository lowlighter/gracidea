//Imports
import { CHUNK_SIZE, loose, rw } from "../../build/constants.ts"
import { Quadtree, Rectangle } from "./structs/quadtree.ts"

/** Area data */
type Area = { bounds: Rectangle; data: loose }

//Load maps and build quadtrees
const maps = {} as loose
const quadtrees = {} as { [key: string]: Quadtree }

/** Map loader */
async function load(map: string) {
  if (map in maps)
    return
  const { areas = [] } = maps[map] = JSON.parse(await json(map))
  quadtrees[map] = Quadtree.from(areas.map((data: Area) => ({ ...data.bounds, data })))
  console.debug(`loaded: ${map}`)
}

/** Get pins */
export async function pins({ map }: { map: string }) {
  await load(map)
  return maps[map].pins
}

/** Get chunk data */
export async function chunk({ section, map }: { section: string; map: string }) {
  if (!/^(?<x>-?\d+);(?<y>-?\d+)$/.test(section))
    return null
  await load(map)
  const [x, y] = section.split(";").map(Number)
  const chunk = { x: x * CHUNK_SIZE, y: y * CHUNK_SIZE, width: CHUNK_SIZE, height: CHUNK_SIZE }
  return {
    id: section,
    chunk: maps[map].chunks[section],
    areas: [...quadtrees[map].get(chunk)].filter(area => Quadtree.contains(area, chunk)).map(({ data }: loose) => data),
  }
}

/** JSON loader */
async function json(name: string) {
  try {
    return (Deno as rw).readTextFile(`server/data/maps/${name}.gracidea.json`)
  }
  catch (error) {
    console.log(error)
    const content = await fetch(`https://raw.githubusercontent.com/lowlighter/gracidea/main/server/data/maps/${name}.gracidea.json`).then(res => res.json())
    /*const body = await fetch(new URL(`https://raw.githubusercontent.com/lowlighter/gracidea/main/server/data/maps/${name}.gracidea.json`)).then(res => res.body)
    const reader = body?.getReader() as ReadableStreamDefaultReader<Uint8Array>
    let content = ""
    while (true) {
      const { done, value } = await reader.read()
      content += new TextDecoder().decode(value)
      if (done)
        break
    }*/
    return content
  }
}
