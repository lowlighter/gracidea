//Imports
import { clean, clone, crop, log, pack } from "./util.ts";
import { ensureDir, expandGlob } from "https://deno.land/std@0.119.0/fs/mod.ts";
import { basename, dirname } from "https://deno.land/std@0.119.0/path/mod.ts";
import { parse as parseFlags } from "https://deno.land/std@0.119.0/flags/mod.ts";
import * as api from "./api.ts";

/** Gender formatted data */
const genders = {} as {
  [name: string]: {
    male: number;
    female: number;
    genderless: number;
  };
};

/** Encounters formatted data */
const encounters = {} as {
  [area: string]: {
    [method: string]: { [name: string]: number };
  };
};

/** Maps sections */
const sections = {} as {
  [id: string]: {
    id: string;
    region: string;
    i18n: { [lang: string]: string };
    encounters: typeof encounters[keyof encounters] | null;
  };
};

/** Texture effects */
const effects = { creature: { name: {}, area: {} } } as {
  creature: {
    name: { [id: string]: string };
    area: { [id: string]: string };
  };
};

/** Warnings */
const warnings = [];

/** Flags (--clean --tilesets) */
const flags = parseFlags(Deno.args);

/** Build utilities */
export const build = Object.assign(async function () {
  console.log(flags);
  const start = performance.now();
  await build.setup();
  await build.gender();
  await build.encounters();
  await build.sections();
  await build.effects();
  await build.api();
  log.step(`completed in ${performance.now() - start} ms`);
  if (warnings.length) {
    log.warn(`${warnings.length} warnings`);
    Deno.exit(2);
  }
  Deno.exit(0);
}, {
  /** Setup build environment */
  async setup() {
    log.step("setup environment");
    await clone({ repo: "PokeAPI/api-data", dir: "app/build/cache/data" });
    await clone({ repo: "msikma/pokesprite", dir: "app/build/cache/creatures" });
    await pack({ pkg: "pixi.js", dir: "app/build/cache/pixi.js" });
    if (flags.clean) {
      await clean({ path: "app/generated" });
    }
    log.success();
  },
  /** Extract gender data */
  async gender() {
    log.step("extract gender data");
    let files = 0;
    for await (const { path, name: file } of expandGlob("app/build/cache/data/data/api/v2/gender/*/*.json")) {
      log.progress(`processing: gender/${basename(dirname(path))}/${file}`);
      const { name: gender, pokemon_species_details: details } = JSON.parse(await Deno.readTextFile(path)) as gender;
      for (const { pokemon_species: { name }, rate } of details) {
        genders[name] ??= { male: 0, female: 0, genderless: 0 };
        genders[name][gender] = Math.abs({ male: 1, female: 0, genderless: -1 - 1 / 8 }[gender] - rate / 8);
      }
      files++;
    }
    log.debug(`processed: ${files} file`);
    log.debug(`found: ${Object.keys(genders).length} creatures`);
    log.success();
  },
  /** Extract encounters data */
  async encounters() {
    log.step("extract encounters rates");
    let files = 0;
    for await (const { path, name: file } of expandGlob("app/build/cache/data/data/api/v2/location-area/*/*.json")) {
      log.progress(`processing: location-area/${basename(dirname(path))}/${file}`);
      const { name: area, pokemon_encounters: details } = JSON.parse(await Deno.readTextFile(path)) as encounters;
      const rates = {} as { [method: string]: { [name: string]: number } };
      for (const { pokemon: { name }, version_details: versions } of details) {
        for (const { encounter_details: details } of versions) {
          for (const { chance, method: { name: method } } of details) {
            rates[method] ??= {};
            rates[method][name] = Math.max(rates[method][name] ?? 0, chance);
          }
        }
      }
      for (const chances of Object.values(rates)) {
        const total = Object.values(chances).reduce((a, b) => a + b, 0);
        for (const name in chances) {
          chances[name] /= total;
          const females = await Deno.lstat(`app/build/cache/creatures/pokemon-gen8/regular/female/${name}.png`).then(() => true).catch(() => false);
          if (females) {
            const chance = chances[name];
            chances[name] *= genders[name].male;
            chances[`female/${name}`] = chance * genders[name].female;
          }
        }
      }
      encounters[area] = rates;
      files++;
    }
    log.debug(`processed: ${files} file`);
    log.debug(`found: ${Object.keys(encounters).length} areas`);
    log.success();
  },
  /** Compute texture effects */
  async effects() {
    log.step("extract texture effects");
    for await (const { path, name: file } of expandGlob("app/build/cache/data/data/api/v2/type/*/*.json")) {
      log.progress(`processing: location-area/${basename(dirname(path))}/${file}`);
      const { name, pokemon: creatures } = JSON.parse(await Deno.readTextFile(path)) as types;
      if (name === "flying") {
        for (const { pokemon: { name: creature } } of creatures) {
          effects.creature.name[creature] = "fly";
        }
      }
    }
    for (const method of ["old-rod", "good-rod", "super-rod", "surf", "super-rod-spots", "surf-spots"]) {
      effects.creature.area[method] = "swim";
    }
    log.debug(`processed: ${Object.keys(effects).length} texture effects`);
    log.success();
  },
  /** Extract sections data */
  async sections() {
    log.step("extract sections metadata");
    let files = 0;
    for await (const { path, name: file } of expandGlob("app/build/cache/data/data/api/v2/location/*/*.json")) {
      log.progress(`processing: location/${basename(dirname(path))}/${file}`);
      const { name: id, names, region: _region } = JSON.parse(await Deno.readTextFile(path));
      const region = _region?.name ?? "other";
      const i18n = Object.fromEntries(
        names.map((
          { language: { name: language }, name }: { language: { name: string }; name: string },
        ) => [language, name]),
      );
      sections[id] = { id, region, i18n, encounters: encounters[`${id}-area`] ?? null };
      files++;
    }
    log.debug(`processed: ${files} file`);
    log.debug(`found: ${Object.keys(sections).length} sections`);
    log.success();
  },
  /** API data */
  async api() {
    log.step("compute api data");
    const save = async (path: string, data: unknown | Promise<unknown>) => {
      path = `app/generated/api/${path}`;
      await ensureDir(dirname(path));
      await Deno.writeTextFile(path, JSON.stringify(await data));
    };
    //Maps data
    {
      log.progress(`processing: maps data`);
      await save("maps/data.json", JSON.stringify(sections));
      log.debug(`processed: maps data`);
    }
    //Regions
    {
      log.progress(`processing: world regions`);
      await save("maps.json", api.regions());
      log.debug(`processed: world regions`);
    }
    //Sections
    {
      let regions = 0, sections = 0;
      for await (const { name: region, isDirectory } of expandGlob("maps/*")) {
        if (!isDirectory) {
          continue;
        }
        log.progress(`processing: ${region}`);
        await save(`maps/${region}.json`, api.sections({ region }));
        for await (const { name, isFile } of expandGlob(`maps/${region}/*.tmx`)) {
          if (!isFile) {
            continue;
          }
          const section = name.replace(".tmx", "");
          log.progress(`processing: ${region}/${section}`);
          try {
            await save(`maps/${region}/${section}.json`, api.load({ region, section }));
            sections++;
          } catch (error) {
            if (/not properly referenced/.test(error.message)) {
              warnings.push(error);
              log.warn(error.message);
              continue;
            }
            throw error;
          }
        }
        regions++;
      }
      log.debug(`processed: ${regions} regions, ${sections} sections`);
    }
    //Tilesets
    {
      let tilesets = 0;
      for await (const { path, name } of expandGlob("copyrighted/textures/*/*.tsx")) {
        const style = basename(dirname(path));
        const tileset = `${style}/${name.replace(".tsx", "")}`;
        log.progress(`processing: ${tileset}`);
        await save(`textures/${tileset}.json`, api.tilesets({ tileset }));
        if (flags.tilesets) {
          await crop({ path: path.replace(".tsx", ".png"), tileset });
          log.progress(`packaged: ${tileset}`);
        }
        tilesets++;
      }
      log.debug(`processed: ${tilesets} tilesets`);
    }
    //Textures effect
    {
      log.progress(`processing: texture effects`);
      await save("textures/effects.json", JSON.stringify(effects));
      log.debug(`processed: texture effects`);
    }
    log.success();
  },
});

/** Gender data */
type gender = {
  name: "male" | "female" | "genderless";
  pokemon_species_details: Array<{
    pokemon_species: { name: string };
    rate: number;
  }>;
};

/** Encounters data */
type encounters = {
  name: string;
  pokemon_encounters: Array<{
    pokemon: { name: string };
    version_details: Array<{
      encounter_details: Array<{
        chance: number;
        method: { name: string };
      }>;
    }>;
  }>;
};

/** Types data */
type types = {
  name: string;
  pokemon: Array<{
    pokemon: { name: string };
  }>;
};
