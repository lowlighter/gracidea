//Imports
  import { Application, Router } from "https://deno.land/x/oak/mod.ts"
  import { parse } from "https://deno.land/std@0.93.0/flags/mod.ts"
  //import pokemon from "https://cdn.skypack.dev/pokemon"

//
  const argv = parse(Deno.args)
  const maps = {
    overworld:JSON.parse(await Deno.readTextFile("source/server/assets/maps/overworld.gracidea"))
  }

//Router
  const router = new Router()
  router
    .get("/gracidea.min.js", async context => {
      if (argv.dev) {
        try {
          const {files} = await Deno.emit("source/client/app.ts", {bundle:"iife"})
          context.response.headers.set("Content-Type", "application/javascript")
          context.response.body = Object.entries(files).filter(([key]) => /\.js$/.test(key)).map(([_, value]) => value).shift() as string
        } catch { }
        return
      }
    })
    //Locations
      .get("/map/:map/locations", async context => {
        const map = `${context.params?.map}`
        context.response.headers.set("Content-Type", "application/json")
        context.response.body = JSON.stringify({locations:maps[map as keyof typeof maps]?.locations ?? []})
      })
    //Pins
      .get("/map/:map/pins", async context => {
        const map = `${context.params?.map}`
        context.response.headers.set("Content-Type", "application/json")
        context.response.body = JSON.stringify({pins:maps[map as keyof typeof maps]?.pins ?? []})
      })
    //Chunks
      .get("/map/:map/:chunk", async context => {
        const map = `${context.params?.map}`
        const chunk = `${context.params?.chunk}`
        context.response.headers.set("Content-Type", "application/json")
        context.response.body = JSON.stringify({id:chunk, ...(maps as any)[map].chunks[chunk]})
      })


const app = new Application()

app.use(async (context, next) => {
  try {
    await next()
  } catch (error) {
    context.response.status = 500
    context.response.headers.set("Content-Type", "text/plain")
    context.response.body = `An error occured: ${argv.dev ? error : "unknown error"}`
  }
})

app.use(router.routes())
app.use(router.allowedMethods())
app.use(async context => void await context.send({root:`${Deno.cwd()}/source/server/static`, index:"index.html"}))


console.log("server ready")
await app.listen({port:3000})

