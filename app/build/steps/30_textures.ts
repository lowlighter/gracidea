//Imports
import { crop, log, read, save, toArray } from "app/build/util.ts";
import { expandGlob } from "std/fs/mod.ts";
import { basename, dirname } from "std/path/mod.ts";

/** Prepare textures */
export default async function ({ tp = false }) {
  log.step("preparing textures");

  //Tiles properties
  {
    let tilesets = 0;
    for await (const { path, name } of expandGlob("copyrighted/textures/*/*.tsx")) {
      const style = basename(dirname(path));
      const tileset = `${style}/${name.replace(".tsx", "")}`;
      log.progress(`processing: ${tileset}`);
      const { tileset: raw } = await read(`copyrighted/textures/${tileset}.tsx`);
      const animated = {} as { [key: string]: { frames: string[]; speed: number } };
      const zindex = {} as { [key: string]: number };
      for (const { "@id": id, properties: _properties } of toArray(raw.tile)) {
        const properties = Object.fromEntries(toArray(_properties?.property).map(({ "@name": name, "@value": value }) => [name, value]));

        //Animated tiles
        if ((properties.frames) && (properties.speed)) {
          animated[`${id}`] = {
            frames: new Array(properties.frames).fill(id).map((value, index) => `${value + index}`),
            speed: properties.speed,
          };
        }

        //Z-index tiles
        if (properties.zindex) {
          zindex[`${id}`] = Number(properties.zindex);
        }
      }
      await save(`textures/${tileset}.json`, { id: tileset, animated, zindex });
      if (tp) {
        await crop({ path: path.replace(".tsx", ".png"), tileset });
      }
      tilesets++;
    }
    log.debug(`processed: ${tilesets} tilesets`);
  }

  //Textures effect
  const effects = { creature: { name: {}, area: {} } } as {
    creature: {
      name: { [id: string]: string };
      area: { [id: string]: string };
    };
  };
  {
    log.progress(`processing: texture effects`);

    //Type related effects
    for await (const { path, name: file } of expandGlob("app/build/cache/data/data/api/v2/type/*/*.json")) {
      log.progress(`processing: location-area/${basename(dirname(path))}/${file}`);
      const { name, pokemon: creatures } = await read<types>(path);
      if (name === "flying") {
        for (const { pokemon: { name: creature } } of creatures) {
          effects.creature.name[creature] = "fly";
        }
      }
    }

    //Encounter methods related effects
    for (const method of ["old-rod", "good-rod", "super-rod", "surf", "super-rod-spots", "surf-spots"]) {
      effects.creature.area[method] = "swim";
    }

    log.debug(`processed: 2 texture effects`);
    await save("textures/effects.json", effects);
  }

  log.success();
}

/** Types data */
type types = {
  name: string;
  pokemon: Array<{
    pokemon: { name: string };
  }>;
};
