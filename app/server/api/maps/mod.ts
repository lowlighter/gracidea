//Imports
import { parse as parseXML } from "https://deno.land/x/xml@2.0.0/parse.ts"
import { join, dirname } from "https://deno.land/std@0.114.0/path/mod.ts";
import { toArray, calcArea } from "../../utils.ts"

/** Maps data */
const mapData = await fetch(join(dirname(import.meta.url), "data.json")).then(response => response.json())

/** Maps route */
export const mapRoute = /^\/maps(?:\/(?<region>[a-z]+)(?:\/(?<section>[-a-z0-9]+))?)?\/?$/

/** Maps endpoint */
export async function maps({region, section}:{region?:string, section?:string} = {}) {
  if ((region)&&(section))
    return load({region, section})
  if (region)
    return list({region})
  return regions()
}

/** List regions maps */
async function regions() {
  return {
    regions:[
      {
        id:"hoenn",
        x:0/16,
        y:0/16,
      }
    ]
  }
}

/** List maps for specific criteria */
async function list(filter:{region:string, section?:string}) {
  const path = join(dirname(import.meta.url), "../../../../maps/gracidea.world")
  try {
    //Load maps data
    const {maps:raw} = await fetch(path).then(response => response.json())

    //Prepare maps
    const sections = raw
      .filter(({fileName = ""}) => {
        const {region = "", section = ""} = `/maps/${fileName.replace(".tmx", "")}`.match(mapRoute)?.groups ?? {}
        return (filter.region === region)&&((!filter.section)||(filter.section === section))
      })
      .map(({fileName = "", height = 0, width = 0, x = 0, y = 0}) => ({
        id:fileName.replace(".tmx", ""),
        x:x/16,
        y:y/16,
        height:height/16,
        width:width/16,
      }))

    //Formatted maps data
    return {sections}
  }
  catch (error) {
    console.log(error)
    throw new Error("failed to load maps")
  }
}

/** Load a single map */
async function load({region, section}:{region:string, section:string}) {
  const path = join(dirname(import.meta.url), "../../../../maps", region, `${section}.tmx`)
  try {
    //Load map data
    const data = await fetch(path).then(response => response.text())
    const {map:raw} = parseXML(data) as any
    const {X, Y} = await list({region, section}).then(({sections:[{x, y}]}) => ({X:x, Y:y}))

    //Parse chunks data
    const chunks = [] as Array<{id:string, layer:string, x:number, y:number, tiles:number[]}>
    for (const {"@name":layer, data:{chunk:chunked}} of toArray(raw.layer)) {
      for (const chunk of toArray(chunked)) {
        //Extract and format data
        const {"@x":x, "@y": y, "#text":_tiles } = chunk
        const id = `${X+x/16};${Y+y/16}`
        const tiles = _tiles.split(",")
          .filter((value:string) => value.trim().length)
          .map((value:string) => Math.max(Number(value)-1, 0))

        //Save chunk
        chunks.push({id, layer, x, y, tiles})
      }
    }

    //Parse areas data
    const areas = [] as Array<{id:string, name:string, points:number[], properties:{[key:string]:unknown}}>
    for (const {"@name": type, object:objects} of toArray(raw.objectgroup)) {
      for (const object of toArray(objects)) {
        //Extract and format data
        const { "@id": id, "@name": name, "@type": mode, "@x": x, "@y": y, "@width": width, "@height": height, polygon, properties: _properties } = object
        const properties = Object.fromEntries(toArray(_properties?.property).map(({ "@name": name, "@value": value }) => [name, value]))
        const points = (polygon?.["@points"].match(/-?\d+/g) ?? [0, 0, width, 0, width, height, 0, height])
          .map((value:string) => Number(value))
          .map((delta:number, index:number) => (delta + (index % 2 ? y : x)) / 16)
        const area = {id, type, name, points, properties}

        //Specific formatting by type
        switch (type) {
          case "creatures":{
            const X = points.filter((_:number, i:number) => !(i % 2)), Y = points.filter((_:number, i:number) => i % 2)
            area.properties.size = calcArea(X, Y)
            break
          }
          case "people":{
            const directions = Object.entries(properties).filter(([key, value]) => (["left", "right", "up", "down"].includes(key)) && (value)).map(([key]) => key)
            area.properties = {pattern:mode, directions}
            break
          }
        }

        //Save area
        areas.push(area)
      }
    }

    //Formatted map data
    return {id:`${region}/${section}`, chunks, areas, ...mapData[section]}
  }
  catch (error) {
    console.log(error)
    throw new Error("failed to load map")
  }
}
