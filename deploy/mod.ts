//Imports
  import { maps, chunk } from "../source/server/serverless.ts"

//Event listener
  addEventListener("fetch", (event:any) => event.respondWith((async () => {
    const {request} = event
    const {pathname} = new URL(request.url)
    console.log(`fetching: ${pathname}`)
    switch (true) {
      //
        case /^[/]favicon[.]ico$/.test(pathname):{
          return new Response(null, {status:404})
        }
      //Maps pins
        case /^[/]map[/]\w+[/]pins$/.test(pathname):{
          const {id} = pathname.match(/^[/]map[/](?<id>\w+)[/]pins$/)?.groups ?? {}
          return new Response(JSON.stringify(maps[id].pins), {
            headers:{"content-type":"application/json"}
          })
        }
      //Maps chunks
        case /^[/]map[/]\w+[/]-?\d+;-?\d+$/.test(pathname):{
          const {id, section} = pathname.match(/^[/]map[/](?<id>\w+)[/](?<section>-?\d+;-?\d+)$/)?.groups ?? {}
          return new Response(JSON.stringify(chunk({section, from:id})), {
            headers:{"content-type":"application/json"}
          })
        }
      //JS script
        case /^[/]js[/]gracidea.min.js$/.test(pathname):{
          const {files} = await (Deno as any).emit("source/client/app.ts", {bundle:"iife"})
          const script = Object.entries(files).filter(([key]) => /\.js$/.test(key)).map(([_, value]) => value).shift() as string
          return new Response(script, {
            headers:{"content-type":"text/javascript"}
          })
        }

      //FIX
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
          return fetch(new URL(`../source/server/static${pathname.length > 1 ? pathname : "/index.html"}`, import.meta.url))
        }
    }
  })()))