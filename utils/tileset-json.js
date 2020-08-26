/**
 * Copyright 2017, Lecoq Simon (@lowlighter)
 *
 * This script is an utilitary pipeline which generate tileset json.
 */

//Dependancies
  const argv = require("minimist")(process.argv.slice(2))
  const path = require("path")
  const util = require("util")
  const colors = require("colors")
  const fs = require("fs")
  const PAD = 48

//Die on unhandled promises
  process.on("unhandledRejection", error => { throw error })

//Process
  ;(async () => {

    //Compute and display parameters
      const tile = {
        width:argv.tileWidth||16,
        height:argv.tileHeight||16,
        spacing:argv.spacing||0,
        spaced:{
          get width() { return tile.width+tile.spacing },
          get height() { return tile.height+tile.spacing },
        },
        half:{
          get spacing() { return Math.floor(tile.spacing/2) }
        }
      }
      const tileset = {
        width:argv.tilesetWidth||2036,
        height:argv.tilesetHeight||2036,
        margin:argv.margin||0,
        get destination() { return path.join(__dirname, "..", argv.destination) },
      }
      ;[["tile", tile], ["tileset", tileset]].map(([name, object]) => process.stdout.write(`${name} => ${util.inspect(object, {getters:true}).replace(/\[Getter:?(.*?)\]/g, "$1")}\n`.cyan))
      process.stdout.write(`\nTILESET-JSON : \n`)

    //Instantiate metadata
      let i = 0
      const json = {
        meta:{
          format:"RGBA8888",
          image:"tileset.textures.webp",
          size:{
            w:tileset.width,
            h:tileset.height,
          },
          scale:1
        },
        frames:{}
      }

    //Generate frames
      process.stdout.write(`${"Generating frames".padEnd(PAD)} ...\r`.yellow)
      for (let y = tileset.margin + tile.half.spacing; y < tileset.height; y+=tile.spaced.height) {
        for (let x = tileset.margin + tile.half.spacing; x < tileset.width; x+=tile.spaced.width) {
          process.stdout.write(`${"Generating frames".padEnd(PAD)} ${i}\r`.yellow)
          json.frames[i++] = {
            frame:{x, y, w:tile.width, h:tile.height},
            rotated:false,
            trimmed:false,
            spriteSourceSize:{x:0, y:0, w:tile.width, h:tile.height},
            sourceSize:{w:tile.width, h:tile.height}
          }
        }
      }
      process.stdout.write(`${"Generating frames".padEnd(PAD)} OK${" ".repeat(16)}\n`.green)

    //Save
      process.stdout.write(`${"Saving".padEnd(PAD)} ...\r`.yellow)
      fs.writeFileSync(tileset.destination, JSON.stringify(json))
      process.stdout.write(`${"Saving".padEnd(PAD)} OK \n`.green)

    //Success
      process.stdout.write(`Success \n\n`.green)

  })()