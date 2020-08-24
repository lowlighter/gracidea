/**
 * Copyright 2017, Lecoq Simon (@lowlighter)
 *
 * This script is an utilitary pipeline which compute diffs in map between two branches
 */

//Dependancies
  const argv = require("minimist")(process.argv.slice(2))
  const path = require("path")
  const axios = require("axios")
  const colors = require("colors")
  const fs = require("fs")
  const util = require("util")
  const git = require("simple-git/promise")(path.join(__dirname, ".."))
  const Octokit = require("@octokit/rest").Octokit
  const pixelmatch = require("pixelmatch")
  const PNG = require("pngjs").PNG
  const jimp = require("jimp")
  const PAD = 48

//Die on unhandled promises
  process.on("unhandledRejection", error => { throw error })

//Parse map
  function parse(map) {
    const parsed = {}
    const layers = Object.fromEntries(map.data.layers.map(layer => [layer.name, layer]))
    for (let layer of Object.keys(layers))
      if (layers[layer].chunks)
        parsed[layer] = Object.fromEntries(layers[layer].chunks.map(chunk => [`[x:${chunk.x}, y${chunk.y}]`, chunk]))
    return parsed
  }

//Process
  ;(async () => {
    //Compute and display parameters
      diffs = {
        branch:{
          remote:argv.branch||"lowlighter:master",
          local:(await git.status()).current
        },
        map:{
          name:argv.map,
          get path() { return path.join(__dirname, "../maps", diffs.map.name, "map.json") }
        },
        tileset:{
          width:argv.tilesetWidth||2036,
          height:argv.tilesetHeight||2036,
          get path() { return path.join(__dirname, "../maps", diffs.map.name, "tileset.textures.png") },
        },
        bot:{
          token:argv.token||null,
          pr:argv.event ? {event:JSON.parse(fs.readFileSync(argv.event, "utf8").toString()).pull_request} : null
        }
      }
      const data = {remote:{map:null, tileset:null}, local:{map:null, tileset:null}}
      process.stdout.write(`diffs => ${util.inspect(diffs, {getters:true}).replace(/\[Getter:?(.*?)\]/g, "$1")}\n`.cyan)
      process.stdout.write(`\nMAP-BRANCH-DIFF : \n`)

    //Load local branch
      try {
        process.stdout.write(`${`Retrieve (local):${diffs.branch.local} content`.padEnd(PAD)} ...\r`.yellow)
        data.local.map = parse({data:JSON.parse(fs.readFileSync(diffs.map.path).toString())})
        data.local.tileset = fs.readFileSync(diffs.tileset.path)
        process.stdout.write(`${`Retrieve (local):${diffs.branch.local} content`.padEnd(PAD)} OK \n`.green)
      }
      catch (error) {
        process.stdout.write(`${`Retrieve ${diffs.branch.local} content`.padEnd(PAD)} KO \n`.red)
        throw error
      }

    //Load remote branch
      try {
        process.stdout.write(`${`Retrieve ${diffs.branch.remote} content`.padEnd(PAD)} ...\r`.yellow)
        const [,user, branch] = diffs.branch.remote.match(/^(.+?):(.+)$/)
        data.remote.map = parse(await axios.get(`https://raw.githubusercontent.com/${user}/gracidea/${branch}/maps/${diffs.map.name}/map.json`))
        data.remote.tileset = await jimp.read((await axios(`https://raw.githubusercontent.com/${user}/gracidea/${branch}/maps/${diffs.map.name}/tileset.textures.png?raw=true`, {responseType:"blob"})).data)
        process.stdout.write(`${`Retrieve ${diffs.branch.remote} content`.padEnd(PAD)} OK \n`.green)
      }
      catch (error) {
        process.stdout.write(`${`Retrieve ${diffs.branch.remote} content`.padEnd(PAD)} KO \n`.red)
        throw error
      }

    //Compute diff
      //Map diff
        const diff = {"+":0, "-":0, "~":0, "=":0, chunks:new Set(), tileset:{image:null, "~":0}}
        process.stdout.write(`${`Compute map diff`.padEnd(PAD)} ...\r`.yellow)
        for (let layer of Object.keys(data.local.map)) {
          for (let chunk of Object.keys(data.local.map[layer])) {
            for (let [index, texture] of Object.entries(data.local.map[layer][chunk].data)) {
              //Adjust index
                const prev = (data.remote.map?.[layer]?.[chunk]?.data?.[index]||0)-1
                texture--
              //New texture
                if ((prev === -1)&&(texture >= 0))
                  (diff["+"]++, diff.chunks.add(chunk))
              //Deleted texture
                else if ((texture === -1)&&(prev >= 0))
                  (diff["-"]++, diff.chunks.add(chunk))
              //Untouched texture
                else if ((prev === texture)&&(texture >= 0))
                  diff["="]++
              //Edited texture
                else if ((prev >= 0)&&(texture >= 0))
                  (diff["~"]++, diff.chunks.add(chunk))
            }
          }
          process.stdout.write(`${`Compute map diff`.padEnd(PAD)} ...\r`.yellow)
        }
        process.stdout.write(`${`Compute map diff`.padEnd(PAD)} OK \n`.green)
      //Tileset diff
        process.stdout.write(`${"Compute tileset diff".padEnd(PAD)} ...\r`.yellow)
        //Pixelmatch
          diff.tileset.image = new PNG({width:diffs.tileset.width, height:diffs.tileset.height})
          pixelmatch(PNG.sync.read(data.local.tileset).data, PNG.sync.read(data.remote.tileset).data, diff.tileset.image.data, diffs.tileset.width, diffs.tileset.height, {threshold:0, includeAA:true, diffColor:[255, 165, 0], diffMask:true})
        //Generate diff image
          diff.tileset.image = await jimp.read(PNG.sync.write(diff.tileset.image))
          const original = await jimp.read(diffs.tileset.path)
          diff.tileset.image = await original.clone().mask(diff.tileset.image, 0, 0).composite(original.greyscale().opacity(.05), 0, 0).getBufferAsync(jimp.MIME_PNG)
        //Compute edited pixels
          diff.tileset["~"] = Math.round(jimp.diff(await jimp.read(data.local.tileset), await jimp.read(data.remote.tileset), 0).percent * diffs.tileset.width * diffs.tileset.height)
        process.stdout.write(`${"Compute diff".padEnd(PAD)} OK${" ".repeat(16)}\n`.green)
      process.stdout.write(`\nresult => ${util.inspect(diff)}\n`.cyan)

    //Bot recap comment
      if ((diffs.bot.token)&&(diffs.bot.pr.event)) {
        //Preparation
          process.stdout.write(`${`Bot comment`.padEnd(PAD)} ...\r`.yellow)
          const revision = {map:(diff["+"] + diff["-"] + diff["~"] > 0), tileset:(diff.tileset["~"] > 0)}
          const octokit = new Octokit({auth:diffs.bot.token})
          const branch = diffs.bot.pr.event.head.ref
          const owner = diffs.bot.pr.event.user.login
          const pr = diffs.bot.pr.event.number
        //Attached files
          if (revision.tileset) {
            process.stdout.write(`${`Bot file upload`.padEnd(PAD)} ...\r`.yellow)
            await octokit.repos.createOrUpdateFileContents({
              owner:"botlighter",
              repo:"storage",
              path:`gracidea/${diffs.bot.pr.event.id}.png`,
              message:"Upload attached file",
              content:diff.tileset.image.toString("base64"),
            })
            process.stdout.write(`${`Bot file upload`.padEnd(PAD)} OK \n`.green)
          }
        //
          if ((revision.map)||(revision.tileset)) {
            process.stdout.write(`${`Bot recap comment`.padEnd(PAD)} ...\r`.yellow)
            await octokit.issues.createComment({owner:"lowlighter", repo:"gracidea", issue_number:pr,
              body:[
                "#${pr} @${owner}/${branch}",
                "```diff",
                revision.map ? "@@ Map revision @@" : "",
                revision.map ? `## ${diff.chunks.size} chunk${diff.chunks.size > 1 ? "s" : ""} impacted` : "",
                revision.map && diff["+"] ? `++ ${diff["+"]} added tile${diff["+"] > 1 ? "s" : ""}` : "",
                revision.map && diff["~"] ? `+~ ${diff["~"]} edited tile${diff["~"] > 1 ? "s" : ""}` : "",
                revision.map && diff["-"] ? `-- ${diff["-"]} removed tile${diff["-"] > 1 ? "s" : ""}` : "",
                revision.map && diff["="] ? `== ${diff["="]} unchanged tile${diff["="] > 1 ? "s" : ""}` : "",
                revision.map && revision.tileset ? " " : "",
                revision.tileset ? "@@ Tileset revision @@" : "",
                revision.tileset && diff.tileset["~"] ? `+~ ${diff.tileset["~"]} edited pixel${diff.tileset["~"] > 1 ? "s" : ""} (estimatation)` : "",
                "```",
                revision.map ? `🔗[🗺️ Map diff](https://gracidea.lecoq.io/?branch=${owner}:${branch}&diff=true)` : "",
                revision.map ? "<details><summary>📝 Edited chunk list</summary><p>" : "",
                revision.map ? " " : "",
                revision.map ? "```text" : "",
                revision.map ? [...diff.chunks].join(" ") : "",
                revision.map ? "```" : "",
                revision.map ? " " : "",
                revision.map ? "</p></details>" : "",
                revision.tileset ? "<details><summary>🖼️ Edited tileset</summary><p>" : "",
                revision.tileset ? " " : "",
                revision.tileset ? `![tileset.png](https://github.com/botlighter/storage/blob/master/gracidea/${diffs.bot.pr.event.id}.png?raw=true)` : "",
                revision.tileset ? " " : "",
                revision.tileset ? "</p></details>" : "",
              ].filter(line => line.length).join("\n")
            })
            process.stdout.write(`${`Bot recap comment`.padEnd(PAD)} OK \n`.green)
          }
      }

  })()
