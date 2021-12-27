//Imports
import { mime } from "../utils.ts"
import { maps, mapRoute } from "./maps/mod.ts"
import { tilesets} from "./textures/tilesets/mod.ts"


/** API entrypoint */
export async function api({endpoint, headers, query = {}}:{endpoint:string, headers:Headers, query?:{[key:string]:string}}) {
  //Handle endpoints
  headers.set("content-type", `${mime(".json")}; charset=utf-8`)
  let result = {error:null}
  try {
    switch (true) {
      case mapRoute.test(endpoint):{
        Object.assign(result, await maps(endpoint.match(mapRoute)?.groups as any))
        break
      }
      case endpoint.startsWith("/textures/tilesets/"):{
        Object.assign(result, await tilesets({tileset:endpoint.replace("/textures/tilesets/", "")}))
        break
      }
      default:
        throw new Error("bad endpoint")
    }
  }
  catch (error) {
    Object.assign(result, {error:error.message})
  }
  finally {
    //deno-lint-ignore no-unsafe-finally
    return new Response(JSON.stringify(result), {headers})
  }
}
