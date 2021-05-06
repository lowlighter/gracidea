//API endpoint
const API = "build/data/data/api/v2/location-area"

/** Encounters type */
type encounters = {
  [method:string]:{
    [encounter:string]:number
  }
}

/** Build encounters data */
export async function encounters() {
  console.debug(`building: encounters data`)
  const exported = {} as {[area:string]:encounters}
  for await (const {name:id, isFile} of Deno.readDir(API)) {
    //Load area data
    if (isFile)
      continue
    const {name:area, pokemon_encounters} = JSON.parse(await Deno.readTextFile(`${API}/${id}/index.json`))
    console.debug(`processing: ${id} (${area})`)

    //Extract encounter rates
    const encounters = {} as encounters
    pokemon_encounters
      //Extract names and merge details by encounter method
      .map(({pokemon:{name = ""}, version_details = []}) => ({name, rates:version_details.flatMap(({encounter_details = []}) => encounter_details.map(({chance = 0, method:{name = ""}}) => ({chance, method:name})))}))
      //Store encounters by method, pokemon and merge encounter rates
      .map(({name = "", rates = []}) =>
        rates.map(({method = "", chance = 0}) => {
          encounters[method] ??= {}
          encounters[method][name] ??= 0
          encounters[method][name] = Math.max(chance, encounters[method][name])
        })
      )
    //Normalize rates
    Object.values(encounters).map(rates => {
      const total = Object.values(rates).reduce((a, b) => a+b, 0)
      Object.entries(rates).map(([pokemon, chance]) => rates[pokemon] = chance/total)
    })
    exported[area] = encounters
  }
  return exported
}
