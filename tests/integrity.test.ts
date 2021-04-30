//Imports
  import { expandGlob } from "https://deno.land/std@0.95.0/fs/mod.ts"
  import { assert } from "https://deno.land/std@0.95.0/testing/asserts.ts"

//JSON
  for await (const {path, isFile} of expandGlob("**/*.json")) {
    if (isFile)
      Deno.test(`json integrity: ${path.replace(Deno.cwd(), "/")}`, async () => assert(JSON.parse(await Deno.readTextFile(path))))
  }

//Todo XML