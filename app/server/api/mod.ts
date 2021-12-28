//deno-lint-ignore-file no-unreachable
//Imports
import { mime } from "../utils.ts";
import { mapRoute, maps } from "./maps/mod.ts";
import { tilesets } from "./textures/tilesets/mod.ts";
import { effects } from "./textures/effects/mod.ts";

/** API entrypoint */
export async function api({ endpoint, headers }: { endpoint: string; headers: Headers; query?: { [key: string]: string } }) {
  //Handle endpoints
  headers.set("content-type", `${mime(".json")}; charset=utf-8`);
  const result = { error: null };
  try {
    switch (true) {
      case mapRoute.test(endpoint): {
        Object.assign(result, await maps(endpoint.match(mapRoute)?.groups));
        break;
      }
      case endpoint.startsWith("/textures/effects"): {
        Object.assign(result, await effects());
        break;
      }
      case endpoint.startsWith("/textures/tilesets/"): {
        Object.assign(result, await tilesets({ tileset: endpoint.replace("/textures/tilesets/", "") }));
        break;
      }
      default:
        throw new Error("bad endpoint");
    }
  } catch (error) {
    Object.assign(result, { error: error.message });
  } finally {
    //deno-lint-ignore no-unsafe-finally
    return new Response(JSON.stringify(result), { headers });
  }
}
