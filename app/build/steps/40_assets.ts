//Imports
import { log, read } from "app/build/util.ts";
import { expandGlob } from "std/fs/mod.ts";
import { copy } from "std/fs/copy.ts";

/** Public assets */
export default async function () {
  log.step("creating public assets");

  //Static assets
  {
    log.progress(`copying: static assets`);
    await copy("app/client", "app/public", { overwrite: true });
    await copy("copyrighted", "app/public", { overwrite: true });
    const pending = [];
    for (const glob of ["README.md", "animated_map.gif", "gracidea.webp", "js/app", "textures/**/*.{tsx,tps,png}"]) {
      for await (const { path } of expandGlob(`app/public/${glob}`)) {
        pending.push(Deno.remove(path, { recursive: true }));
      }
    }
    await Promise.all(pending);
    log.debug(`copied: static assets`);
  }

  //Index.html
  {
    let sha = "(head)";
    try {
      sha = Deno.env.get("VERCEL_GIT_COMMIT_SHA") || sha;
    } catch {
      //No-op
    }
    log.progress(`templating: index.html`);
    let index = await read("app/client/index.html");
    index = index.replaceAll("{{sha}}", sha.substring(0, 7));
    await Deno.writeTextFile("app/public/index.html", index);
    log.debug(`templated: index.html`);
  }

  log.success();
}
