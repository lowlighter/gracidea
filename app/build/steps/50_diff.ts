//Imports
import { expandGlob } from "std/fs/mod.ts";
import { detailedDiff } from "https://cdn.skypack.dev/deep-object-diff";
import { log, read, save } from "app/build/util.ts";
import maps from "app/build/steps/20_maps.ts";

/** Compute diff */
export default async function ({ perform = true } = {}) {
  log.step("computing diff with previous state");
  if (!perform) {
    log.debug("(nothing to do)");
    log.success();
    return;
  }

  //Generate previous maps data
  if (!await Deno.lstat(`app/build/cache/previous/app/public/data/maps`).then(() => true).catch(() => false)) {
    log.progress(`building: gracidea previous maps data`);
    const cwd = Deno.cwd();
    Deno.chdir("app/build/cache/previous");
    await maps({ locations: {} });
    Deno.chdir(cwd);
    log.debug(`built: gracidea previous maps data`);
  }

  {
    //List maps data
    const ids = new Set();
    for (const glob of ["app/public/data/maps/*/**/*.json", "app/build/cache/previous/app/public/data/maps/*/**/*.json"]) {
      for await (const { path } of expandGlob(glob)) {
        const id = path.replaceAll("\\", "/").replace(/^[\s\S]*app\/public\/data\/maps\//, "").replace(/\.json$/, "");
        ids.add(id);
      }
    }

    //Compute maps data diff
    for (const id of ids) {
      log.debug(`processing: ${id}`);
      const a = await read(`app/build/cache/previous/app/public/data/maps/${id}.json`).catch(() => ({}));
      const b = await read(`app/public/data/maps/${id}.json`).catch(() => ({}));

      //Chunks diff
      const chunks = detailedDiff(a.chunks, b.chunks);
      console.log(chunks);

      //Areas diff
      const areas = detailedDiff(a.areas, b.areas);
      for (const action of Object.keys(areas)) {
        //deno-lint-ignore no-explicit-any
        for (const [i, area] of Object.entries(areas[action]) as any) {
          switch (action) {
            case "added":
            case "updated":
              b.areas[i].diff = action;
              continue;
            case "deleted":
              b.areas.push({ ...area, diff: action });
          }
        }
      }

      await save(`maps/${id}.json`, b);
    }
    log.debug(`processed: ${ids.size} files`);
  }

  log.success();
}
