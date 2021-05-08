//Imports
import { assertObjectMatch } from "https://deno.land/std@0.95.0/testing/asserts.ts"
import { DIFF, loose } from "./constants.ts"
import type { ExportedMapData } from "./map.ts"

export async function diff(name: string) {
  //Load data
  console.debug(`processing: ${name}`)
  const main = await fetch(`https://raw.githubusercontent.com/lowlighter/gracidea/main/server/data/maps/${name}.gracidea.json`).then(res => res.json()) as ExportedMapData
  const head = JSON.parse(await Deno.readTextFile(`server/data/maps/${name}.gracidea.json`)) as ExportedMapData
  const areas = {
    main: new Map(main.areas.map(area => [area.id, area])),
    head: new Map(head.areas.map(area => [area.id, area])),
  }

  //Edited areas
  console.debug("checking: areas")
  for (const [id, area] of areas.head) {
    if (!areas.main.has(id)) {
      area.properties.diffCreated = true
      continue
    }
    try {
      assertObjectMatch(areas.main.get(id) as loose, areas.head.get(id) as loose)
    }
    catch {
      area.properties.diffEdited = true
    }
    areas.main.delete(id)
  }
  //Deleted areas (present in main but not in head)
  for (const [id, area] of areas.main) {
    area.properties.diffDeleted = true
    head.areas.push(area)
  }

  //Edited chunks
  console.debug("checking: chunk")
  for (const [id, { layers }] of Object.entries(head.chunks)) {
    for (const name in layers) {
      const layer = layers[name]
      for (let i = 0; i < layer.length; i++) {
        const p = main.chunks[id]?.layers[name][i] ?? -1
        const c = layer[i]
        //Created
        if ((p < 0) && (c >= 0)) {
          layer[i] += DIFF.CREATED
          continue
        }
        //Deleted
        if ((c < 0) && (p >= 0)) {
          layer[i] = p + DIFF.DELETED
          continue
        }
        //Edited
        if (p !== c) {
          layer[i] += DIFF.EDITED
          continue
        }
      }
      delete main.chunks[id]?.layers[name]
    }
  }
  //Deleted chunks (present in main but not in head)
  for (const [id, { layers }] of Object.entries(main.chunks)) {
    head.chunks[id] ??= { layers: {} }
    for (const name in layers)
      head.chunks[id].layers[name] = layers[name].map(tile => tile + DIFF.DELETED)
  }

  //Save
  console.debug(`saving: ${name}_diff.gracidea.json`)
  await Deno.writeTextFile(`server/data/maps/${name}_diff.gracidea.json`, JSON.stringify(head))
}

/*
+
+
+Exported data
+type ExportedMapData = {
+  pins: {
+    regions: {
+      [region: string]: {
+        id: number
+        mx: number
+        my: number
+        pins: Array<{
+          id: number
+          name: string
+          x: number
+          y: number
+          mx: number
+          my: number
+        }>
+      }
+    }
+  }
+
+}
+*/
