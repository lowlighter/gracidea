//Imports
import {global} from "../types.ts"
import { Render } from "./../rendering/render.ts"
import {Renderable} from "../rendering/renderable.ts"
import type {World} from "./world.ts"
import type {Region} from "./region.ts"

const visible = {x:16*7, y:16*5}
const loaded = {x:16*11, y:16*9}

/**
 * Camera.
 */
export class Camera extends Renderable {

  /** World */
  readonly #world:World

  /** Constructor */
  constructor({world}:{world:World}) {
    super({id:"camera", visible:false})
    this.#world = world
    this.#world.debug.addChild(this.debug)
    this.#visible = Render.Rectangle([0, 0, visible.x/16, visible.y/16])
    this.#loaded = Render.Rectangle([0, 0, loaded.x/16, loaded.y/16])
  }

  /** Visible areas */
  readonly #visible:ReturnType<typeof Render.Rectangle>

  /** Loaded areas */
  readonly #loaded:ReturnType<typeof Render.Rectangle>

  /** Update renderable */
  async update({debug = this.debug.visible, t, dt}:{t:number, dt:number, debug?:boolean}) {

    //Update position and areas
    const {x, y} = this
    this.#visible.x = x - this.#visible.width/2
    this.#visible.y = y - this.#visible.height/2
    this.#loaded.x = x - this.#loaded.width/2
    this.#loaded.y = y- this.#loaded.height/2

    //Dynamically load and unload sections
    this.#world.regions.forEach(((region:Region) => {
      //Load sections in range
      for (const [id, bounds] of region.loadable) {
        if (this.intersects(bounds) > Intersection.NONE)
          region.load(id)
      }
      //Update sections display and clean out the ones that are too far away
      for (const [_, section] of region.sections) {
        const i = this.intersects(section.bounds)
        if (i < Intersection.LOADED)
          section.destructor()
        else if (i < Intersection.VISIBLE)
          section.hide()
        else
          section.show()
      }
    }))

    //Debug sprite
    if (debug) {
      this.debug.bounds.removeChildren()
      this.debug.bounds.addChild(Render.Graphics({
        rect:[this.#loaded.x, this.#loaded.y, this.#loaded.width, this.#loaded.height],
        fill:[0xAAAAAA, .125],
      }))
      this.debug.bounds.addChild(Render.Graphics({
        text: [
          `x: ${x}`,
          `y: ${y}`,
          `visible.x: ${this.#visible.x} to ${this.#visible.x+this.#visible.width}`,
          `visible.y: ${this.#visible.y} to ${this.#visible.y+this.#visible.height}`,
          `loaded.x: ${this.#loaded.x} to ${this.#loaded.x+this.#loaded.width}`,
          `loaded.y: ${this.#loaded.y} to ${this.#loaded.y+this.#loaded.height}`,
        ].join("\n"),
        textPosition:{x, y},
        textAnchor:[.5, .5],
        textStyle: { fontSize: 12, fontFamily: "monospace" },
        rect:[this.#visible.x, this.#visible.y, this.#visible.width, this.#visible.height],
        fill:[0xDDDDDD, .125],
      }))
    }
    return super.update({t, dt, debug:false})
  }

  /** Test in which camera area a rectangle is located */
  private intersects(rectangle:ReturnType<typeof Render.engine.Rectangle>) {
    if (!this.#loaded.intersects(rectangle))
      return Intersection.NONE
    else if (!this.#visible.intersects(rectangle))
      return Intersection.LOADED
    return Intersection.VISIBLE
  }

  /** Move camera to given position */
  place({ x, y }: { x: number; y: number }) {
    this.#world.sprite.position.set(-x * 16 + global.document.body.clientWidth / 2, -y * 16 + global.document.body.clientHeight / 2)
  }

  /** X coordinate */
  get x() {
    return Math.floor((-this.#world.sprite.position.x + global.document.body.clientWidth / 2) / 16)
  }

  /** Y coordinate */
  get y() {
    return Math.floor((-this.#world.sprite.position.y + global.document.body.clientHeight / 2) / 16)
  }

}

/** Intersection with camera areas */
export const enum Intersection {
  NONE = 0,
  LOADED = 1,
  VISIBLE = 2,
}