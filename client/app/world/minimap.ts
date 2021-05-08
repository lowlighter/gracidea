//Imports
import { global } from "../../../build/constants.ts"
import { Render } from "../render.ts"
import { Renderable } from "./renderable.ts"
import type { World } from "./world.ts"

/** Mini-map data */
type MinimapData = { regions: { [key: string]: RegionData } }

/** Mini-map region data */
type RegionData = { mx: number; my: number; pins: PinData[] }

/** Mini-map pin data */
type PinData = { name: string; mx: number; my: number; x: number; y: number }

/**
 * World map.
 */
export class Minimap extends Renderable {
  /** Sprite */
  readonly sprite: ReturnType<typeof Render.Container>

  /** Mini-map data */
  private data = null as MinimapData | null

  /** Constructor */
  constructor({ world }: { world: World }) {
    super({ world })
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
    for (const [name, { mx, my, pins }] of Object.entries(this.data.regions)) {
      const sprite = this.sprite.addChild(Render.Sprite({ frame: `copyrighted/imgs/regions/${name}.png` }))
      sprite.position.set(mx, my)
      //Iterate through pins
      for (const { x, y, mx, my } of pins) {
        const pin = sprite.addChild(Render.Graphics({ fill: [0xFF0000, 0.5], rect: [0, 0, .5, .5] }))
        pin.interactive = true
        pin.position.set(mx, my)
        pin.on("mouseover", () => pin.tint = 0x00FF00)
        pin.on("mouseout", () => pin.tint = 0xFFFFFF)
        pin.on("click", () => this.moveTo({ x, y }))
        pin.on("tap", () => this.moveTo({ x, y }))
      }
    }
    //Center mini-map
    let mx = Infinity, my = Infinity, Mx = -Infinity, My = -Infinity
    this.sprite.children.forEach((sprite: { [key: string]: number }) => {
      mx = Math.min(mx, sprite.x)
      my = Math.min(my, sprite.y)
      Mx = Math.max(Mx, sprite.x + sprite.width)
      My = Math.max(My, sprite.y + sprite.height)
    })
    const width = (Mx - mx) / 2, height = (My - my) / 2
    this.sprite.position.set(
      -mx + (width + global.document.body.clientWidth / 2) / 2,
      -my + (height - global.document.body.clientHeight / 2) / 2,
    )
  }

  /** Move camera to given position and hide minimap */
  private moveTo({ x, y }: { x: number; y: number }) {
    this.world.camera.moveTo({ x, y })
    this.hide()
  }
}
