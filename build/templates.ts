//Imports
import { loose } from "./constants.ts"

/** Available context */
const context = {
  init: false,
  commit: "",
} as loose

/** Context builder */
async function init() {
  const process = Deno.run({ cmd: ["git", "log", "-n", "1", "main", "--pretty=format:'%H'"], stdout: "piped" })
  context.commit = new TextDecoder().decode(await process.output()).replace(/'/g, "")
  context.init = true
}

/** Templater */
export async function template({ from, to }: { from: string; to: string }) {
  if (!context.init)
    await init()
  for await (const { name, isFile } of Deno.readDir(from)) {
    console.log(`processing: ${from}/${name}`)
    if (!isFile) {
      template({ from: `${from}/${name}`, to: `${to}/${name}` })
      continue
    }
    await Deno.writeTextFile(
      `${to}/${name}`,
      (await Deno.readTextFile(`${from}/${name}`)).replace(/%\{(?<variable>\w+)\}/g, (match, variable) => variable in context ? context[variable] : match),
    )
    console.log(`templated: ${from}/${name}`)
  }
}
