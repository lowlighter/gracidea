//Imports
import { ANIMATED, CHUNK_SIZE } from "../../../build/constants.ts"
import { App } from "../app.ts"
import { Render } from "../render.ts"
import { Area } from "./area.ts"
import { Camera } from "./camera.ts"
import { Chunk } from "./chunk.ts"
import { Minimap } from "./minimap.ts"

/**
 * World.
 */
export class World {
  /** Sprites */
  readonly sprites: {
    world: ReturnType<typeof Render.Container>
    chunks: ReturnType<typeof Render.Container>
    locations: ReturnType<typeof Render.Container>
    debug: ReturnType<typeof Render.Container>
    minimap: ReturnType<typeof Render.Container>
  }

  /** Loaded */
  readonly loaded = {
    chunks: new Map<string, Chunk>(),
    areas: new Map<string, Area>(),
  }

  /** Camera */
  readonly camera: Camera

  /** World map */
  readonly minimap: Minimap

  /** World name */
  readonly name: string

  /** App */
  readonly app: App

  /** Tick */
  tick = 0

  /** Constructor */
  constructor({ app, name }: { app: App; name?: string | null }) {
    this.app = app
    this.name = name ?? "overworld"
    const sprite = Render.app.stage.addChild(Render.Container())
    this.sprites = {
      world: sprite,
      chunks: sprite.addChild(Render.Container({ sorted: true })),
      locations: sprite.addChild(Render.Container()),
      debug: sprite.addChild(Render.Container()),
      minimap: Render.app.stage.addChild(Render.Container()),
    }
    this.camera = new Camera({ world: this })
    this.minimap = new Minimap({ world: this })
    //Ticker
    const seaTextures = ANIMATED[2374].frames.map(frame => Render.Texture({ frame }))
    Render.engine.Ticker.shared.add(() => {
      this.tick += App.config.delta
      if (Number.isInteger(this.tick)) {
        this.loaded.chunks.forEach(chunk => {
          if (chunk.layers.has("0X"))
            chunk.layers.get("0X").texture = seaTextures[this.tick % seaTextures.length]
        })
        this.app.controller.updateFPS(Render.engine.Ticker.shared.FPS)
      }
      this.loaded.areas.forEach(area => area.update(this.tick))
    })
  }

  /** Return chunk for a given position (note that chunks are rounded to avoid display issues) */
  chunkAt({ x, y }: { x: number; y: number }) {
    return this.loaded.chunks.get(`${Math.floor(Math.ceil(x + 1) / CHUNK_SIZE)};${Math.floor(Math.floor(y - 1) / CHUNK_SIZE)}`)
  }
}
