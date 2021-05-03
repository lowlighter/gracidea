const LOCAL = true

const ROUTE_MAP = /^[/]map[/]\w+[/].*$/
const ROUTE_MAP_PINS = /^[/]map[/](?<id>\w+)[/]pins$/
const ROUTE_MAP_SECTION = /^[/]map[/](?<id>\w+)[/](?<section>-?\d+;-?\d+)$/

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
          const {maps, chunk} = await import("./serverless.ts")
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

      //Shit stuff, to delete once #10467 is fixed
        case /^[/]textures[/]textures.webp$/.test(pathname):
        case /^[/]textures[/]creatures.webp$/.test(pathname):{
          return Response.redirect("https://gracidea.lecoq.io/maps/creatures/textures.webp", 302)
        }
        case /^[/]textures[/]tileset.textures.webp$/.test(pathname):
        case /^[/]textures[/]tileset3.webp$/.test(pathname):{
          return Response.redirect("https://gracidea.lecoq.io/maps/overworld/tileset.textures.webp", 302)
        }
        case /^[/]textures[/]creatures.json$/.test(pathname):{
          return Response.redirect("https://gracidea.lecoq.io/maps/creatures/textures.json", 302)
        }
        case /^[/]textures[/]tileset3.json$/.test(pathname):{
          return Response.redirect("https://gracidea.lecoq.io/maps/overworld/tileset.textures.json", 302)
        }

      //Serve static assets
        default:{
          const response = LOCAL
            ? new Response(await Deno.readTextFile(`source/server/static${pathname}`))
            : await fetch(new URL(`https://raw.githubusercontent.com/lowlighter/gracidea/main/source/server/static${pathname}`))
          const headers = new Headers()
          headers.set("content-type", `${mime(pathname)}; charset=utf-8`)
          headers.set("content-security-policy", "")
          return new Response(await Deno.readTextFile(`source/server/static${pathname}`), {headers})
        }
    }
  }
  catch (error) {
    console.log(error)
    return new Response(null, {status:404})
  }
}

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