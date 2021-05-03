const LOCAL = true

const ROUTE_MAP = /^[/]map[/]\w+[/].*$/
const ROUTE_MAP_PINS = /^[/]map[/](?<id>\w+)[/]pins$/
const ROUTE_MAP_SECTION = /^[/]map[/](?<id>\w+)[/](?<section>-?\d+;-?\d+)$/
const ROUTE_CLIENT_APP = /^[/]js[/]app[.]js$/

export async function route(request:Request) {
  //Auto-complete pathname
    let {pathname} = new URL(request.url)
    if (pathname.endsWith("/"))
      pathname += "index.html"
    console.debug(`fetching: ${pathname}`)

  //
    try {
      switch (true) {
        //
          case ROUTE_MAP.test(pathname):{
            const {maps, chunk} = await import("./data/serve.ts")
            switch (true) {
              case ROUTE_MAP_PINS.test(pathname):{
                const {id} = pathname.match(ROUTE_MAP_PINS)?.groups ?? {}
                return new Response(JSON.stringify(maps[id].pins), {headers:{"content-type":"application/json"}})
              }
              case ROUTE_MAP_SECTION.test(pathname):{
                const {id, section} = pathname.match(ROUTE_MAP_SECTION)?.groups ?? {}
                return new Response(JSON.stringify(chunk({section, from:id})), {headers:{"content-type":"application/json"}})
              }
            }
            throw new Error("Invalid map route")
          }

          case ROUTE_CLIENT_APP.test(pathname)&&LOCAL:{
            console.debug(`rebuilding: ${pathname}`)
            const {files} = await (Deno as any).emit("client/app/mod.ts", {bundle:"iife"})
            const script = Object.entries(files).filter(([key]) => /\.js$/.test(key)).map(([_, value]) => value).shift() as string
            return new Response(script, {headers:{"content-type":"application/javascript"}})
          }
        //Serve static assets
          default:{
            const response = LOCAL
              ? new Response(await Deno.readTextFile(`client/static${pathname}`))
              : await fetch(new URL(`https://raw.githubusercontent.com/lowlighter/gracidea/main/client/static${pathname}`))
            const headers = new Headers()
            headers.set("content-type", `${mime(pathname)}; charset=utf-8`)
            headers.set("content-security-policy", "")
            return new Response(await Deno.readFile(`client/static${pathname}`), {headers})
          }
      }
    }
    catch (error) {
      console.log(error)
      return new Response(null, {status:404})
    }
  }

/** Auto-detect mime type based on extension */
  function mime(pathname:string) {
    const {extension = ""} = pathname.match(/[.](?<extension>\w+)$/)?.groups ?? {}
    return ({
      css:"text/css",
      gif:"image/gif",
      html:"text/html",
      ico:"image/x-icon",
      jpg:"image/jpeg",
      jpeg:"image/jpeg",
      js:"application/javascript",
      json:"application/json",
      png:"image/png",
      webp:"image/webp",
    } as {[key:string]:string})[extension] ?? "text/plain"
  }