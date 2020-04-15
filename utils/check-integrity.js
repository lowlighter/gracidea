/**
 * Copyright 2017, Lecoq Simon (@lowlighter)
 *
 * This script is an utilitary pipeline which checks that code and tileset has been rebuild, and that all files (json, xml, etc.) have a correct syntax.
 */

//Dependancies
  const path = require("path")
  const colors = require("colors")
  const fs = require("fs")
  const { execSync:exec } = require("child_process")
  const git = require("simple-git/promise")(path.join(__dirname, ".."))
  const xml2js = require("xml2js")
  const PAD = 48
  
//Die on unhandled promises
  process.on("unhandledRejection", error => { throw error })

//Process
  ;(async () => {

    //Paths
      const paths = {
        maps:path.join(__dirname, "../maps"),
        lang:path.join(__dirname, "../client/lang")
      }
      
    //Status
      const status = await git.status()
   
    //Check source code and rebuild it if needed
      {
        process.stdout.write(`Source code\n`)
        const modified = status.modified.filter(file => file.startsWith("client/js/src/"))
        if (modified.length) {
          process.stdout.write(`${"Build".padEnd(PAD)} ...\r`.yellow)
          try {
            exec("npm run build-code")
          } catch(e) {  
            process.stdout.write(`${"Build".padEnd(PAD)} KO \n`.red)
            throw e
          }
        }
        process.stdout.write(`${"Build".padEnd(PAD)} OK \n\n`.green)
      }

    //Check lang files integrity
      {
        process.stdout.write(`Lang files\n`)
        const langs = fs.readdirSync(paths.lang)
        for (let lang of langs) {
          process.stdout.write(`${lang.padEnd(PAD)} ...\r`.yellow)
          try {
            JSON.parse(fs.readFileSync(path.join(paths.lang, lang)).toString())
          } catch(e) {  
            process.stdout.write(`${lang.padEnd(PAD)} KO \n`.red)
            throw e
          }
          process.stdout.write(`${lang.padEnd(PAD)} OK \n`.green)
        }
        process.stdout.write(`\n`)
      }

    //Check maps integrity
      {
        process.stdout.write(`Maps files\n`)
        const maps = fs.readdirSync(paths.maps).filter(entry => fs.statSync(path.join(paths.maps, entry)).isDirectory())
        for (let map of maps) {
  
          //Check json files integrity
            for (let json of ["map.json", "locations.json", "tileset.textures.json", "textures.json"]) {
              if (fs.existsSync(path.join(paths.maps, map, json))) {
                process.stdout.write(`${path.join(map, json).padEnd(PAD)} ...\r`.yellow)
                try {
                  JSON.parse(fs.readFileSync(path.join(paths.maps, map, json)).toString())
                } catch(e) {  
                  process.stdout.write(`${path.join(map, json).padEnd(PAD)} KO \n`.red)
                  throw e
                }
                process.stdout.write(`${path.join(map, json).padEnd(PAD)} OK \n`.green)
              }
            }

          //Check xml files integrity
            for (let xml of ["map.tmx", "tileset.tsx", "textures.tps"]) {
              if (fs.existsSync(path.join(paths.maps, map, xml))) {
                process.stdout.write(`${path.join(map, xml).padEnd(PAD)} ...\r`.yellow)
                try {
                  const parser = new xml2js.Parser()
                  await parser.parseStringPromise(fs.readFileSync(path.join(paths.maps, map, xml)).toString())
                } catch(e) {  
                  process.stdout.write(`${path.join(map, xml).padEnd(PAD)} KO \n`.red)
                  throw e
                }
                process.stdout.write(`${path.join(map, xml).padEnd(PAD)} OK \n`.green)
              }
            }

          //Check tileset and rebuild if needed
            const tileset = {raw:path.join(paths.maps, map, "tileset.textures.raw.png"), used:path.join(paths.maps, map, "tileset.textures.png")}
            if (fs.existsSync(tileset.raw)) {
              process.stdout.write(`${"tileset.textures.png".padEnd(PAD)} ...\r`.yellow)
              if (fs.statSync(tileset.raw).mtimeMs > fs.statSync(tileset.used).mtimeMs) {
                try {
                  exec(`npm run build-tileset-sprite-${map}`)
                } catch(e) {  
                  process.stdout.write(`${"tileset.textures.png".padEnd(PAD)} KO \n`.red)
                  throw e
                }
                process.stdout.write(`${"tileset.textures.png".padEnd(PAD)} OK \n`.green)
              }
              else
                process.stdout.write(`${"tileset.textures.png".padEnd(PAD)} OK (skipped)\n`.green)
            }
        }
        
        process.stdout.write(`\n`)
      }

    //Success
      process.stdout.write(`Success \n\n`.green)
    
  })()

 

