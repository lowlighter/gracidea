//Imports
import { parse } from "https://deno.land/x/xml@v1.0.0/mod.ts"
import { dex } from "./dex.ts"
import { encounters as _encounters } from "./encounters.ts"

/** Build map data */
export async function map(name: string) {
  //Load data
  console.debug(`building: ${name} map data`)
  const encounters = await _encounters(await dex())
  const exported = { pins: { regions: {} }, areas: [], chunks: {} } as ExportedMapData
  const { map: { editorsettings: settings, layer: layers, objectgroup: groups } } = parse(await Deno.readTextFile(`maps/${name}/map.tmx`)) as MapData
  const TILE_SIZE = 16
  const CHUNK_SIZE = settings.chunksize["@width"]

  //Extract layers
  for (const layer of layers) {
    const { "@name": name, data: { chunk: chunks } } = layer
    console.debug(`processing: ${name}`)
    //Extract chunks
    for (const chunk of chunks) {
      const { "@x": x, "@y": y, $ } = chunk
      const X = Math.floor(x / CHUNK_SIZE), Y = Math.floor(y / CHUNK_SIZE), ID = `${X};${Y}`
      console.debug(`processing: chunk ${ID}`)
      //Extract data
      const tiles = [] as number[]
      const data = $.split("\n").map(line => line.match(/-?\d+/g)?.map(Number).map(tile => tile - 1) ?? [])
      for (let i = 0; i < CHUNK_SIZE; i++)
        tiles.push(...data.flatMap(line => line.filter((_, j) => i === j)))
      if (!tiles)
        throw new Error(`Invalid chunk data tiles for ${ID}`)
      exported.chunks[ID] ??= { layers: {} }
      exported.chunks[ID].layers[name] = tiles.some(tile => tile >= 0) ? tiles : []
    }
  }

  //Extract groups
  for (const group of groups) {
    const { "@name": type, object: objects } = group
    console.debug(`processing: ${type}`)
    //Extract objects
    for (const object of objects) {
      //Extract dimensional data
      const { "@id": id, "@name": name, "@type": mode, "@x": x, "@y": y, "@width": width, "@height": height, polygon, properties: _properties } = object
      const properties = Object.fromEntries([_properties?.property ?? []].flat().map(({ "@name": name, "@value": value }) => [name, value]))
      console.debug(`processing: ${id} (${name})`)
      const points = (polygon?.["@points"].match(/-?\d+/g) ?? [0, 0, width, 0, width, height, 0, height]).map(Number).map((n, i) => (n + (i % 2 ? y : x)) / TILE_SIZE)
      const X = points.filter((_, i) => !(i % 2)), Y = points.filter((_, i) => i % 2)
      const minx = Math.min(...X), maxx = Math.max(...X), miny = Math.min(...Y), maxy = Math.max(...Y)
      const bounds = { x: minx, y: miny, width: maxx - minx, height: maxy - miny }
      const size = area(X, Y)

      //Extract data
      switch (type) {
        case "regions": {
          exported.pins.regions[name] = { id, mx: properties?.mx as number, my: properties?.my as number, pins: [] }
          continue
        }
        case "pins": {
          exported.pins.regions[properties?.region as string]?.pins.push({ id, name, x: points[0], y: points[1], mx: properties?.mx as number, my: properties?.my as number })
          continue
        }
        case "creatures": {
          exported.areas.push({ id, name, points, type, bounds, properties: { ...properties, size, encounters: (encounters?.[name]?.[mode] ?? null) } })
          continue
        }
        case "people": {
          exported.areas.push({ id, name, points, type, bounds, properties: { pattern: mode } })
          continue
        }
        default: {
          exported.areas.push({ id, name, points, type, bounds, properties })
          continue
        }
      }
    }
  }

  //Saving
  const target = `server/data/maps/${name}.gracidea.json`
  console.debug(`saving: ${target}`)
  await Deno.writeTextFile(target, JSON.stringify(exported))
}

/** Compute polygon area */
function area(X: number[], Y: number[]) {
  let area = 0
  for (let i = 0, j = X.length - 1; i < X.length; j = i, i++)
    area += (X[j] + X[i]) * (Y[j] - Y[i])
  return Math.abs(area / 2)
}

/** Map data */
type MapData = {
  map: {
    editorsettings: {
      chunksize: {
        "@width": number
        "@height": number
      }
    }
    layer: Array<{
      "@name": string
      data: {
        chunk: Array<{
          "@x": number
          "@y": number
          $: string
        }>
      }
    }>
    objectgroup: Array<{
      "@name": string
      object: Array<{
        "@id": number
        "@name": string
        "@type": string
        "@x": number
        "@y": number
        "@width"?: number
        "@height"?: number
        polygon?: {
          "@points": string
        }
        properties?: {
          property: Array<{
            "@name": string
            "@value": unknown
          }>
        }
      }>
    }>
  }
}

/** Exported data */
export type ExportedMapData = {
  pins: {
    regions: {
      [region: string]: {
        id: number
        mx: number
        my: number
        pins: Array<{
          id: number
          name: string
          x: number
          y: number
          mx: number
          my: number
        }>
      }
    }
  }
  areas: Array<{
    id: number
    name: string
    points: number[]
    type: string
    bounds: { x: number; y: number; width: number; height: number }
    properties: { [key: string]: unknown }
  }>
  chunks: {
    [chunk: string]: {
      layers: {
        [tile: string]: number[]
      }
    }
  }
}
