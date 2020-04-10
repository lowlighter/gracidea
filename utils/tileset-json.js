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
      }
      const tileset = {
        width:argv.tilesetWidth||2036,
        height:argv.tilesetHeight||2036,
        margin:argv.margin||0,
        get destination() { return path.join(__dirname, argv.destination) },
      }
      ;[["tile", tile], ["tileset", tileset]].map(([name, object]) => process.stdout.write(`${name} => ${util.inspect(object, {getters:true}).replace(/\[Getter:?(.*?)\]/g, "$1")}\n`.cyan))
      process.stdout.write(`\nPROCESSING : \n`)

    //Instantiate metadata
      let i = 0
      const json = {
        meta:{
          format:"RGBA8888",
          image:"tileset.textures.png",
          size:{
            w:tileset.width,
            h:tileset.height,
          },
          scale:1
        },
        frames:{}
      }

    //Generate frames
      process.stdout.write(`Generating frames   ...\r`.yellow)
      for (let y = tileset.margin; y < tileset.height; y+=tile.spaced.height) {
        for (let x = tileset.margin; x < tileset.width; x+=tile.spaced.width) {
          json.frames[i++] = {
            frame:{x, y, w:tile.width, h:tile.height},
            rotated:false,
            trimmed:false,
            spriteSourceSize:{x:0, y:0, w:tile.width, h:tile.height},
            sourceSize:{w:tile.width, h:tile.height}
          }
          process.stdout.write(`Generating frames   n°${i}\r`.yellow)
        }
      }
      process.stdout.write(`Generating frames   Done${" ".repeat(16)}\n`.green)  
          
    //Save
      process.stdout.write(`Saving              ...\r`.yellow)
      fs.writeFileSync(tileset.destination, JSON.stringify(json))
      process.stdout.write(`Saving              Done\n`.green)
        
  })()