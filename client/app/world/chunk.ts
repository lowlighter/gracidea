//Imports
import { CHUNK_SIZE, DIFF } from "../../../build/constants.ts"
import { App } from "./../app.ts"
import { Render } from "../render.ts"
import { Area, AreaData } from "./area.ts"
import { Renderable } from "./renderable.ts"
import type { World } from "./world.ts"

/** Chunk data */
type ChunkData = {
  id: string
  chunk: {
    layers: { [key: string]: number[] }
  }
  areas: AreaData[]
}

/**
 * World chunk.
 * Split world in smaller parts for improved rendering.
 * Chunks are divided internally into layers.
 */
export class Chunk extends Renderable {
  /** Identifier */
  readonly id: string

  /** Sprite */
  readonly sprite: ReturnType<typeof Render.Container>

  /** Chunk data */
  private data = null as ChunkData | null

  /** Layers */
  readonly layers = new Map()

  /** Areas */
  readonly areas = new Set()

  /** World */
  readonly world: World

  /** Constructor */
  constructor({ id, world }: { id: string; world: World }) {
    super({ world })
    this.id = id
    this.world = world
    ;[this.x, this.y] = this.id.split(";").map(n => Number(n) * CHUNK_SIZE)
    this.width = this.height = CHUNK_SIZE
    this.sprite = this.world.sprites.chunks.addChild(Render.Container({ x: this.x, y: this.y }))
    if (App.debug.chunks)
      console.debug(`loaded chunk: ${this.id}`)
  }

  /** Destructor */
  destructor() {
    if (App.debug.chunks)
      console.debug(`unloaded loaded chunk: ${this.id}`)
    this.layers.clear()
    this.areas.clear()
    return super.destructor()
  }

  /** Show sprite */
  show() {
    super.show()
    this.data?.areas?.forEach(area => Area.from({ data: area, chunk: this })?.show())
  }

  /** Debug sprite */
  debug() {
    if (!this._debug) {
      this._debug = this.world.sprites.debug.addChild(
        Render.Graphics({ text: this.id, textStyle: { fontSize: 12, fill: "white" }, stroke: [1, 0x0000FF, .5], fill: [0x0000FF, .25], rect: [0, 0, this.width, this.height] }),
      )
    }
    return super.debug(App.debug.chunks)
  }

  /** Render */
  async render() {
    //Load chunk data
    if (!this.data)
      this.data = await fetch(`/map/overworld/${this.id}`).then(res => res.json())
    //Sea
    this.layers.set("0X", this.sprite.addChild(Render.TilingSprite({ frame: 0, width: CHUNK_SIZE, height: CHUNK_SIZE })))
    if (App.debug.diff)
      this.diff(DIFF.UNCHANGED, { sprite: this.layers.get("0X") })
    //Render layers
    for (
      const { name, sublayers, sorted = false } of [
        { name: "1X", sublayers: ["1A", "1B", "1C"] },
        { name: "2X", sublayers: ["2A", "2B", "2C"], sorted: true },
      ]
    ) {
      //Load layer
      if (!this.layers.has(name))
        this.layers.set(name, this.sprite.addChild(Render.Container({ z: 0, sorted })))
      const layer = this.layers.get(name)
      //Render sublayers
      for (let z = 0; z < sublayers.length; z++) {
        //Load tiles
        const tiles = this.data?.chunk?.layers?.[sublayers[z]]
        if (!tiles)
          continue
        //Render tiles
        for (let i = 0; i < tiles.length; i++) {
          const tile = tiles[i]
          if (tile >= 0) {
            const y = i % CHUNK_SIZE, x = Math.floor(i / CHUNK_SIZE)
            const sprite = layer.addChild(Render.Sprite({ frame: ~~tile, x, y, z: y * CHUNK_SIZE + z }))
            if (App.debug.diff)
              this.diff(tile % 1, { sprite })
          }
        }
      }
    }
    //Update camera
    this.world.camera.render()
  }
}
