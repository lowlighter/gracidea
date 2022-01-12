//Imports
import { crop, log } from "app/build/util.ts";
import { expandGlob } from "std/fs/mod.ts";
import { basename, dirname } from "std/path/mod.ts";

/** Prepare textures */
export default async function () {
  log.step("packaging textures");

  //Tilesets
  {
    let tilesets = 0;
    for await (const { path, name } of expandGlob("copyrighted/textures/*/*.tsx")) {
      const style = basename(dirname(path));
      const tileset = `${style}/${name.replace(".tsx", "")}`;
      log.progress(`processing: ${tileset}`);
      await crop({ path: path.replace(".tsx", ".png"), tileset });
      tilesets++;
    }
    log.debug(`processed: ${tilesets} tilesets`);
  }

  log.success();
}
