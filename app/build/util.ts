//Imports
import argv from "y/string-argv@0.3.1";
import { bold, cyan, gray, green, italic, red, yellow } from "std/fmt/colors.ts";
import { Image } from "x/imagescript@1.2.9/mod.ts";
import { ensureDir } from "std/fs/mod.ts";
import { dirname, extname, isAbsolute, join, toFileUrl } from "std/path/mod.ts";
import { parse as parseXML } from "x/xml@2.0.3/parse.ts";

/** Encoder instance*/
const encoder = new TextEncoder();

/** Decoder instance */
const decoder = new TextDecoder();

/** Log wrapper */
export const log = {
  get size() {
    try {
      return Deno.consoleSize(Deno.stdout.rid).columns;
    } catch {
      return 128;
    }
  },
  step(text: string) {
    return console.log(bold(`>>> ${text}`.padEnd(this.size)));
  },
  progress(text: string) {
    Deno.stdout.write(encoder.encode(`${gray(text).padEnd(this.size)}\r`));
  },
  debug(text: string) {
    return console.debug(gray(text.padEnd(this.size)));
  },
  info(text: string) {
    return console.info(cyan(text.padEnd(this.size)));
  },
  warn(text: string) {
    return console.warn(yellow(text.padEnd(this.size)));
  },
  error(text: string) {
    return console.error(red(text.padEnd(this.size)));
  },
  success() {
    return console.log(green("success!".padEnd(this.size)));
  },
  skipped() {
    return console.log(gray(italic("skipped".padEnd(this.size))));
  },
};

/** Requirements */
export async function requirements() {
  if (Deno.build.os === "windows") {
    try {
      await exec("wsl exit", { compat: false });
    } catch {
      log.error("error: windows subsystem for linux is not available");
      return false;
    }
  }
  let success = true;
  for (const bin of ["git", "npm", "tar"]) {
    await exec(`which ${bin}`).catch((_) => (log.error(`error: ${bin} is not available`), success = false));
  }
  return success;
}

/** Execute a command */
export async function exec(command: string, { compat = true } = {}) {
  if ((compat) && (Deno.build.os === "windows")) {
    command = `wsl ${command}`;
  }
  log.progress(`executing: ${command}`);
  const process = Deno.run({ cmd: argv(command), stdout: "piped", stderr: "piped" });
  const [{ success, code }, ...stdio] = await Promise.all([process.status(), process.output(), process.stderrOutput()]);
  const stdout = decoder.decode(stdio[0]).trim();
  const stderr = decoder.decode(stdio[1]).trim();
  if (!success) {
    log.warn(stdout);
    log.error(stderr);
    throw new Error("failed to execute command");
  }
  return { success, code, stdout, stderr };
}

/** Clone a repository */
export async function clone({ repo, dir }: { repo: string; dir: string }) {
  log.progress(`cloning: ${repo}`);
  const exists = await Deno.lstat(dir).then(() => true).catch(() => false);
  if (!exists) {
    await exec(`git clone https://github.com/${repo}.git ${dir} --depth 1`);
  }
  log.debug(`cloned: ${repo}${exists ? " (already present)" : ""}`);
}

/** Download a npm dependency */
export async function pack({ pkg, dir }: { pkg: string; dir: string }) {
  log.progress(`packing: ${pkg}`);
  const exists = await Deno.lstat(dir).then(() => true).catch(() => false);
  if (!exists) {
    await ensureDir("app/build/cache")
    const { stdout } = await exec(`npm pack ${pkg} --pack-destination app/build/cache`);
    const archive = `app/build/cache/${stdout}`;
    log.progress(`uncompressing: ${archive}`);
    await ensureDir(dir);
    await exec(`tar --extract --file ${archive} --directory ${dir}`);
    await Deno.remove(archive);
  }
  const { version = "unknown" } = JSON.parse(await Deno.readTextFile(`${dir}/package/package.json`));
  log.debug(`packed: ${pkg}@${version}${exists ? " (already present)" : ""}`);
}

/** Crop an image instance */
export async function crop({ path, tileset, padding = 2, tilesize = 16 }: { path: string; tileset: string; padding?: number; tilesize?: number }) {
  log.progress(`processing: ${tileset}`);
  const directory = `app/build/cache/tilesets/${tileset}`;
  const image = await Image.decode(await Deno.readFile(path));
  const X = (image.width - padding) / (tilesize + padding), Y = (image.height - padding) / (tilesize + padding);
  await ensureDir(directory);
  for (let y = 0; y < Y; y++) {
    for (let x = 0; x < X; x++) {
      const i = x + y * X, px = padding + x * (tilesize + padding), py = padding + y * (tilesize + padding);
      await Deno.writeFile(`${directory}/${i}.png`, await image.clone().crop(px, py, tilesize, tilesize).encode());
      log.progress(`processing: ${tileset} (${i}/${X * Y})`);
    }
  }
}

/** Clean folder */
export async function clean({ path }: { path: string }) {
  if (!path) {
    throw new RangeError("no path specified for cleaning!");
  }
  if (await Deno.lstat(path).then(() => true).catch(() => false)) {
    await Deno.remove(path, { recursive: true });
  }
  log.debug(`cleaned: ${path}`);
}

/** Read and parse serialized data */
export async function read<T = parsed>(path: string): Promise<T> {
  const ext = extname(path);
  const url = isAbsolute(path) ? toFileUrl(path).href : toFileUrl(join(Deno.cwd(), path)).href;
  const content = await fetch(url).then((response) => response.text());
  switch (ext) {
    case ".world":
    case ".json":
      return JSON.parse(content);
    case ".tmx":
    case ".tsx":
      return parseXML(content) as unknown as T;
  }
  return content as unknown as T;
}

/** Save data */
export async function save(path: string, data: unknown | Promise<unknown>) {
  path = `app/public/data/${path}`;
  await ensureDir(dirname(path));
  await Deno.writeTextFile(path, JSON.stringify(await data));
}

/** Test data path */
export async function exists(path: string) {
  path = `app/public/data/${path}`;
  return await Deno.lstat(path).then(() => true).catch(() => false);
}

/** Send back a flattened array without falsy values */
export function toArray<T>(value: T | T[]) {
  return [value].flat(Infinity).filter((value) => value);
}

/** Send back area value */
export function calcArea(X: number[], Y: number[]) {
  let area = 0;
  for (let i = 0, j = X.length - 1; i < X.length; j = i, i++) {
    area += (X[j] + X[i]) * (Y[j] - Y[i]);
  }
  return Math.abs(area / 2);
}

/** At position */
export async function at({ x, y }: { x: number; y: number }) {
  const matches = [];
  const regions = (await read<{ regions: rectangle[] }>("app/public/data/maps.json")).regions.filter((region) => contains(region, { x, y }));
  for (const { id: region } of regions) {
    const sections = (await read<{ sections: rectangle[] }>(`app/public/data/maps/${region}.json`)).sections.filter((section) => contains(section, { x, y }));
    for (const { id: section, x: X, y: Y } of sections) {
      const rx = x - X, ry = y - Y;
      const content = await read<{ chunks: rectangle[]; areas: polygon[] }>(`app/public/data/maps/${section}.json`);

      //Tiles matching
      const chunks = content.chunks.filter((chunk) => contains({ ...chunk, width: 16, height: 16 }, { x: rx, y: ry }));
      for (const { layer, tiles } of chunks as unknown as Array<{ layer: string; tiles: number[] }>) {
        matches.push({ region, section, layer, tile: tiles[rx * 16 + ry] });
      }

      //Areas matching
      const areas = content.areas.filter((area) => contains(area, { x: rx + .5, y: ry + .5 }));
      for (const { type, name, points } of areas as unknown as Array<{ type: string; name: string; points: number[] }>) {
        matches.push({ region, section, type, name, points });
      }
    }
  }
  return matches;
}

/** Test whether a point is contained within a polygon */
function contains({ x = 0, y = 0, width = 0, height = 0, points = [] as number[] }, p: { x: number; y: number }) {
  //Polygon
  if (points.length) {
    let inside = false;
    const length = points.length / 2;
    for (let i = 0, j = length - 1; i < length; j = i++) {
      const xi = points[i * 2];
      const yi = points[(i * 2) + 1];
      const xj = points[j * 2];
      const yj = points[(j * 2) + 1];
      const intersect = ((yi > p.y) !== (yj > p.y)) && (p.x < ((xj - xi) * ((p.y - yi) / (yj - yi))) + xi);
      if (intersect) {
        inside = !inside;
      }
    }
    return inside;
  }
  //Rectangle
  if (width <= 0 || height < 0) {
    return false;
  }
  return (p.x >= x && p.x < x + width) && (p.y >= y && p.y < y + height);
}

/** Rectangle */
type rectangle = { id: string; width: number; height: number; x: number; y: number };

/** Polygon */
type polygon = { id: string; points: number[] };

/** Parsed data accessor */
//deno-lint-ignore no-explicit-any
type parsed = any;
