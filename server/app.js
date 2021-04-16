//Dependancies
  const express = require("express")
  const app = express()
  const argv = require("minimist")(process.argv.slice(2))
  const path = require("path")
  const colors = require("colors")
  const compression = require("compression")
  const creature = require("pokemon")

//Dev mode
  if (argv.dev) {
    console.log("Launching in dev environment".cyan)
    app.get("/js/gracidea.min.js", (req, res) => res.sendFile(path.join(__dirname, "..", "client/js/src/gracidea.js")))
    app.use("/js", express.static("client/js/src"))
    app.get("/maps/:map/tileset.textures.webp", (req, res) => res.sendFile(path.join(__dirname, "..", "/maps/", req.params.map,"/tileset.textures.raw.png")))
  }

//Compression
  app.use(compression({filter(req, res) { return req.headers["gracidea-no-compression"] ? false : compression.filter(req, res) } }))

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