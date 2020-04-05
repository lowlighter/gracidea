//Dependancies
  const express = require("express")
  const app = express()
  const argv = require("minimist")(process.argv.slice(2))

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