//Imports
import { expandGlob } from "https://deno.land/std@0.95.0/fs/mod.ts"
import { loose } from "./constants.ts"
import { ensureDir } from "https://deno.land/std@0.95.0/fs/mod.ts"

/** Reporting function */
export async function report(changes:loose[], {sha}:{sha:string}) {
  await ensureDir("diff")
  console.debug(`processing report: ${sha})`)
  let content = ""
  for (const change of changes) {
    content += `**[🗺️ ${change.map}](https://gracidea.deno.dev?map=${change.map}_${sha}_diff)**\n`
    content += "```diff\n"
    let changed = false
    for (const type of ["regions", "pins", "areas", "chunks"]) {
      if (change[type].created.length + change[type].edited.length + change[type].deleted.length > 0) {
        changed = true
        content += `@@ ${type} @@\n`
        if (change[type].created.length)
          content += `+ ${change[type].created.length} (${change[type].created.map(({id = "", name = ""}) => `${name}#${id}`).join(", ")})\n`
        if (change[type].edited.length)
          content += `! ${change[type].edited.length} (${change[type].edited.map(({id = "", name = ""}) => `${name}#${id}`).join(", ")})\n`
        if (change[type].deleted.length)
          content += `- ${change[type].deleted.length} (${change[type].deleted.map(({id = "", name = ""}) => `${name}#${id}`).join(", ")})\n`
        content += "\n"
      }
    }
    if (change.tiles.created + change.tiles.edited + change.tiles.deleted > 0) {
      changed = true
      content += `@@ tiles @@\n`
      if (change.tiles.created)
        content += `+ ${change.tiles.created}\n`
      if (change.tiles.edited)
        content += `! ${change.tiles.edited}\n`
      if (change.tiles.deleted)
        content += `- ${change.tiles.deleted}\n`
      content += "\n"
    }
    if (!changed)
      content += "# no changes\n"
    content += "```\n\n"
  }
  console.log(content)
  console.debug(`saving: diff/${sha}.report`)
  await Deno.writeTextFile(`diff/${sha}.report`, content)
}