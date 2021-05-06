import {clone} from "./clone.ts"
import {dex} from "./dex.ts"
import {encounters} from "./encounters.ts"

if (import.meta.main) {
  await clone({repository:"https://github.com/PokeAPI/api-data.git", target:"build/data"})
  console.log({
    //dex:await dex(),
    //encounters:await encounters(),
  })
}