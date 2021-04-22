//Imports
  import { Render } from "../render/render.ts"
  import { Renderable } from "./renderable.ts"
  import { TILE_SIZE } from "../render/settings.ts"
  import type { World } from "./world.ts"
  import { App } from "./../app.ts"

/** Area data */
  type AreaData = {
    center:{x:number, y:number}
    points:number[]
    type:string
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
        if (this.data.type === "location")
          this.world.loaded.locations.set(this.id, this)
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
  }