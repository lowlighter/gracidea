//Imports
  import { Render } from "../render/render.ts"
  import { Chunk } from "./chunk.ts"
  import { Area } from "./area.ts"
  import { Camera } from "./camera.ts"
  import { CHUNK_SIZE } from "../render/settings.ts"

/**
 * World.
 */
  export class World {

    /** Sprites */
      readonly sprites:{
        world:ReturnType<typeof Render.Container>
        chunks:ReturnType<typeof Render.Container>
        locations:ReturnType<typeof Render.Container>
        debug:ReturnType<typeof Render.Container>
      }

    /** Loaded */
      readonly loaded = {
        chunks:new Map<string, Chunk>(),
        areas:new Map<string, Area>(),
      }

    /** Camera */
      readonly camera:Camera

    /** Constructor */
      constructor() {
        const sprite = Render.app.stage.addChild(Render.Container())
        this.sprites = {
          world:sprite,
          chunks:sprite.addChild(Render.Container()),
          locations:sprite.addChild(Render.Container()),
          debug:sprite.addChild(Render.Container()),
        }
        this.camera = new Camera({world:this})
      }

    /** Return chunk for a given position */
      chunkAt({x, y}:{x:number, y:number}) {
        return this.loaded.chunks.get(`${Math.floor(x/CHUNK_SIZE)};${Math.floor(y/CHUNK_SIZE)}`)
      }

  }