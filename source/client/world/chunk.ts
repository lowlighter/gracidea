//Imports
  import { Render } from "../render/render.ts"
  import { Renderable } from "./renderable.ts"
  import { CHUNK_SIZE } from "../render/settings.ts"
  import type { World } from "./world.ts"
  import { App } from "./../app.ts"

/** Chunk data */
  type ChunkData = {
    layers:{[key:string]:number[]}
  }

/**
 * World chunk.
 * Split world in smaller parts for improved rendering.
 * Chunks are divided internally into layers.
 */
  export class Chunk extends Renderable {

    /** Identifier */
      readonly id:string

    /** Sprite */
      readonly sprite:ReturnType<typeof Render.Container>

    /** Sprites */
      readonly sprites:{
        placeholder:ReturnType<typeof Render.Sprite>|null
      }

    /** Chunk data */
      private data = null as ChunkData|null

    /** Layers */
      readonly layers = new Map()

    /** Constructor */
      constructor({id, world}:{id:string, world:World}) {
        super({world})
        this.id = id
        ;[this.x, this.y] = this.id.split(";").map(n => Number(n)*CHUNK_SIZE)
        this.width = this.height = CHUNK_SIZE
        this.sprite = this.world.sprites.chunks.addChild(Render.Container({x:this.x, y:this.y, sorted:true}))
        this.sprites = {placeholder:null}
        console.debug(`loaded chunk: ${this.id}`)
      }

    /** Destructor */
      destructor() {
        console.debug(`unloaded loaded chunk: ${this.id}`)
        return super.destructor()
      }

    /** Render */
      async render() {
        //Placeholder
          if (this.sprites.placeholder)
            this.sprites.placeholder.visible = true
          else
            this.sprites.placeholder = this.sprite.addChild(Render.Sprite({z:99, frame:"0", scale:[CHUNK_SIZE, CHUNK_SIZE]}))
        //Debug
          this.debug(App.debugChunks, () => this.world.sprites.debug.addChild(Render.Graphics({z:100, text:this.id, textStyle:{fontSize:12, fill:"white"}, stroke:[1, 0x0000FF, .5], fill:[0x0000FF, .25], rect:[0, 0, this.width, this.height]})))
        //Load chunk data
          if (!this.data)
            this.data = await fetch(`/map/overworld/${this.id}`).then(res => res.json())
        //Render layers
          for (const {name, sublayers, sorted = false} of [
            {name:"1X", sublayers:["1A", "1B", "1C"]},
            {name:"2X", sublayers:["2A", "2B", "2C"], sorted:true},
          ]) {
            //Load layer
              if (!this.layers.has(name))
                this.layers.set(name, this.sprite.addChild(Render.Container({z:0, sorted})))
              const layer = this.layers.get(name)
            //Render sublayers
              for (let z = 0; z < sublayers.length; z++) {
                //Load tiles
                  const tiles = this.data?.layers?.[sublayers[z]]
                  if (!tiles)
                    continue
                //Render tiles
                  for (let i = 0; i < tiles.length; i++) {
                    const tile = tiles[i]
                    if (tile >= 0) {
                      const y = i%CHUNK_SIZE, x = Math.floor(i/CHUNK_SIZE)
                      if ((x === 0)&&(y === 1))
                      console.log(sublayers[z], x, y, z, y*CHUNK_SIZE+z)
                      layer.addChild(Render.Sprite({frame:tile, x, y, z:y*CHUNK_SIZE+z}))
                    }
                  }
              }
          }
        //Hide placeholder
          if (this.sprites.placeholder)
            this.sprites.placeholder.visible = false
      }

      tileEnvAt({x, y}:{x:number, y:number}) {
        return this.data?.layers?.["1A"]?.[x*CHUNK_SIZE+y] ?? NaN > 0 ? "GROUND" : "WATER"
      }

  }