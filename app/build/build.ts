//Imports
import {log, clone, pack} from "./util.ts"
import { expandGlob } from "https://deno.land/std@0.115.0/fs/mod.ts"
import { dirname, basename } from "https://deno.land/std@0.115.0/path/mod.ts"


/** Gender formatted data */
const genders = {} as {
  [name:string]:{
    male:number
    female:number
    genderless:number
  }
}

/** Encounters formatted data */
const encounters = {} as {[area:string]:{
  [method:string]:{[name:string]:number}
}}

const sections = {} as  any

/** Build utilities */
export const build = Object.assign(async function () {
  await build.setup()
  await build.gender()
  await build.encounters()
  await build.sections()
  await build.save()
}, {
  /** Setup build environment */
  async setup() {
    log.step("setup environment")
    await clone({repo:"PokeAPI/api-data", dir:"app/build/cache/data"})
    await clone({repo: "msikma/pokesprite", dir: "app/build/cache/creatures" })
    await pack({pkg:"pixi.js", dir:"app/build/cache/pixi.js"})
    log.success()
  },
  /** Extract gender data */
  async gender() {
    log.step("extract gender data")
    let files = 0
    for await (const { path, name:file } of expandGlob("app/build/cache/data/data/api/v2/gender/*/*.json")) {
      log.progress(`processing: gender/${basename(dirname(path))}/${file}`)
      const {name:gender, pokemon_species_details:details} = JSON.parse(await Deno.readTextFile(path)) as gender
      for (const {pokemon_species:{name}, rate} of details) {
        genders[name] ??= {male:0, female:0, genderless:0}
        genders[name][gender] = Math.abs({male:1, female:0, genderless:-1 - 1/8}[gender] - rate / 8)
      }
      files++
    }
    log.debug(`processed: ${files} file`)
    log.debug(`found: ${Object.keys(genders).length} creatures`)
    log.success()
  },
  /** Extract encounters data */
  async encounters() {
    log.step("extract encounters rates")
    let files = 0
    for await (const { path, name:file } of expandGlob("app/build/cache/data/data/api/v2/location-area/*/*.json")) {
      log.progress(`processing: location-area/${basename(dirname(path))}/${file}`)
      const {name:area, pokemon_encounters:details} = JSON.parse(await Deno.readTextFile(path)) as encounters
      const rates = {} as {[method:string]:{[name:string]:number}}
      for (const {pokemon:{name}, version_details:versions} of details) {
        for (const {encounter_details:details} of versions) {
          for (const {chance, method:{name:method}} of details) {
            rates[method] ??= {}
            rates[method][name] = Math.max(rates[method][name] ?? 0, chance)
          }
        }
      }
      for (const chances of Object.values(rates)) {
        const total = Object.values(chances).reduce((a, b) => a + b, 0)
        for (const name in chances) {
          chances[name] /= total
          const females = await Deno.lstat(`app/build/cache/creatures/pokemon-gen8/regular/female/${name}.png`).then(() => true).catch(() => false)
          if (females) {
            const chance = chances[name]
            chances[name] *= genders[name].male
            chances[`female/${name}`] = chance*genders[name].female
          }
        }
      }
      encounters[area] = rates
      files++
    }
    log.debug(`processed: ${files} file`)
    log.debug(`found: ${Object.keys(encounters).length} areas`)
    log.success()
  },
  /** Extract sections data */
  async sections() {
    log.step("extract sections metadata")
    let files = 0
    for await (const { path, name:file } of expandGlob("app/build/cache/data/data/api/v2/location/*/*.json")) {
      log.progress(`processing: location/${basename(dirname(path))}/${file}`)
      const {name:id, names, region:_region} = JSON.parse(await Deno.readTextFile(path))
      const region = _region?.name ?? "other"
      const i18n = Object.fromEntries(names.map(({language:{name:language}, name}:any) => [language, name]))
      sections[id] = {id, region, i18n, encounters:encounters[`${id}-area`] ?? null}
      files++
    }
    log.debug(`processed: ${files} file`)
    log.debug(`found: ${Object.keys(sections).length} sections`)
    log.success()
  },
  /** Save data */
  async save() {
    log.step("saving data")
    await Deno.writeTextFile("app/server/api/maps/data.json", JSON.stringify(sections))
    log.debug(`found: app/server/api/maps/data.json`)
    log.success()
  }
})

/** Gender data */
type gender = {
  name:"male"|"female"|"genderless",
  pokemon_species_details:Array<{
    pokemon_species:{name:string},
    rate:number
  }>
}

/** Encounters data */
type encounters = {
  name:string
  pokemon_encounters:Array<{
    pokemon:{name:string}
    version_details:Array<{
      encounter_details:Array<{
        chance:number
        method:{name:string}
      }>
    }>
  }>
}