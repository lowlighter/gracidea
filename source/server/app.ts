//Imports
  import { Quadtree } from "./structs/quadtree.ts"
  import { Application, Router, HttpError } from "https://deno.land/x/oak/mod.ts"
  import { parse } from "https://deno.land/std@0.93.0/flags/mod.ts"
  //import pokemon from "https://cdn.skypack.dev/pokemon"

//Initialization
  const argv = parse(Deno.args)
  const maps = {
    overworld:JSON.parse(await Deno.readTextFile("source/server/assets/maps/overworld.gracidea"))
  }
  const CHUNK_SIZE = 32

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

//Set maps endpoints
  for (const [id, map] of Object.entries(maps)) {
    const {pins = [], areas = [], chunks = {}} = map
    const quadtree = Quadtree.from(areas.map((data:any) => ({...data.bounds, data})))
    router
      .get(`/map/${id}/pins`, async context => { context.response.body = pins })
      .get(`/map/${id}/:section`, async (context, next) => {
        const section = `${context.params?.section}`
        if (!/^-?\d+;-?\d+$/.test(section))
          return next()
        const [x, y] = section.split(";").map(Number)
        const chunk = {x:x*CHUNK_SIZE, y:y*CHUNK_SIZE, width:CHUNK_SIZE, height:CHUNK_SIZE}
        context.response.body = {
          id:section,
          chunk:chunks[section],
          areas:[...quadtree.get(chunk)].filter((x:any) => contains(x, chunk)).map(({data}:any) => data),
        }
      })
  }


//App setup
  const app = new Application()
  app.use(async (context, next) => {
    try {
      await next()
    } catch (error) {
      if (error instanceof HttpError) {
        context.response.status = error.status
        context.response.body = error.message
        return
      }
      context.response.status = 500
      console.log(error)
    }
  })
  app.use(router.routes())
  app.use(router.allowedMethods())
  app.use(async context => void await context.send({root:`${Deno.cwd()}/source/server/static`, index:"index.html"}))
  console.log("server ready")
  await app.listen({port:argv.port ?? 4000})

//
function contains(a:any, b:any) {
  return (a.x+a.width >= b.x)&&(a.x <= b.x+b.width)&&(a.y <= b.y+b.height)&&(a.y+a.height >= b.y)
}
