//Imports
import { parse } from "https://deno.land/std@0.95.0/flags/mod.ts"
import { clone } from "./clone.ts"
import { loose } from "./constants.ts"
import { map } from "./map.ts"
import { patch } from "./patch.ts"
import { report } from "./report.ts"
import { template } from "./templates.ts"
import { tiles } from "./tiles.ts"
const args = parse(Deno.args.map(arg => arg.replace(/^"/g, "").replace(/"$/, "")), { string: ["head", "sha"] })

//Main
if (import.meta.main) {
  if ((args.data) || (args.all)) {
    await clone({ repository: "PokeAPI/api-data", target: "build/data" })
    await clone({ repository: "msikma/pokesprite", target: "build/creatures" })
  }
  const { head, sha } = args
  const patches = [] as loose[]
  for (const name of ["overworld"]) {
    if ((args.data) || (args.all))
      await map(name)
    if ((args.sprites) || (args.all))
      await tiles({ file: `maps/${name}/tileset3.png` })
    if ((args.patch) && (args.sha))
      patches.push(await patch(name, { main: "lowlighter:main", head, sha }))
  }
  if ((args.patch) && (args.sha))
    await report(patches, { sha })
  if ((args.templates) || (args.all))
    await template({ from: "client/templates", to: "client/static" })
}
