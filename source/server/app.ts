//Imports
  import { parse } from "https://deno.land/std@0.95.0/flags/mod.ts"
  import { route } from "./router.ts"

//Initialization
  const argv = parse(Deno.args)
  console.log(argv)

  for await (const connection of Deno.listen({port:4000})) {
    (async () => {
      for await (const {request, respondWith} of Deno.serveHttp(connection))
        respondWith(route(request))
    })()
  }



//Set maps endpoints
  /*for (const [id, map] of Object.entries(maps)) {
    router
      .get(`/map/${id}/pins`, async context => { context.response.body = map.pins })
      .get(`/map/${id}/:section`, async (context, next) => {
        const data = chunk({section:`${context.params?.section}`, from:id})
        if (!data)
          return next()
        context.response.body = data
      })
  }

//Dev routes
  if (argv.dev) {
    router
      .get("/js/gracidea.min.js", async context => {
        try {
          const {files} = await Deno.emit("source/client/app.ts", {bundle:"iife"})
          context.response.headers.set("Content-Type", "application/javascript")
          context.response.body = Object.entries(files).filter(([key]) => /\.js$/.test(key)).map(([_, value]) => value).shift() as string
        } catch { }
      })
  }*/


