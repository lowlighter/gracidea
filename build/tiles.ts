//Imports
import {ensureDir} from "https://deno.land/std@0.95.0/fs/mod.ts";
import {Image} from "https://deno.land/x/imagescript@1.2.6/mod.ts"

const TILE_SIZE = 16
const TILE_PADDING = 2


//Prepare output directory
const file = "maps/overworld/tileset3.png"
console.debug(`processing: ${file}`)
const directory = `build/tiles/tileset3`
await ensureDir(directory)
//Extract tiles
const image = await Image.decode(await Deno.readFile(file))
const X = (image.width-TILE_PADDING)/(TILE_SIZE+TILE_PADDING), Y = (image.height-TILE_PADDING)/(TILE_SIZE+TILE_PADDING)
for (let y = 0; y < Y; y++) {
  for (let x = 0; x < X; x++) {
    const i = x + y*X, px = TILE_PADDING+x*(TILE_SIZE+TILE_PADDING), py = TILE_PADDING+y*(TILE_SIZE+TILE_PADDING)
    console.debug(`extracting: tile ${i} (${x};${y} @ ${px};${py})`)
    await Deno.writeFile(`${directory}/${i}.png`, await image.clone().crop(px, py, TILE_SIZE, TILE_SIZE).encode())
  }
}
