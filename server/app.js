//Dependancies
  const express = require("express")
  const app = express()
  const argv = require("minimist")(process.argv.slice(2))
  const path = require("path")
  const colors = require("colors")

//Dev mode
  if (argv.dev) {
    console.log("Launching in dev environment".cyan)
    app.get("/js/gracidea.min.js", (req, res) => res.sendFile(path.join(__dirname, "..", "client/js/src/gracidea.js")))
    app.use("/js", express.static("client/js/src"))
    app.get("/maps/:map/tileset.textures.png", (req, res) => res.sendFile(path.join(__dirname, "..", "/maps/", req.params.map,"/tileset.textures.raw.png")))
  }

//Serve client files
  app.use("/", express.static("client"))
  app.use("/js", express.static("node_modules/pixi.js/dist"))
  app.use("/js", express.static("node_modules/pixi-viewport/dist"))
  app.use("/js", express.static("node_modules/axios/dist"))
  app.use("/js", express.static("node_modules/vue/dist"))
  app.use("/maps", express.static("maps"))

//Start server
  const port = argv.port||3000
  app.listen(port, () => console.log(`Listening on port ${port}`))