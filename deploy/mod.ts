//Imports
  import { maps, chunk } from "../source/server/serverless.ts"

//Event listener
  addEventListener("fetch", (event:any) => event.respondWith((async () => {
    const {request} = event
    let {pathname} = new URL(request.url)
    if (pathname.endsWith("/"))
      pathname += "index.html"
    console.log(`fetching: ${pathname}`)
    switch (true) {
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
          const response = await fetch(new URL(`../source/server/static${pathname}`, import.meta.url))
          const {extension = ""} = pathname.match(/[.](?<extension>\w+)$/)?.groups ?? {}
          const mime = ({css:"text/css", gif:"image/gif", html:"text/html", ico:"image/x-icon", jpg:"image/jpeg", jpeg:"image/jpeg", js:"application/javascript", json:"application/json", png:"image/png", webp:"image/webp"} as {[key:string]:string})[extension] ?? "text/plain"
          return newResponse(response, (headers:any) => {
            headers.set("content-type", `${mime}; charset=utf-8`)
            return headers
          })
        }
    }
  })()))



  function newResponse(res:any, headerFn:any) {

    function cloneHeaders() {
      var headers = new Headers();
      for (var kv of res.headers.entries()) {
        headers.append(kv[0], kv[1]);
      }
      return headers;
    }

    var headers = headerFn ? headerFn(cloneHeaders()) : res.headers;

    return new Promise(function (resolve) {
      return res.blob().then(function (blob:any) {
        resolve(new Response(blob, {
          status: res.status,
          statusText: res.statusText,
          headers: headers
        }));
      });
    });

  }