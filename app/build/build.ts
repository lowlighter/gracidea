//Imports
import clean from "app/build/steps/00_clean.ts";
import setup from "app/build/steps/01_setup.ts";
import data from "app/build/steps/10_data.ts";
import maps from "app/build/steps/20_maps.ts";
import textures from "app/build/steps/30_textures.ts";
import assets from "app/build/steps/40_assets.ts";
import diff from "app/build/steps/50_diff.ts";
import { log } from "app/build/util.ts";
import { parse as parseFlags } from "std/flags/mod.ts";

/** Flags */
const flags = parseFlags(Deno.args);

/** Build utilities */
export const build = Object.assign(async function () {
  const start = performance.now();
  await clean({ perform: flags.clean });
  await setup();
  await data();
  await maps();
  await textures({ tp: flags.tp });
  await assets();
  await diff({ diff: flags.diff });
  log.step(`completed in ${performance.now() - start} ms`);
  Deno.exit(0);
});
