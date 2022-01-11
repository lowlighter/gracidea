//Imports
import clean from "./steps/00_clean.ts";
import setup from "./steps/01_setup.ts";
import data from "./steps/10_data.ts";
import maps from "./steps/20_maps.ts";
import textures from "./steps/30_textures.ts";
import assets from "./steps/40_assets.ts";
import { at, log } from "./util.ts";
import { parse as parseFlags } from "https://deno.land/std@0.119.0/flags/mod.ts";
//import * as test from "./test.ts"

/** Flags (--clean --tilesets) */
const flags = parseFlags(Deno.args);

/** Build utilities */
export const build = Object.assign(async function () {
  const start = performance.now();
  if (flags.clean) {
    await clean();
  }
  await setup();
  await data();
  await maps();
  await textures();
  await assets();

  console.log(await at({ x: 5, y: -64 + 9 }), await at({ x: -500, y: -500 }));

  log.step(`completed in ${performance.now() - start} ms`);
  Deno.exit(0);
});
