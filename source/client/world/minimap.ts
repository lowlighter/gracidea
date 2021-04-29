//Imports
  import { Render } from "../render/render.ts"
  import { Renderable } from "./renderable.ts"
  import type { World } from "./world.ts"

/** Map data */
  type MinimapData = {regions:RegionData[]}
  type RegionData = {name:string, mx:number, my:number, pins:PinData[]}
  type PinData = {name:string, mx:number, my:number, x:number, y:number}


/**
 * World map.
 */
  export class Minimap extends Renderable {

    /** Sprite */
      readonly sprite:ReturnType<typeof Render.Container>

    /** World map data */
      private data = null as MinimapData|null

    /** Constructor */
      constructor({world}:{world:World}) {
        super({world})
        this.sprite = this.world.sprites.minimap.addChild(Render.Container())
        this.hide()
      }

    /** Hide sprite */
      hide() {
        this.world.sprites.world.filters = null
        return super.hide()
      }

    /** Show sprite */
      show() {
        this.world.sprites.world.filters = [new Render.filters.BlurFilter(), new Render.filters.ColorMatrixFilter()]
        this.world.sprites.world.filters[1].brightness(.5)
        return super.show()
      }

    /** Tell if minimap is open */
      get open() {
        return this.sprite.visible
      }

    /** Render */
      protected async render() {
        //Configure sprite
          this.sprite.scale.set(1.5)
        //Load map data
          if (!this.data)
            this.data = await fetch(`/map/${this.world.name}/pins`).then(res => res.json()) as MinimapData
        //Iterate through regions
          for (const {name, mx, my, pins} of this.data.regions) {
            const sprite = this.sprite.addChild(Render.Sprite({frame:`imgs/regions/${name}.png`}))
            sprite.position.set(mx, my)
            //Iterate through pins
              for (const {x, y, mx, my} of pins) {
                const pin = sprite.addChild(Render.Graphics({fill:[0xFF0000, 0.5], rect:[0, 0, .5, .5]}))
                pin.interactive = true
                pin.position.set(mx, my)
                pin.on("mouseover", () => pin.tint = 0x00FF00)
                pin.on("mouseout", () => pin.tint = 0xFFFFFF)
                pin.on("click", () => this.moveTo({x, y}))
                pin.on("tap", () => this.moveTo({x, y}))
              }
          }

          console.log(this.sprite.width, this.sprite.height, this.sprite.x, this.sprite.y)

      }

    /** Move camera to given position and hide minimap */
      private moveTo({x, y}:{x:number, y:number}) {
        this.world.camera.moveTo({x, y})
        this.hide()
      }

  }