//Imports
  import { Quadtree } from "./structs/quadtree.ts"
  import { Application, Router, HttpError } from "https://deno.land/x/oak/mod.ts"
  import { parse } from "https://deno.land/std@0.95.0/flags/mod.ts"

  const MAPS_DIR = `${Deno.cwd()}/source/server/assets/maps`
  const CHUNK_SIZE = 32

//Initialization
  const argv = parse(Deno.args)
  console.log(argv)

//Load maps
//deno-lint-ignore no-explicit-any
  const maps = {} as {[key:string]:any}
  for await (const {name:file, isFile} of Deno.readDir(MAPS_DIR)) {
    if ((isFile)&&(/[.]gracidea$/.test(file))) {
      const {name} = file.match(/^(?<name>[\s\S]+)[.]gracidea$/)?.groups ?? {}
      maps[name] = JSON.parse(await Deno.readTextFile(`${MAPS_DIR}/${file}`))
      console.debug(`loaded ${name}`)
    }
  }

//Router
  const router = new Router()

//Set maps endpoints
  for (const [id, map] of Object.entries(maps)) {
    const {pins = [], areas = [], chunks = {}} = map
    const quadtree = Quadtree.from(areas.map((data:any) => ({...data.bounds, data})))
    router
      .get(`/map/${id}/pins`, async context => { context.response.body = pins })
      .get(`/map/${id}/:section`, async (context, next) => {
        const section = `${context.params?.section}`
        if (!/^(?<x>-?\d+);(?<y>-?\d+)$/.test(section))
          return next()
        const [x, y] = section.split(";").map(Number)
        const chunk = {x:x*CHUNK_SIZE, y:y*CHUNK_SIZE, width:CHUNK_SIZE, height:CHUNK_SIZE}
        context.response.body = {
          id:section,
          chunk:chunks[section],
          areas:[...quadtree.get(chunk)].filter(area => Quadtree.contains(area, chunk)).map(({data}:any) => data),
        }
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

