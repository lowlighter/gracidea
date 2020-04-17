/**
 * Copyright 2017, Lecoq Simon (@lowlighter)
 *
 * This script is an utilitary pipeline which extrude and recompose tileset.
 * It is needed to prevent bleeding effects.
 */

//Dependancies
  const {extrudeTilesetToBuffer:extruder} = require("tile-extruder")
  const jimp = require("jimp")
  const argv = require("minimist")(process.argv.slice(2))
  const path = require("path")
  const util = require("util")
  const fs = require("fs")
  const pngitxt = require("png-itxt")
  const colors = require("colors")
  const crypto = require("crypto")
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
        extrusion:argv.extrusion||0,
        spaced:{
          get width() { return tile.width+tile.spacing },
          get height() { return tile.height+tile.spacing },
        },
        extruded:{
          get width() { return tile.width+2*tile.extrusion },
          get height() { return tile.height+2*tile.extrusion },
          spaced:{
            get width() { return tile.extruded.width+tile.spacing },
            get height() { return tile.extruded.height+tile.spacing },
          },
        },
      }
      const tileset = {
        force:argv.force||false,
        max:{size:2048},
        margin:{
          full:argv.margin||0,
          get half() { return Math.floor(tileset.margin.full/2) },
        },
        tiles:{
          get x() { return Math.floor((tileset.max.size - 2*tileset.margin.full)/tile.spaced.width) },
          get y() { return Math.floor((tileset.max.size - 2*tileset.margin.full)/tile.spaced.height) },
          get total() { return tileset.tiles.x*tileset.tiles.y }
        },
        hash:null,
        get width() { return tileset.margin.full + tileset.tiles.x*tile.extruded.width },
        get height() { return tileset.margin.full + tileset.tiles.y*tile.extruded.height },
        get source() { return path.join(__dirname, "..", argv.source) },
        get destination() { return path.join(__dirname, "..", argv.destination||argv.source.replace(/\.raw\.png$/, ".png")) },
        get tmp() { return this.destination.replace(/\.png/, ".tmp.png") },
        get options() { return {mime:"image/png", margin:tileset.margin.full, spacing:tile.spacing, extrusion:tile.extrusion} }
      }
      tileset.hash = {
        current:fs.existsSync(tileset.destination) ? await new Promise((solve, reject) => fs.createReadStream(tileset.destination).pipe(pngitxt.get("generated-for", (error, data) => error ? reject(error) : solve(data.value)))) : null,
        generated:crypto.createHash("md5").update(fs.readFileSync(tileset.source).toString()).digest("hex"),
      }

    //Check mode
      if (argv.check) 
      process.exit((tileset.hash.current === tileset.hash.generated) ? 0 : 1)

    //Display parameters
      ;[["tile", tile], ["tileset", tileset]].map(([name, object]) => process.stdout.write(`${name} => ${util.inspect(object, {getters:true}).replace(/\[Getter:?(.*?)\]/g, "$1")}\n`.cyan))
      process.stdout.write(`\nTILESET-SPRITE : \n`)

    //Check if rebuild is needed
      if ((tileset.hash.current === tileset.hash.generated)&&(!tileset.force)) {
        process.stdout.write(`Skipped because tileset has already be generated for source image [hash#${tileset.hash.current}]\n`.gray)
        return
      }

    //Extrude
      process.stdout.write(`${"Extruding".padEnd(PAD)} ...\r`.yellow)
      const buffer = await extruder(tile.width, tile.height, tileset.source, tileset.options)
      process.stdout.write(`${"Extruding".padEnd(PAD)} OK \n`.green)

    //Compose
      process.stdout.write(`${"Composing".padEnd(PAD)} ...\r`.yellow)
      const input = await jimp.read(buffer)
      const output = await new jimp(tileset.width, tileset.height, 0x0)
      for (let y = 0; y < tileset.tiles.y; y++) {
        for (let x = 0; x < tileset.tiles.x; x++) { 
          process.stdout.write(`${"Composing".padEnd(PAD)} ${y*tileset.tiles.x}/${tileset.tiles.total}\r`.yellow)
          const cropped = input.clone().crop(tileset.margin.full + x*(tile.extruded.spaced.width), tileset.margin.full + y*(tile.extruded.spaced.height), tile.extruded.width, tile.extruded.height)
          output.composite(cropped, tileset.margin.half+x*tile.extruded.width, tileset.margin.half+y*tile.extruded.height)
        }
      }
      process.stdout.write(`${"Composing".padEnd(PAD)} OK${" ".repeat(16)}\n`.green)
      
    //Save
      process.stdout.write(`${"Saving".padEnd(PAD)} ...\r`.yellow)
      await output.writeAsync(tileset.tmp)
      process.stdout.write(`${"Saving".padEnd(PAD)} OK \n`.green)

    //Updating itxt metadata
      process.stdout.write(`${"Updating itxt".padEnd(PAD)} ...\r`.yellow)
      await new Promise(solve => {
        const out = fs.createWriteStream(tileset.destination)
        out.on("finish", solve)
        fs.createReadStream(tileset.tmp)
          .pipe(pngitxt.set({keyword:"generated-for", value:tileset.hash.generated}))
          .pipe(out)
      })
      fs.unlinkSync(tileset.tmp)
      process.stdout.write(`${"Updating itxt".padEnd(PAD)} OK \n`.green)
      
    //Success
      process.stdout.write(`Success \n\n`.green)
        
  })()