//Imports
  import { Render } from "../render/render.ts"
  import { Chunk } from "./chunk.ts"
  import { Area } from "./area.ts"
  import { Camera } from "./camera.ts"
  import { Minimap } from "./minimap.ts"
  import { CHUNK_SIZE } from "../render/settings.ts"
  import type { App } from "../app.ts"

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
        minimap:ReturnType<typeof Render.Container>
      }

    /** Loaded */
      readonly loaded = {
        chunks:new Map<string, Chunk>(),
        areas:new Map<string, Area>(),
      }

    /** Camera */
      readonly camera:Camera

    /** World map */
      readonly minimap:Minimap

    /** World name */
      readonly name = "overworld"

    /** App */
      readonly app:App

    /** Constructor */
      constructor({app}:{app:App}) {
        this.app = app
        const sprite = Render.app.stage.addChild(Render.Container())
        this.sprites = {
          world:sprite,
          chunks:sprite.addChild(Render.Container()),
          locations:sprite.addChild(Render.Container()),
          debug:sprite.addChild(Render.Container()),
          minimap:Render.app.stage.addChild(Render.Container()),
        }
        this.camera = new Camera({world:this})
        this.minimap = new Minimap({world:this})


        const textures = [2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381].map(frame => Render.Texture({frame}))

        //      sea.texture = Render.Texture({frame:`${2374+Math.floor(i)%8}`})

        let tick = 0
        Render.engine.Ticker.shared.add(() => {
          tick += 0.0625
          if (Number.isInteger(tick))
          this.loaded.chunks.forEach(chunk => {
            if (chunk.layers.has("0X"))
              chunk.layers.get("0X").texture = textures[tick%textures.length]
          })



        })
      }

    /** Return chunk for a given position */
      chunkAt({x, y}:{x:number, y:number}) {
        return this.loaded.chunks.get(`${Math.floor(x/CHUNK_SIZE)};${Math.floor(y/CHUNK_SIZE)}`)
      }

  }