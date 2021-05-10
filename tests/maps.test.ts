//Imports
import { assert } from "https://deno.land/std@0.95.0/testing/asserts.ts"
import { parse as xmlparse } from "https://deno.land/x/xml@v1.0.0/mod.ts"

//deno-lint-ignore no-explicit-any
type test = any
//Detailed XML maps checks
const data = xmlparse(await Deno.readTextFile("maps/overworld/map.tmx")) as test
{
  const regions = [] as string[]
  const methods = ["walk", "surf", "only-one", "old-rod", "good-rod", "super-rod"]
  const patterns = ["patrol", "loop", "wander", "fixed", "lookaround"]
  const npcs = [
    ...new Set(
      Object.keys(JSON.parse(await Deno.readTextFile("client/static/copyrighted/textures/npcs.json")).frames).map((key: string) => key.replace(/_(?:down|up|left|right)_\d$/, "")),
    ),
  ]
  for (const group of data.map.objectgroup) {
    const ids = new Set()
    const layer = group["@name"]
    for (const object of group.object) {
      const { "@id": id, "@name": name = id, "@x": x, "@y": y, "@width": width, "@height": height, polygon = {} } = object
      const properties = Object.fromEntries([object.properties?.property ?? []].flat().map(({ "@name": name, "@value": value }) => [name, value]))
      Deno.test(`${layer} ${name} integrity: has unique id`, () => assert(!ids.has(ids.add(`${layer}#${id}`))))
      ids.add(`${layer}#${id}`)
      Deno.test(`${layer} ${name} integrity: has name`, () => assert((typeof name === "string") && (name.length > 0)))
      Deno.test(`${layer} ${name} integrity: has valid position`, () => assert((typeof x === "number") && (typeof y === "number")))
      Deno.test(`${layer} ${name} integrity: has valid polygon`, () =>
        assert(((typeof width === "number") && (typeof height === "number")) || ((polygon["@points"]?.match(/-?\d+/g)?.length ?? -1) % 2 === 0)))
      switch (layer) {
        case "regions": {
          regions.push(name)
          Deno.test(`regions ${name} integrity: has mx and my properties`, () => assert((typeof properties.mx === "number") && (typeof properties.my === "number")))
          continue
        }
        case "pins": {
          Deno.test(`pins ${name} integrity: has mx and my properties`, () => assert((typeof properties.mx === "number") && (typeof properties.my === "number")))
          Deno.test(`pins ${name} integrity: has valid region`, () => assert(regions.includes(properties.region)))
          continue
        }
        case "creatures": {
          const { "@type": method } = object
          Deno.test(`creatures ${name} integrity: has valid method`, () => assert(methods.includes(method)))
          continue
        }
        case "people": {
          const { "@type": pattern } = object
          Deno.test(`people ${name} integrity: has valid name`, () => assert(npcs.includes(name)))
          Deno.test(`people ${name} integrity: has valid pattern`, () => assert(patterns.includes(pattern)))
          continue
        }
      }
    }
  }
}

//Detailed XML maps tiles checks
{
  const forbidden = [
    0, //Undefined tile
    2374,
    2375,
    2376,
    2377,
    2378,
    2379,
    2380,
    2381, //Sea tiles
  ]
  for (const layered of data.map.layer) {
    const layer = layered["@name"]
    for (const chunk of layered.data.chunk) {
      const { "@x": x, "@y": y, "@width": width, "@height": height } = chunk
      const id = `chunk ${x};${y}`
      const tiles = chunk.$.match(/-?\d+/g)?.map(Number).map((tile: number) => tile - 1)
      Deno.test(`${layer} ${id} integrity: has valid position`, () => assert((typeof x === "number") && (typeof y === "number")))
      Deno.test(`${layer} ${id} integrity: has valid dimensions`, () => assert((typeof width === "number") && (typeof height === "number")))
      Deno.test(`${layer} ${id} integrity: no forbidden tiles used`, () => assert(!tiles.some((tile: number) => forbidden.includes(tile))))
    }
  }
}

//TODO:
//Nb max chunks edited
//Locations
