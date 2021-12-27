//Imports
import { expandGlob } from "https://deno.land/std@0.115.0/fs/mod.ts"
import { assert } from "https://deno.land/std@0.115.0/testing/asserts.ts"
import * as XML from "https://deno.land/x/xml@2.0.2/mod.ts"
import { extname } from "https://deno.land/std@0.115.0/path/mod.ts"

//XML
for await (const { path, isFile } of expandGlob("{maps,copyrighted}/**/*.{tmx,tsx,tps,json}")) {
  if (isFile) {
    const file = path.replace(Deno.cwd(), "")
    const ext = extname(path).substring(1)
    Deno.test(file, async () => assert({
      json:JSON,
      tmx:XML,
      tsx:XML,
      tps:XML,
    }[ext]?.parse(await Deno.readTextFile(path))))
  }
}
