//Imports
import { expandGlob } from "https://deno.land/std@0.119.0/fs/mod.ts";
import { assert } from "https://deno.land/std@0.119.0/testing/asserts.ts";
import * as XML from "https://deno.land/x/xml@2.0.3/mod.ts";
import { extname } from "https://deno.land/std@0.119.0/path/mod.ts";

//Ensure files are parsable
for (const glob of ["{maps,copyrighted}/**/*.{tmx,tsx,tps,json}", "app/generated/**/*.json"]) {
  for await (const { path, isFile } of expandGlob(glob)) {
    if (isFile) {
      const file = path.replace(Deno.cwd(), "");
      const ext = extname(path).substring(1);
      Deno.test(file, async () =>
      assert({
        json: JSON,
        tmx: XML,
        tsx: XML,
        tps: XML,
      }[ext]?.parse(await Deno.readTextFile(path))));
    }
  }
}
