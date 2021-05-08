//Imports
import { ExportedDexData } from "./dex.ts"

//API endpoint
const API = "build/data/data/api/v2/location-area"

/** Build encounters data */
export async function encounters(dex?: ExportedDexData, methods = [] as string[]) {
  console.debug(`building: encounters data`)
  const exported = {} as ExportedEncountersData
  for await (const { name: id, isFile } of Deno.readDir(API)) {
    //Load area data
    if (isFile)
      continue
    const { name: area, pokemon_encounters:creaturesEncounters } = JSON.parse(await Deno.readTextFile(`${API}/${id}/index.json`))
    console.debug(`processing: ${id} (${area})`)

    //Extract encounter rates
    const encounters = {} as encounters
    creaturesEncounters
      //Extract names and merge details by encounter method
      .map(({ pokemon: { name = "" }, version_details = [] }) => ({
        name,
        rates: version_details.flatMap(({ encounter_details = [] }) => encounter_details.map(({ chance = 0, method: { name = "" } }) => ({ chance, method: name }))),
      }))
      //Store encounters by method, pokemon and merge encounter rates
      .map(({ name = "", rates = [] }) =>
        rates.map(({ method = "", chance = 0 }) => {
          if ((methods.length) && (!methods.includes(method)))
            return
          encounters[method] ??= {}
          encounters[method][name] ??= 0
          encounters[method][name] = Math.max(chance, encounters[method][name])
        })
      )
    //Normalize rates
    Object.values(encounters).map(rates => {
      const total = Object.values(rates).reduce((a, b) => a + b, 0)
      Object.entries(rates).map(([pokemon, chance]) => rates[pokemon] = chance / total)
    })
    //Apply gender rates
    if (dex) {
      Object.values(encounters).map(rates =>
        Object.keys(rates).map(async pokemon => {
          if (await hasFemaleSprite(pokemon)) {
            rates[`female/${pokemon}`] = rates[pokemon] * dex[pokemon]["female"]
            rates[pokemon] *= dex[pokemon]["male"]
          }
        })
      )
    }
    exported[area] = encounters
  }
  return exported
}

/** Check whether a female sprite exists */
async function hasFemaleSprite(sprite: string) {
  //Perform checks
  try {
    const { isFile } = await Deno.stat(`build/creatures/pokemon-gen8/regular/female/${sprite}.png`)
    return isFile
  }
  catch (error) {
    if (!(error instanceof Deno.errors.NotFound))
      throw error
  }
  return false
}

/** Exported encounters data */
export type ExportedEncountersData = {
  [area: string]: encounters
}

/** Encounters type */
type encounters = {
  [method: string]: {
    [encounter: string]: number
  }
}
