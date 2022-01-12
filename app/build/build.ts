//Imports
import clean from "app/build/steps/00_clean.ts";
import data from "app/build/steps/10_data.ts";
import maps from "app/build/steps/20_maps.ts";
import textures from "app/build/steps/30_textures.ts";
import texturesPacker from "app/build/steps/31_textures_packer.ts";
import assets from "app/build/steps/40_assets.ts";
import app from "app/build/steps/41_assets_app.ts";
import diff from "app/build/steps/21_maps_diff.ts";
import { log } from "app/build/util.ts";
import { parse as parseFlags } from "std/flags/mod.ts";

/** Flags */
const flags = parseFlags(Deno.args);
if (flags.default ?? true) {
  flags.data ??= true;
  flags.maps ??= true;
  flags.textures ??= true;
  flags.assets ??= true;
}
delete (flags as { _?: unknown })._;
for (const [flag, value] of Object.entries(flags)) {
  if (!value) {
    delete flags[flag];
  }
}

/** Build utilities */
export const build = Object.assign(async function () {
  const start = performance.now();
  log.info(`flags: ${Object.keys(flags).join(", ") || "(none)"}`);
  if (flags.clean) {
    await clean();
  }
  if (flags.data) {
    await data();
  }
  if (flags.maps) {
    await maps();
  }
  if (flags.diff) {
    await diff();
  }
  if (flags.textures) {
    await textures();
  }
  if (flags["texture-packer"]) {
    await texturesPacker();
  }
  if (flags.assets) {
    await assets();
  }
  if (flags.app) {
    await app();
  }
  if (Object.keys(flags).length) {
    log.step(`completed in ${((performance.now() - start) / 1000).toFixed(2)} s`);
  }
  Deno.exit(0);
});
