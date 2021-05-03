//Imports
  import { Quadtree } from "./structs/quadtree.ts"

//Initialization
  const CHUNK_SIZE = 32

//Load maps
//deno-lint-ignore no-explicit-any
  const maps = {} as {[key:string]:any}
  for await (const name of ["overworld"]) {
    let text = await Deno.readTextFile(`source/server/data/maps/${name}.gracidea.json`)
    /*const body = await fetch(new URL(`data/maps/${name}.gracidea.json`, import.meta.url)).then(res => res.body)
    const reader = body?.getReader() as ReadableStreamDefaultReader<Uint8Array>
    let text = ""
    while (true) {
      const {done, value} = await reader.read()
      text += new TextDecoder().decode(value)
      if (done)
        break
    }*/
    maps[name] = JSON.parse(text)
    console.debug(`loaded ${name}`)
  }

  const quadtrees = {} as {[key:string]:Quadtree<any>}
  for (const [id, map] of Object.entries(maps)) {
    const {areas = []} = map
    quadtrees[id] = Quadtree.from(areas.map((data:any) => ({...data.bounds, data})))
  }

  export { maps }

  export function chunk({section, from:id}:{section:string, from:string}) {
    if (!/^(?<x>-?\d+);(?<y>-?\d+)$/.test(section))
      return null
    const [x, y] = section.split(";").map(Number)
    const chunk = {x:x*CHUNK_SIZE, y:y*CHUNK_SIZE, width:CHUNK_SIZE, height:CHUNK_SIZE}
    return {
      id:section,
      chunk:maps[id].chunks[section],
      areas:[...quadtrees[id].get(chunk)].filter(area => Quadtree.contains(area, chunk)).map(({data}:any) => data),
    }
  }


