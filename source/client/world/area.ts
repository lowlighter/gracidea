//Imports
  import { Render } from "../render/render.ts"
  import { Renderable } from "./renderable.ts"
  import { TILE_SIZE } from "../render/settings.ts"
  import type { World } from "./world.ts"
  import type { Chunk } from "./chunk.ts"
  import { App } from "./../app.ts"

/** Area data */
  type AreaData = {
    id:number
    points:number[]
    properties:{}
  }

/**
 * World area.
 * Define a world area, which can be used to define zones, locations, etc.
 */
  export class Area extends Renderable {

    /** Identifier */
      readonly id:string

    /** Sprite */
      readonly sprite:ReturnType<typeof Render.Container>

    /** Area data */
      readonly data:AreaData

    /** Polygon */
      readonly polygon:ReturnType<typeof Render.Polygon>

    /** Constructor */
      constructor({id, data, world}:{id:string, data:AreaData, world:World}) {
        super({world})
        this.id = id
        this.data = data
        this.polygon = Render.Polygon(this.data.points)
        this.sprite = Render.Container()
        if (App.debugLogs)
          console.debug(`loaded area: ${this.id}`)
      }

    /** Test if point is within area */
      contains({x, y}:{x:number, y:number}) {
        return this.polygon.contains(x*TILE_SIZE, y*TILE_SIZE)
      }

      show() {
        if ((this as any)._debug)
        (this as any)._debug.tint = this.contains(this.world.camera) ? 0xFFFFFF : 0xFF00FF
        return super.show()
      }

    /** Render */
      render() {
        //Debug
          this.debug(App.debugAreas, () => this.world.sprites.debug.addChild(Render.Graphics({text:this.id, textStyle:{fontSize:12, fill:"white"}, stroke:[1, 0x00FF00, .5], fill:[0x00FF00, .25], polygon:this.polygon})))
      }

    /** Destructor */
      destructor() {
        if (App.debugLogs)
          console.debug(`unloaded loaded area: ${this.id}`)
        return super.destructor()
      }

      static from({data, chunk}:{data:AreaData, chunk:Chunk}) {
        const id = `${data.id}`
        if (!chunk.world.loaded.areas.has(id))
          chunk.world.loaded.areas.set(id, new Area({id, data, world:chunk.world}))
        return chunk.world.loaded.areas.get(id) as Area
      }
  }