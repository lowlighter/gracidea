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
  const PAD = 48

//Parse map
  function parse(map) {
    const parsed = {}
    const layers = Object.fromEntries(map.data.layers.map(layer => [layer.name, layer]))
    for (let layer of Object.keys(layers))
      if (layers[layer].chunks)
        parsed[layer] = Object.fromEntries(layers[layer].chunks.map(chunk => [`${chunk.x};${chunk.y}`, chunk]))
    return parsed
  }

  ;(async () => {
    //Compute and display parameters
      diffs = {
        branch:{
          remote:argv.branch||"lowlighter.master",
          local:(await git.status()).current
        },
        map:{
          name:argv.map,
          get path() { return path.join(__dirname, "../maps", diffs.map.name, "map.json") }
        },
        bot:{
          token:argv.token||null,
          pr:{
            event:argv.event ? JSON.parse(fs.readFileSync(argv.event, "utf8")).pull_request : null,
            id:argv.pr||NaN,
            owner:argv.owner||"",
          }
        }
      }
      const data = {remote:null, local:null}
      process.stdout.write(`diffs => ${util.inspect(diffs, {getters:true}).replace(/\[Getter:?(.*?)\]/g, "$1")}\n`.cyan)
      process.stdout.write(`\nMAP-BRANCH-DIFF : \n`)

    //Load local branch
      try {
        process.stdout.write(`${`Retrieve local.${diffs.branch.local} content`.padEnd(PAD)} ...\r`.yellow)
        data.local = parse({data:JSON.parse(fs.readFileSync(diffs.map.path).toString())})
        process.stdout.write(`${`Retrieve local.${diffs.branch.local} content`.padEnd(PAD)} OK \n`.green)
      }
      catch (error) {
        process.stdout.write(`${`Retrieve ${diffs.branch.local} content`.padEnd(PAD)} KO \n`.red)
        throw error
      }

    //Load remote branch
      try {
        process.stdout.write(`${`Retrieve ${diffs.branch.remote} content`.padEnd(PAD)} ...\r`.yellow)
        const [,user, branch] = diffs.branch.remote.match(/^(.+?)[.](.+)$/)
        data.remote = parse(await axios.get(`https://raw.githubusercontent.com/${user}/gracidea/${branch}/maps/${diffs.map.name}/map.json`))
        process.stdout.write(`${`Retrieve ${diffs.branch.remote} content`.padEnd(PAD)} OK \n`.green)
      }
      catch (error) {
        process.stdout.write(`${`Retrieve ${diffs.branch.remote} content`.padEnd(PAD)} KO \n`.red)
        throw error
      }

  //Compute diff
      const diff = {"+":0, "-":0, "~":0, "=":0}
      process.stdout.write(`${`Compute diff`.padEnd(PAD)} ...\r`.yellow)
      for (let layer of Object.keys(data.local)) {
        layer= "01-ground"
        for (let chunk of Object.keys(data.local[layer])) {
          for (let [index, texture] of Object.entries(data.local[layer][chunk].data)) {
            //Adjust index
              const prev = (data.remote?.[layer]?.[chunk]?.data?.[index]||0)-1
              texture--
            //New texture
              if ((prev === -1)&&(texture >= 0))
                diff["+"]++
            //Deleted texture
              else if ((texture === -1)&&(prev >= 0))
                diff["-"]++
            //Untouched texture
              else if ((prev === texture)&&(texture >= 0))
                diff["="]++
            //Edited texture
              else if ((prev >= 0)&&(texture >= 0))
                diff["~"]++
          }
        }
        process.stdout.write(`${`Compute diff`.padEnd(PAD)} ... (${JSON.stringify(diff)})\r`.yellow)
      }
      process.stdout.write(`${`Compute diff`.padEnd(PAD)} OK  (${JSON.stringify(diff)})\n`.green)

    //Bot recap comment
      if (diffs.bot.token) {
        process.stdout.write(`${`Bot comment`.padEnd(PAD)} ...\r`.yellow)
        octokit = new Octokit({auth:diffs.bot.token, log: console})
        await octokit.issues.createComment({owner:"lowlighter", repo:"gracidea", issue_number:diffs.bot.pr.id,
          body:[
            "```diff",
            "@@ Map revision diff @@",
            diff["+"] ? `++ ${diff["+"]} added tile${diff["+"] > 1 ? "s" : ""}` : "",
            diff["~"] ? `+~ ${diff["~"]} edited tile${diff["~"] > 1 ? "s" : ""}` : "",
            diff["-"] ? `-- ${diff["-"]} removed tile${diff["-"] > 1 ? "s" : ""}` : "",
            diff["="] ? `== ${diff["="]} unchanged tile${diff["="] > 1 ? "s" : ""}` : "",
            "```",
            `[🗺️ See map diff for pull request #${diffs.bot.pr.id} @${diffs.bot.pr.owner}/${diffs.branch.local}](https://gracidea.lecoq.io/?branch=${diffs.bot.pr.owner}.${diffs.branch.local}&diff=true)`,
          ].filter(line => line.length).join("\n")
        })
        process.stdout.write(`${`Bot comment`.padEnd(PAD)} OK \n`.green)
      }

  })()
