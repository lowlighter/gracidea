//Imports
import { parse as parseXML } from "https://deno.land/x/xml@2.0.3/parse.ts";
import { dirname, extname, join } from "https://deno.land/std@0.119.0/path/mod.ts";

/** List regions */
export async function regions() {
  return {
    regions: [
      {
        id: "hoenn",
        x: 0 / 16,
        y: 0 / 16,
      },
    ],
  };
}

/** List region sections */
export async function sections({ region, filter = "" }: { region: string; filter?: string }) {
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
}

/** Load region section */
export async function load({ region, section }: { region: string; section: string }) {
  //Load map data if it isn't yet
  if (!load.data.maps) {
    load.data.pending.maps = read("app/generated/api/maps/data.json");
    load.data.maps = await load.data.pending.maps;
  }
  await load.data.pending.maps;

  //Load section data
  const { map: raw } = await read(`maps/${region}/${section}.tmx`);
  const position = await sections({ region, filter: section }).then(({ sections: [p = null] }) => p ? { X: p.x, Y: p.y } : null);
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
  return { id: `${region}/${section}`, chunks, areas, ...load.data.maps?.[section] };
}
load.data = { maps: null as null | loose, pending: { maps: null as null | Promise<loose> } };

/** Tilesets endpoint */
export async function tilesets({ tileset }: { tileset: string }) {
  //Load tileset data
  const { tileset: raw } = await read(`copyrighted/textures/${tileset}.tsx`);

  //Parse tiles data
  const animated = {} as { [key: string]: { frames: string[]; speed: number } };
  const zindex = {} as { [key: string]: number };
  for (const { "@id": id, properties: _properties } of toArray(raw.tile)) {
    //Extract and format data
    const properties = Object.fromEntries(toArray(_properties?.property).map(({ "@name": name, "@value": value }) => [name, value]));

    //Animated frames
    if ((properties.frames) && (properties.speed)) {
      animated[`${id}`] = {
        frames: new Array(properties.frames).fill(id).map((value, index) => `${value + index}`),
        speed: properties.speed,
      };
    }

    //Z-index
    if (properties.zindex) {
      zindex[`${id}`] = Number(properties.zindex);
    }
  }

  //Formatted tileset data
  return { id: tileset, animated, zindex };
}

/** Parsed data accessor */
//deno-lint-ignore no-explicit-any
type parsed = any;

/** Loose type */
//deno-lint-ignore ban-types
type loose = { [key: string]: object };

/** Read and parse serialized data */
async function read(path: string) {
  const ext = extname(path);
  const url = join(dirname(import.meta.url), "../../", path);
  const content = await fetch(url).then((response) => response.text());
  switch (ext) {
    case ".world":
    case ".json":
      return JSON.parse(content) as parsed;
    case ".tmx":
    case ".tsx":
      return parseXML(content) as parsed;
    default:
      return content;
  }
}

/** Send back a flattened array without falsy values */
function toArray<T>(value: T | T[]) {
  return [value].flat(Infinity).filter((value) => value);
}

/** Send back area value */
function calcArea(X: number[], Y: number[]) {
  let area = 0;
  for (let i = 0, j = X.length - 1; i < X.length; j = i, i++) {
    area += (X[j] + X[i]) * (Y[j] - Y[i]);
  }
  return Math.abs(area / 2);
}
