//Imports
import { clone } from "./clone.ts"
import { dex } from "./dex.ts"
import { encounters } from "./encounters.ts"
import { map } from "./map.ts"

//Main
if (import.meta.main) {
  await clone({ repository: "https://github.com/PokeAPI/api-data.git", target: "build/data" })
  await clone({ repository: "https://github.com/msikma/pokesprite.git", target: "build/creatures" })
  await Deno.writeTextFile("server/data/maps/overworld.gracidea.json", JSON.stringify(await map(await encounters(await dex()))))
}
