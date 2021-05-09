//Imports
import { parse } from "https://deno.land/std@0.95.0/flags/mod.ts"
import { clone } from "./clone.ts"
import { dex } from "./dex.ts"
import { diff } from "./diff.ts"
import { report } from "./report.ts"
import { encounters } from "./encounters.ts"
import { map } from "./map.ts"
import { tiles } from "./tiles.ts"
const args = parse(Deno.args.map(arg => arg.replace(/^"/g, "").replace(/"$/, "")), { string: ["diff", "sha"] })

//Main
if (import.meta.main) {
  if ((args.data) || (args.all)) {
    await clone({ repository: "https://github.com/PokeAPI/api-data.git", target: "build/data" })
    await clone({ repository: "https://github.com/msikma/pokesprite.git", target: "build/creatures" })
    await Deno.writeTextFile("server/data/maps/overworld.gracidea.json", JSON.stringify(await map("overworld", await encounters(await dex()))))
  }
  if ((args.sprites) || (args.all))
    await tiles({ file: "maps/overworld/tileset3.png" })
    console.log(args)
  if ((args.head) && (args.sha)) {
    const {head, sha} = args
    await report([await diff("overworld", { main: "lowlighter:main", head, sha })], {sha})
  }
}
