//Imports
import { log, read, save } from "app/build/util.ts";
import { expandGlob } from "std/fs/mod.ts";
import { basename, dirname } from "std/path/mod.ts";

/** Data extraction */
export default async function () {
  log.step("extracting data");

  //Extract gender data
  const genders = {} as {
    [name: string]: {
      male: number;
      female: number;
      genderless: number;
    };
  };
  {
    let files = 0;
    for await (const { path, name: file } of expandGlob("app/build/cache/data/data/api/v2/gender/*/*.json")) {
      log.progress(`processing: gender/${basename(dirname(path))}/${file}`);
      const { name: gender, pokemon_species_details: details } = await read<gender>(path);

      //Gender rate per species
      for (const { pokemon_species: { name }, rate } of details) {
        genders[name] ??= { male: 0, female: 0, genderless: 0 };
        genders[name][gender] = Math.abs({ male: 1, female: 0, genderless: -1 - 1 / 8 }[gender] - rate / 8);
      }

      files++;
    }
    log.debug(`processed: ${files} files in gender/ (found ${Object.keys(genders).length} creatures)`);
  }

  //Extract encounters data
  const encounters = {} as {
    [area: string]: {
      [method: string]: { [name: string]: number };
    };
  };
  {
    let files = 0;
    for await (const { path, name: file } of expandGlob("app/build/cache/data/data/api/v2/location-area/*/*.json")) {
      log.progress(`processing: location-area/${basename(dirname(path))}/${file}`);
      const { name: area, pokemon_encounters: details } = await read<encounters>(path);

      //Encounter rates per species
      const rates = {} as { [method: string]: { [name: string]: number } };
      for (const { pokemon: { name }, version_details: versions } of details) {
        for (const { encounter_details: details } of versions) {
          for (const { chance, method: { name: method } } of details) {
            rates[method] ??= {};
            rates[method][name] = Math.max(rates[method][name] ?? 0, chance);
          }
        }
      }

      //Normalized chance per species (taking in account eventual female sprite)
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
    log.debug(`processed: ${files} files in location-area/ (found ${Object.keys(encounters).length} areas)`);
  }

  //Extract locations data
  const locations = {} as {
    [id: string]: {
      id: string;
      region: string;
      i18n: { [lang: string]: string };
      encounters: typeof encounters[keyof encounters] | null;
    };
  };
  {
    let files = 0;
    for await (const { path, name: file } of expandGlob("app/build/cache/data/data/api/v2/location/*/*.json")) {
      log.progress(`processing: location/${basename(dirname(path))}/${file}`);
      const { name: id, names, region: _region } = await read<location>(path);

      //Region id, name and encounters rates
      const region = _region?.name ?? "other";
      const i18n = Object.fromEntries(
        names.map((
          { language: { name: language }, name }: { language: { name: string }; name: string },
        ) => [language, name]),
      );
      locations[id] = { id, region, i18n, encounters: encounters[`${id}-area`] ?? null };

      files++;
    }
    log.debug(`processed: ${files} files in location/ (found: ${Object.keys(locations).length} locations)`);
    await save("maps/data.json", locations);
  }

  log.success();
}

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

/** Location data */
type location = {
  name: string;
  names: Array<{
    language: {
      name: string;
    };
    name: string;
  }>;
  region: {
    name: string;
  } | null;
  areas: Array<{
    name: string;
  }>;
};
