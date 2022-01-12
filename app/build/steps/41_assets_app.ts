//Imports
import { log, pack } from "app/build/util.ts";
import { ensureDir } from "std/fs/mod.ts";

/** Public assets */
export default async function () {
  log.step("emitting bundled app");

  //Setup
  await pack({ pkg: "pixi.js", dir: "app/build/cache/pixi.js" });

  //App.js
  {
    log.progress(`emitting: app.js`);
    const { files } = await Deno.emit(new URL("../../client/js/app/mod.ts", import.meta.url).href, { bundle: "classic", importMapPath: "deno.json" });
    await ensureDir("app/public/js");
    await Deno.writeTextFile("app/public/js/app.js", files[`deno:///bundle.js`]);
    log.debug(`emitted: app.js`);
  }

  log.success();
}
