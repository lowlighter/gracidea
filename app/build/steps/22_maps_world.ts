//Imports
import { exists, log, read, save, toArray } from "app/build/util.ts";

/** Compute diff */
export default async function () {
  log.step("compute world map data");

  //Setup
  if (await exists("maps.world.json")) {
    log.debug("skipped: maps.world.json (already present)");
    log.success();
    return;
  }
  const { map: raw } = await read("maps/all/worldmap.tmx");
  const layers = toArray(raw.layer);
  const { "@width": width = 0, "@height": height = 0 } = layers[0];
  const map = { width, height, layers: [], images: [], links: [] } as worldmap;

  //Tiles
  for (const { "@name": layer, data: { "#text": tiled } } of layers) {
    const tiles = (tiled as string)
      .split("\n")
      .map((value) => value.trim())
      .filter((value) => value.length)
      .flatMap((value) =>
        value
          .split(",")
          .map((value) => value.trim())
          .filter((value) => value.length)
          .map((value) => Number(value))
      );
    map.layers.push({ layer, tiles });
  }

  //Region images
  for (const { "@name": name, "@offsetx": x = 0, "@offsety": y = 0, image } of toArray(raw.imagelayer)) {
    const { "@width": width = 0, "@height": height = 0 } = image;
    map.images.push({ name, x, y, width, height });
  }

  //Links
  for (const { "@name": name, object: objects } of toArray(raw.objectgroup)) {
    switch (name) {
      case "links": {
        const cache = {} as { [section: string]: { x: number; y: number } };
        for (const object of toArray(objects)) {
          //Parse polygon
          const { "@name": name, "@x": x, "@y": y, "@width": width, "@height": height, polygon } = object;
          if (!name) {
            continue;
          }
          const points = (polygon?.["@points"].match(/-?\d+/g) ?? [0, 0, width, 0, width, height, 0, height])
            .map((value: string) => Number(value))
            .map((delta: number, index: number) => (delta + (index % 2 ? y : x)) / 8);
          //Load associated location
          const [region] = name.split("/");
          if (!cache[region]) {
            cache[region] = { x: NaN, y: NaN };
            const { sections } = await read(`app/public/data/maps/${region}.json`);
            Object.assign(cache, Object.fromEntries(sections.map(({ id = "", x = 0, y = 0 }) => [id, { x, y }])));
          }
          map.links.push({ name, points, location: cache[name] ?? null });
        }
        break;
      }
    }
  }

  await save("maps.world.json", map);
  log.success();
}

/** World map */
type worldmap = {
  width: number;
  height: number;
  layers: Array<{ layer: string; tiles: number[] }>;
  images: Array<{ name: string; x: number; y: number; height: number; width: number }>;
  links: Array<{ name: string; points: number[]; location: { x: number; y: number } | null }>;
};
