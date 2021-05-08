//Imports
import { rw } from "../build/constants.ts"
import { chunk, pins } from "./data/serve.ts"

/** Map routes  */
const ROUTE_MAP = /^[/]map[/]\w+[/].*$/

/** Map pins routes */
const ROUTE_MAP_PINS = /^[/]map[/](?<id>\w+)[/]pins$/

/** Map sections routes */
const ROUTE_MAP_SECTION = /^[/]map[/](?<id>\w+)[/](?<section>-?\d+;-?\d+)$/

/** Client app route */
const ROUTE_CLIENT_APP = /^[/]js[/]app[.]min[.]js$/

/** Route */
export async function route(request: Request, { deploy = false }: { deploy?: boolean } = {}) {
  //Auto-complete pathname
  let { pathname } = new URL(request.url)
  if (pathname.endsWith("/"))
    pathname += "index.html"
  console.debug(`fetching: ${pathname}`)
  //Serve files
  try {
    switch (true) {
      //Maps route
      case ROUTE_MAP.test(pathname): {
        switch (true) {
          case ROUTE_MAP_PINS.test(pathname): {
            const { id } = pathname.match(ROUTE_MAP_PINS)?.groups ?? {}
            return new Response(JSON.stringify(await pins({ map: id })), { headers: { "content-type": "application/json" } })
          }
          case ROUTE_MAP_SECTION.test(pathname): {
            const { id, section } = pathname.match(ROUTE_MAP_SECTION)?.groups ?? {}
            return new Response(JSON.stringify(await chunk({ section, map: id })), { headers: { "content-type": "application/json" } })
          }
        }
        throw new Error("Invalid map route")
      }
      //Client app rebuild
      case (!deploy) && (ROUTE_CLIENT_APP.test(pathname)): {
        console.debug(`rebuilding: ${pathname}`)
        const { files } = await (Deno as rw).emit("client/app/mod.ts", { bundle: "iife" })
        const script = Object.entries(files).filter(([key]) => /\.js$/.test(key)).map(([_, value]) => value).shift() as string
        return new Response(script, { headers: { "content-type": "application/javascript" } })
      }
      //Serve static assets
      default: {
        const response = deploy
          ? (await fetch(new URL(`../client/static${pathname}`, import.meta.url))).body
          : await (Deno as rw).readFile(`client/static${pathname}`)
        const headers = new Headers()
        headers.set("content-type", `${mime(pathname)}; charset=utf-8`)
        headers.set("content-security-policy", "")
        return new Response(response, { headers })
      }
    }
  }
  catch (error) {
    console.log(error)
    return new Response(null, { status: 404 })
  }
}

/** Auto-detect mime type based on extension */
function mime(pathname: string) {
  const { extension = "" } = pathname.match(/[.](?<extension>\w+)$/)?.groups ?? {}
  return ({
    css: "text/css",
    gif: "image/gif",
    html: "text/html",
    ico: "image/x-icon",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    js: "application/javascript",
    json: "application/json",
    png: "image/png",
    webp: "image/webp",
  } as { [key: string]: string })[extension] ?? "text/plain"
}
