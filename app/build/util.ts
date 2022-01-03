//Imports
import argv from "https://cdn.skypack.dev/string-argv@0.3.1";
import { uncompress } from "https://deno.land/x/compress@v0.4.1/tgz/mod.ts";
import { bold, gray, green, red, yellow } from "https://deno.land/std@0.119.0/fmt/colors.ts";
import { Image } from "https://deno.land/x/imagescript@1.2.9/mod.ts";
import { ensureDir } from "https://deno.land/std@0.119.0/fs/mod.ts";
import { basename, dirname } from "https://deno.land/std@0.119.0/path/mod.ts";

/** Encoder instance*/
const encoder = new TextEncoder();

/** Decoder instance */
const decoder = new TextDecoder();

/** Log wrapper */
export const log = Object.assign(function (text: string) {
  return console.log(text.padEnd(64));
}, {
  step(text: string) {
    return console.log(bold(`>>> ${text.padEnd(64)}`));
  },
  progress(text: string) {
    Deno.stdout.write(encoder.encode(`${gray(text).padEnd(64)}\r`));
  },
  debug(text: string) {
    return console.debug(gray(text.padEnd(64)));
  },
  warn(text: string) {
    return console.warn(yellow(text.padEnd(64)));
  },
  error(text: string) {
    return console.error(red(text.padEnd(64)));
  },
  success() {
    return console.log(green("success!".padEnd(64)));
  },
});

/** Execute a command */
export async function exec(command: string) {
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
    const { stdout: archive } = await exec(`${Deno.build.os === "windows" ? "wsl " : ""}npm pack ${pkg}`);
    log.progress(`uncompressing: ${archive}`);
    await uncompress(archive, dir);
    await Deno.remove(archive);
  }
  const { version = "unknown" } = JSON.parse(await Deno.readTextFile(`${dir}/package/package.json`));
  log.debug(`packed: ${pkg}@${version}${exists ? " (already present)" : ""}`);
}

/** Crop an image instance */
export async function crop({ path, tileset }: { path: string; tileset: string }) {
  log.progress(`processing: ${tileset}`);
  const directory = `app/build/cache/tilesets/${tileset}`;
  const padding = 2;
  const tilesize = 16;
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
