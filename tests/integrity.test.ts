//Imports
  import { expandGlob } from "https://deno.land/std@0.95.0/fs/mod.ts"
  import { assert } from "https://deno.land/std@0.95.0/testing/asserts.ts"
  import { parse as xmlparse } from "https://deno.land/x/xml@v1.0.0/mod.ts"

//JSON
  for await (const {path, isFile} of expandGlob("{client,server}/**/*.json"))
    if (isFile)
      Deno.test(`json integrity: ${path.replace(Deno.cwd(), "/")}`, async () => assert(JSON.parse(await Deno.readTextFile(path))))

//XML
  for await (const {path, isFile} of expandGlob("maps/**/*.{tmx,tsx}"))
    if (isFile)
      Deno.test(`xml integrity: ${path.replace(Deno.cwd(), "/")}`, async () => assert(xmlparse(await Deno.readTextFile(path))))
