//API endpoint
const API = "build/data/data/api/v2/gender"

/** Build dex data */
export async function dex() {
  console.debug(`building: dex data`)
  const exported = {} as ExportedDexData
  for await (const { name: id, isFile } of Deno.readDir(API)) {
    //Load area data
    if (isFile)
      continue
    const { name: gender, pokemon_species_details } = JSON.parse(await Deno.readTextFile(`${API}/${id}/index.json`))
    console.debug(`processing: ${id} (${gender})`)

    //Extract gender rates
    pokemon_species_details.map(({ pokemon_species: { name = "" }, rate = 0 }) => {
      exported[name] ??= {}
      exported[name][gender] = Math.abs((({ male: 1, female: 0, genderless: -1.125 } as { [key: string]: number })[gender]) - rate / 8)
    })
  }
  return exported
}

/** Exported dex data */
export type ExportedDexData = {
  [pokemon: string]: {
    [gender: string]: number
  }
}
