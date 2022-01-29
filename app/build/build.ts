//Imports
import clean from "app/build/steps/00_clean.ts";
import data from "app/build/steps/10_data.ts";
import maps from "app/build/steps/20_maps.ts";
import textures from "app/build/steps/30_textures.ts";
import texturesPacker from "app/build/steps/31_textures_packer.ts";
import assets from "app/build/steps/40_assets.ts";
import app from "app/build/steps/41_assets_app.ts";
import diff from "app/build/steps/21_maps_diff.ts";
import world from "app/build/steps/22_maps_world.ts";
import { log, requirements } from "app/build/util.ts";
import { parse as parseFlags } from "std/flags/mod.ts";

/** Flags */
const flags = parseFlags(Deno.args);
delete (flags as { _?: unknown })._;
if (!Object.keys(flags).length) {
  flags.data ??= true;
  flags.maps ??= true;
  flags.world ??= true;
  flags.diff ??= true;
  flags.textures ??= true;
  flags.assets ??= true;
  flags.app ??= true;
}

/** Build utilities */
export const build = Object.assign(async function () {
  const start = performance.now();
  log.info(`flags: ${Object.entries(flags).map(([flag, value]) => value ? flag : `no-${flag}`).join(", ") || "(none)"}`);
  await requirements();
  if (flags.clean ?? flags.all) {
    await clean();
  }
  if (flags.data ?? flags.all) {
    await data();
  }
  if (flags.maps ?? flags.all) {
    await maps();
  }
  if (flags.diff ?? flags.all) {
    await diff();
  }
  if (flags.world ?? flags.all) {
    await world();
  }
  if (flags.textures ?? flags.all) {
    await textures();
  }
  if (flags["texture-packer"] ?? flags.all) {
    await texturesPacker();
  }
  if (flags.assets ?? flags.all) {
    await assets();
  }
  if (flags.app ?? flags.all) {
    await app();
  }
  log.step(`completed in ${((performance.now() - start) / 1000).toFixed(2)} s`);
});
