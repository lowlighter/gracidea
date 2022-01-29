//Imports
import { crop, log } from "app/build/util.ts";
import { expandGlob } from "std/fs/mod.ts";
import { basename, dirname } from "std/path/mod.ts";

/** Prepare textures */
export default async function () {
  log.step("packaging textures");

  //Worldmap
  {
    log.progress("processing: worldmap");
    await crop({ path: "copyrighted/textures/all/worldmap.png", tileset: "worldmap", padding: 0, tilesize: 8 });
    log.debug("processed: worldmap");
  }

  //Tilesets
  {
    let tilesets = 0;
    for await (const { path, name } of expandGlob("copyrighted/textures/*/*.tsx")) {
      const style = basename(dirname(path));
      if (style === "all") {
        continue;
      }
      const tileset = `${style}/${name.replace(".tsx", "")}`;
      log.progress(`processing: ${tileset}`);
      await crop({ path: path.replace(".tsx", ".png"), tileset });
      tilesets++;
    }
    log.debug(`processed: ${tilesets} tilesets`);
  }

  log.success();
}
