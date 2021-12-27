//Imports
import { parse as parseXML } from "https://deno.land/x/xml@2.0.0/parse.ts"
import { join, dirname } from "https://deno.land/std@0.114.0/path/mod.ts";
import { toArray } from "../../../utils.ts"

/** Tilesets endpoint */
export async function tilesets({tileset}:{tileset:string}) {
  const path = join(dirname(import.meta.url), "../../../../../copyrighted/tilesets", `${tileset}.tsx`)
  try {
    //Load tileset data
    const data = await fetch(path).then(response => response.text())
    const {tileset:raw} = parseXML(data) as any

    //Parse tiles data
    const animated = {} as {[key:string]:{frames:string[], speed:number}}
    const zindex = {} as {[key:string]:number}
    for (const {"@id":id, properties:_properties} of toArray(raw.tile)) {
      //Extract and format data
      const properties = Object.fromEntries(toArray(_properties?.property).map(({ "@name": name, "@value": value }) => [name, value]))

      //Animated frames
      if ((properties.frames)&&(properties.speed)) {
        animated[`${id}`] = {
          frames:new Array(properties.frames).fill(id).map((value, index) => `${value + index}`),
          speed:properties.speed
        }
      }

      //Z-index
      if (properties.zindex)
        zindex[`${id}`] = Number(properties.zindex)
    }

    //Formatted tileset data
    return {id:tileset, animated, zindex}
  }
  catch (error) {
    console.log(error)
    throw new Error("failed to load tileset")
  }
}