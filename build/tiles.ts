//Imports
import { ensureDir } from "https://deno.land/std@0.95.0/fs/mod.ts"
import { basename } from "https://deno.land/std@0.95.0/path/mod.ts"
import { Image } from "https://deno.land/x/imagescript@1.2.6/mod.ts"
import { TILE_PADDING, TILE_SIZE } from "./constants.ts"

/** Tile splitter */
export async function tiles({ file }: { file: string }) {
  //Prepare output directory
  console.debug(`processing: ${file}`)
  const directory = `build/tiles/${basename(file, ".png")}`
  await ensureDir(directory)
  //Extract tiles
  const image = await Image.decode(await Deno.readFile(file))
  const X = (image.width - TILE_PADDING) / (TILE_SIZE + TILE_PADDING), Y = (image.height - TILE_PADDING) / (TILE_SIZE + TILE_PADDING)
  for (let y = 0; y < Y; y++) {
    for (let x = 0; x < X; x++) {
      const i = x + y * X, px = TILE_PADDING + x * (TILE_SIZE + TILE_PADDING), py = TILE_PADDING + y * (TILE_SIZE + TILE_PADDING)
      console.debug(`extracting: tile ${i} (${x};${y} @ ${px};${py})`)
      await Deno.writeFile(`${directory}/${i}.png`, await image.clone().crop(px, py, TILE_SIZE, TILE_SIZE).encode())
    }
  }
}
