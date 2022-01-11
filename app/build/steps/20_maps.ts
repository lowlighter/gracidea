//Imports
import { calcArea, log, read, save, toArray } from "app/build/util.ts";
import { expandGlob } from "std/fs/mod.ts";

/** Data */
export default async function ({ locations = null as locations } = {}) {
  log.step("compute maps data");
  if (!locations) {
    locations = await read<NonNullable<locations>>("app/public/data/maps/data.json");
  }

  //Regions
  {
    const ids = ["hoenn"];
    const regions = [];
    for (const id of ids) {
      log.progress(`processing: ${id}`);
      const region = { x: { min: Infinity, max: -Infinity }, y: { min: Infinity, max: -Infinity } };
      for (const { x, y, width, height } of (await load.sections({ region: id })).sections) {
        region.x.min = Math.min(x, region.x.min);
        region.y.min = Math.min(y, region.y.min);
        region.x.max = Math.max(x + width, region.x.max);
        region.y.max = Math.max(y + height, region.y.max);
      }
      regions.push({
        id,
        x: region.x.min,
        y: region.y.min,
        width: region.x.max - region.x.min,
        height: region.y.max - region.y.min,
      });
    }
    await save("maps.json", { regions });
    log.debug(`processed: ${ids.length} regions`);
  }

  //Sections
  {
    let regions = 0, sections = 0;
    for await (const { name: region, isDirectory } of expandGlob("maps/*")) {
      if (!isDirectory) {
        continue;
      }
      log.progress(`processing: ${region}/*`);
      await save(`maps/${region}.json`, load.sections({ region }));
      for await (const { name, isFile } of expandGlob(`maps/${region}/*.tmx`)) {
        if (!isFile) {
          continue;
        }
        const section = name.replace(".tmx", "");
        log.progress(`processing: ${region}/${section}`);
        try {
          await save(`maps/${region}/${section}.json`, load.section({ region, section, locations }));
          sections++;
        } catch (error) {
          if (/not properly referenced/.test(error.message)) {
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

  log.success();
}

const load = {
  /** List region sections */
  async sections({ region, filter = "" }: { region: string; filter?: string }) {
    //Load world data
    const { maps: raw } = await read("maps/gracidea.world");

    //Formatted region sections data
    const sections = await Promise.all(
      raw
        .filter(({ fileName = "" }) => fileName.startsWith(`${region}/`) && fileName.includes(filter))
        .map(async ({ fileName = "", x = 0, y = 0, ...properties }) => {
          const { map: raw } = await read(`maps/${fileName}`);
          const { "@width": width = properties.width ?? 0, "@height": height = properties.height ?? 0 } = toArray(raw.layer)?.[0] ?? {};
          return {
            id: fileName.replace(".tmx", ""),
            x: x / 16,
            y: y / 16,
            height,
            width,
          };
        }),
    );
    return { sections };
  },

  /** Load region section */
  async section({ region, section, locations }: { region: string; section: string; locations: locations }) {
    //Load section data
    const { map: raw } = await read(`maps/${region}/${section}.tmx`);
    const position = await load.sections({ region, filter: section }).then(({ sections: [p = null] }) => p ? { X: p.x, Y: p.y } : null);
    if (!position) {
      throw new TypeError(`${section} is not properly referenced in ${region}`);
    }
    const { X, Y } = position;

    //Parse chunks data
    const chunks = [] as Array<{ id: string; layer: string; x: number; y: number; tiles: number[] }>;
    for (const { "@name": layer, ..._layer } of toArray(raw.layer)) {
      const { "@width": width, "@height": height, data: { "#text": tiled = null, chunk: chunked = [] } } = _layer;
      //Fixed-size map
      if (tiled) {
        //Extract and format data
        const tiles = (tiled as string)
          .split("\n")
          .map((value) => value.trim())
          .filter((value) => value.length)
          .map((value) =>
            value
              .split(",")
              .map((value) => value.trim())
              .filter((value) => value.length)
          );
        //Padding for 16-sized chunks
        const TY = tiles.length, TX = tiles[0].length;
        for (let f = 0; f < 16 - (TY % 16); f++) {
          tiles.push(new Array(TX).fill(0));
        }
        for (const row of tiles) {
          row.push(...new Array(16 - (TX % 16)).fill(0));
        }
        //Generate chunked data
        for (let x = 0; x < width; x += 16) {
          for (let y = 0; y < height; y += 16) {
            chunked.push({ "@x": x, "@y": y, "#text": tiles.slice(y, y + 16).map((row) => row.slice(x, x + 16).join(",")).join(",\n") });
          }
        }
      }

      //Chunked map
      for (const chunk of toArray(chunked)) {
        //Extract and format data
        const { "@x": x, "@y": y, "#text": _tiles } = chunk;
        const id = `${X + x / 16};${Y + y / 16}`;
        const tiles = (_tiles as string)
          .split(",")
          .map((value) => value.trim())
          .filter((value) => value.length)
          .map((value) => Math.max(Number(value) - 1, 0));
        //Save chunk
        if (tiles.reduce((a, b) => a + b, 0)) {
          chunks.push({ id, layer, x, y, tiles });
        }
      }
    }

    //Parse areas data
    const areas = [] as Array<{ id: string; name: string; points: number[]; properties: { [key: string]: unknown } }>;
    for (const { "@name": type, object: objects } of toArray(raw.objectgroup)) {
      for (const object of toArray(objects)) {
        //Extract and format data
        const { "@id": id, "@name": name, "@type": mode, "@x": x, "@y": y, "@width": width, "@height": height, polygon, properties: _properties } = object;
        const properties = Object.fromEntries(toArray(_properties?.property).map(({ "@name": name, "@value": value }) => [name, value]));
        const points = (polygon?.["@points"].match(/-?\d+/g) ?? [0, 0, width, 0, width, height, 0, height])
          .map((value: string) => Number(value))
          .map((delta: number, index: number) => (delta + (index % 2 ? y : x)) / 16);
        const area = { id, type, name, points, properties };

        //Specific formatting by type
        switch (type) {
          case "creatures": {
            const X = points.filter((_: number, i: number) => !(i % 2)), Y = points.filter((_: number, i: number) => i % 2);
            area.properties.size = calcArea(X, Y);
            break;
          }
          case "people": {
            const directions = Object.entries(properties).filter(([key, value]) => (["left", "right", "up", "down"].includes(key)) && (value)).map(([key]) => key);
            area.properties = { pattern: mode, directions };
            break;
          }
        }

        //Save area
        areas.push(area);
      }
    }

    //Formatted section data
    return { id: `${region}/${section}`, chunks, areas, ...locations?.[section] };
  },
};

/** Locations */
type locations = { [key: string]: { [key: string]: unknown } } | null;
