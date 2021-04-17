import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { parse } from "https://deno.land/std@0.93.0/flags/mod.ts";

console.dir(parse(Deno.args))
const maps = {
  overworld:JSON.parse(await Deno.readTextFile("app/server/static/maps/overworld.gracidea"))
}

const router = new Router();
router
  .get("/", async (context) => {
    const imageBuf = await Deno.readFile("app/server/static/index.html");
    context.response.body = imageBuf;
  })
  .get("/gracidea.min.js", async (context) => {
    try {
      const {files} = await Deno.emit("app/world/world.ts", {bundle:"iife"})
      context.response.headers.set("Content-Type", "application/javascript")
      context.response.body = Object.entries(files).filter(([key]) => /\.js$/.test(key)).map(([_, value]) => value).shift()
    } catch (e) { console.log(e) }
  })
  .get("/map/:map", async context => {
    const MAP = `${context.params?.map}`
    const X = Number(context.request.url.searchParams.get("X"))
    const Y = Number(context.request.url.searchParams.get("Y"))
    const DX = Number(context.request.url.searchParams.get("DX"))
    const DY = Number(context.request.url.searchParams.get("DY"))

    context.response.headers.set("Content-Type", "application/json")
    const partial = {chunks:{} as {[key:string]:any}}

    for (let x = X-DX; x <= X+DX; x++) {
      for (let y = Y-DY; y <= Y+DY; y++) {
        const id = `${x};${y}`
        partial.chunks[id] = (maps as any)[MAP].chunks[id]
      }
    }
    context.response.body = JSON.stringify(partial)

  })



const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

// static content
app.use(async (context, next) => {
  try {
    await context.send({root:"app/server/static"})
  } catch {
    next()
  }
})

await app.listen({port:3000})

/*
//Dev mode
if (argv.dev) {
  console.log("Launching in dev environment".cyan)
  app.get("/js/gracidea.min.js", (req, res) => res.sendFile(path.join(__dirname, "..", "client/js/src/gracidea.js")))
  app.use("/js", express.static("client/js/src"))
  app.get("/maps/:map/tileset.textures.webp", (req, res) => res.sendFile(path.join(__dirname, "..", "/maps/", req.params.map,"/tileset.textures.raw.png")))
}

//Serve client files
app.use("/", express.static("client"))
app.use("/js", express.static("node_modules/pixi.js/dist/browser"))
app.use("/js", express.static("node_modules/pixi-viewport/dist"))
app.use("/js", express.static("node_modules/axios/dist"))
app.use("/js", express.static("node_modules/vue/dist"))
app.use("/maps", express.static("maps"))

//Serve creatures name
const creatures = Object.fromEntries(creature.all("en").map((name, id) => [name.toLocaleLowerCase(), Object.fromEntries([["id", id+1], ...["en", "fr", "ja", "ko", "zh-Hans", "zh-Hant", "ru", "de"].map(lang => [lang, creature.getName(id+1, lang)])])]))
app.get("/maps/creatures/name/:lang", (req, res) => res.json(creatures))

//Start server
const port = argv.port||3000
app.listen(port, () => console.log(`Listening on port ${port}`))
*/