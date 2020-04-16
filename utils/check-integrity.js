/**
 * Copyright 2017, Lecoq Simon (@lowlighter)
 *
 * This script is an utilitary pipeline which checks that code and tileset has been rebuild, and that all files (json, xml, etc.) have a correct syntax.
 */

//Dependancies
  const path = require("path")
  const argv = require("minimist")(process.argv.slice(2))
  const colors = require("colors")
  const util = require("util")
  const fs = require("fs")
  const { execSync:exec } = require("child_process")
  const git = require("simple-git/promise")(path.join(__dirname, ".."))
  const xml2js = require("xml2js")
  const PAD = 48
  let checks = {}
  
//Die on unhandled promises
  process.on("unhandledRejection", error => { 
    process.stdout.write(`\nA fatal error occured \n\n`.red)
    console.error(error)
    process.exit(2)
  })

//Check
  async function check({name, when = true, assert = () => true, fix, verbose}) {
    //Check if applicable
      if (when) {
        let result = false
        process.stdout.write(`${name.padEnd(PAD)} ...\r`.yellow)
        try {
          //Check if assertion is verified
            if (await assert()) 
              result = true
          //Try to fix problem if possible
            else if ((checks.and.fix)&&(fix)) {
              process.stdout.write(`${name.padEnd(PAD)} fixing\r`.yellow)
              const fixed = fix()
              if ((await assert())||(fixed))
                result = true
              else
                throw false
            }
          //Fail
            else
              throw false
        } 
        catch(error) {  
          if (fix)
            process.stdout.write(`${name.padEnd(PAD)} KO`.red+` (can be possibly fixed by running --fix)\n`.yellow)
          else
            process.stdout.write(`${name.padEnd(PAD)} KO${" ".repeat(16)}\n`.red)
          result = error
        }
        finally {
          //Success
            if (result === true) {
              process.stdout.write(`${name.padEnd(PAD)} OK${" ".repeat(16)}\n`.green)
              return true
            }
          //Die 
            if (checks.and.die)
              throw result
          return false
        }
      }
    //Verbose
      if (verbose)
        process.stdout.write(`${name.padEnd(PAD)} OK \n`.green)
      return true
  }

//Process
  ;(async () => {

    //Compute and display parameters
      checks = {
        and:{
          die:argv.die||false,
          fix:argv.fix||false,
        },
        paths:{
          maps:path.join(__dirname, "../maps"),
          lang:path.join(__dirname, "../client/lang")
        },
      }
      process.stdout.write(`checks => ${util.inspect(checks, {getters:true}).replace(/\[Getter:?(.*?)\]/g, "$1")}\n`.cyan)
      process.stdout.write(`\nCHECK-INTEGRITY : \n`)
      checks.status = 1
      checks.error = null

    //Status
      const status = await git.status()
   
    //Check source code and rebuild it if needed
      {
        process.stdout.write(`Source code\n`)
        checks.status &= await check({
          name:"Build", 
          when:status.modified.filter(file => file.startsWith("client/js/src/")).length, 
          assert() { return false },
          fix() { return exec("npm run build-code"), true },
          verbose:true
        })
      }

    //Check lang files integrity
      {
        process.stdout.write(`Lang files\n`)
        const langs = fs.readdirSync(checks.paths.lang)
        for (let lang of langs)
          checks.status &= await check({
            name:lang, 
            assert() { return JSON.parse(fs.readFileSync(path.join(checks.paths.lang, lang)).toString()), true } 
          })
      }

    //Check maps integrity
      {
        process.stdout.write(`Maps files\n`)
        const maps = fs.readdirSync(checks.paths.maps).filter(entry => fs.statSync(path.join(checks.paths.maps, entry)).isDirectory())
        for (let map of maps) {
          
          //Check json files integrity
            for (let json of ["map.json", "locations.json", "tileset.textures.json", "textures.json"]) 
              checks.status &= await check({
                name:path.join(map, json),
                when:fs.existsSync(path.join(checks.paths.maps, map, json)),
                async assert() { return JSON.parse(fs.readFileSync(path.join(checks.paths.maps, map, json)).toString()), true }
              })
            
          //Check xml files integrity
            for (let xml of ["map.tmx", "tileset.tsx", "textures.tps"]) 
              checks.status &= await check({
                name:path.join(map, xml),
                when:fs.existsSync(path.join(checks.paths.maps, map, xml)),
                async assert() { return await (new xml2js.Parser()).parseStringPromise(fs.readFileSync(path.join(checks.paths.maps, map, xml)).toString()), true }
              })
              
          //Check tileset and rebuild if needed
            const tileset = {raw:path.join(checks.paths.maps, map, "tileset.textures.raw.png"), used:path.join(checks.paths.maps, map, "tileset.textures.png")}
            checks.status &= await check({
              name:"tileset.textures.png",
              when:fs.existsSync(tileset.raw),
              assert() { 
                const used = fs.statSync(tileset.used)
                const raw = fs.statSync(tileset.raw)
                return ((used.ctimeMs === used.mtimeMs)&&(raw.ctimeMs === raw.mtimeMs))||(used.mtimeMs > raw.mtimeMs)
              },
              fix() { return exec(`npm run build-tileset-sprite-${map}`), true },
              verbose:true
            })
              
        }
        
        process.stdout.write(`\n`)
      }

    //Error
      if (!checks.status) {
        process.stdout.write(`\nOne of check above has failed \n\n`.red)
        process.exit(1)
      }

    //Success
      process.stdout.write(`\nSuccess \n\n`.green)
    
  })()

 

