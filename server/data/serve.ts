//Imports
import { CHUNK_SIZE } from "../../build/constants.ts"
import { Quadtree, Rectangle } from "./structs/quadtree.ts"

/** Loose type */
//deno-lint-ignore no-explicit-any
type loose = { [key: string]: any }

/** Area data */
type Area = { bounds: Rectangle; data: loose }

//Load maps and build quadtrees
const maps = {} as loose
const quadtrees = {} as { [key: string]: Quadtree }
for await (const name of ["overworld"]) {
  const { areas = [] } = maps[name] = JSON.parse(await json(name))
  quadtrees[name] = Quadtree.from(areas.map((data: Area) => ({ ...data.bounds, data })))
  console.debug(`loaded ${name}`)
}

/** Maps data */
export { maps }

/** Retrieve chunk data */
export function chunk({ section, from: id }: { section: string; from: string }) {
  if (!/^(?<x>-?\d+);(?<y>-?\d+)$/.test(section))
    return null
  const [x, y] = section.split(";").map(Number)
  const chunk = { x: x * CHUNK_SIZE, y: y * CHUNK_SIZE, width: CHUNK_SIZE, height: CHUNK_SIZE }
  return {
    id: section,
    chunk: maps[id].chunks[section],
    areas: [...quadtrees[id].get(chunk)].filter(area => Quadtree.contains(area, chunk)).map(({ data }: any) => data),
  }
}

/** JSON loader */
async function json(name: string) {
  try {
    return (Deno as any).readTextFile(`server/data/maps/${name}.gracidea.json`)
  }
  catch (error) {
    console.log(error)
    const body = await fetch(new URL(`https://raw.githubusercontent.com/lowlighter/gracidea/main/server/data/maps/${name}.gracidea.json`)).then(res => res.body)
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
