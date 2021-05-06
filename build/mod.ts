import {clone} from "./clone.ts"
import {dex} from "./dex.ts"
import {encounters} from "./encounters.ts"

if (import.meta.main) {
  await clone({repository:"https://github.com/PokeAPI/api-data.git", target:"build/data"})
  await clone({repository:"https://github.com/msikma/pokesprite.git", target:"build/sprites"})
  console.log({
    //dex:await dex(),
    //encounters:await encounters(),
  })
}