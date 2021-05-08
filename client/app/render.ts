//Imports
import { ANIMATED, global, TILE_SIZE } from "../../build/constants.ts"
import * as PIXI from "../../node_modules/pixi.js/dist/browser/pixi.min.mjs"

/** Frame */
type frame = string | number | ReturnType<typeof Render.Texture>

/** Font style */
type fontstyle = { [key: string]: unknown }

/**
 * Render engine.
 * A wrapper around PIXI engine.
 */
export class Render {
  /** Render engine */
  //deno-lint-ignore no-explicit-any
  static engine: any

  /** Render application */
  //deno-lint-ignore no-explicit-any
  static app: any

  /** Render setup */
  static async setup() {
    //Load and configure PIXI
    this.engine = PIXI
    this.engine.settings.SCALE_MODE = this.engine.SCALE_MODES.NEAREST
    this.engine.settings.ROUND_PIXELS = true
    //Load resources
    const loader = Render.engine.Loader.shared
    loader.add("/copyrighted/textures/tileset3.json")
    loader.add("/copyrighted/textures/npcs.json")
    loader.add("/copyrighted/textures/creatures.json")
    //Create application
    this.app = new Render.engine.Application({
      width: global.document.body.clientWidth,
      height: global.document.body.clientHeight,
      resizeTo: global.window,
      autoDensity: true,
      resolution: global.devicePixelRatio,
      backgroundAlpha: 0,
    })
    global.document.querySelector("body").appendChild(this.app.view)
    //Wait for resources to be loaded
    await new Promise(solve => loader.load(() => solve(null)))
    global.document.querySelector(".loader").style.display = "none"
  }

  /** Polygon */
  static Polygon(points: number[]) {
    return new Render.engine.Polygon(...points.map(n => n * TILE_SIZE))
  }

  /** Graphics */
  static Graphics(
    { z = NaN, stroke, fill, text, textStyle, textPosition, rect, circle, ellipse, polygon }: {
      z?: number
      stroke?: [number, number, number]
      fill?: [number, number]
      text?: string
      textStyle?: fontstyle
      textPosition?: { x: number; y: number }
      rect?: number[]
      circle?: number[]
      ellipse?: number[]
      polygon?: number[]
    },
  ) {
    const graphics = new Render.engine.Graphics()
    if (stroke)
      graphics.lineStyle(...stroke)
    if (fill)
      graphics.beginFill(...fill)
    if (rect)
      graphics.drawRect(...rect.map(n => n * TILE_SIZE))
    if (circle)
      graphics.drawCircle(...circle.map(n => n * TILE_SIZE))
    if (ellipse)
      graphics.drawEllipse(...ellipse.map(n => n * TILE_SIZE))
    if (polygon) {
      if (polygon instanceof Render.engine.Polygon)
        graphics.drawPolygon(polygon)
      else
        graphics.drawPolygon(...polygon.map(n => n * TILE_SIZE))
    }
    graphics.endFill()
    if (text) {
      const textSprite = graphics.addChild(new Render.engine.Text(text, textStyle))
      textSprite.anchor.set(0.5)
      if (textPosition)
        textSprite.position.set(textPosition.x, textPosition.y)
    }
    if (!Number.isNaN(z))
      graphics.zIndex = z
    return graphics
  }

  /** ParticleContainer */
  static ParticleContainer({ x = 0, y = 0 }: { x?: number; y?: number } = {}) {
    const container = new Render.engine.ParticleContainer()
    container.position.set(x * TILE_SIZE, y * TILE_SIZE)
    return container
  }

  /** Container */
  static Container({ x = 0, y = 0, z = NaN, sorted = false }: { x?: number; y?: number; z?: number; sorted?: boolean } = {}) {
    const container = new Render.engine.Container()
    container.position.set(x * TILE_SIZE, y * TILE_SIZE)
    if (!Number.isNaN(z))
      container.zIndex = z
    if (sorted)
      container.sortableChildren = true
    return container
  }

  /** Texture */
  static Texture({ frame = Render.engine.Texture.EMPTY }: { frame: unknown }) {
    return Render.engine.Texture.from(`${frame}`)
  }

  /** Tiling sprite */
  static TilingSprite(
    { frame = Render.engine.Texture.EMPTY, x = 0, y = 0, z = NaN, width = 0, height = 0 }: { frame?: frame; x?: number; y?: number; z?: number; width?: number; height?: number },
  ) {
    const sprite = Render.engine.TilingSprite.from(`${frame}`, { width: width * TILE_SIZE, height: height * TILE_SIZE })
    sprite.position.set(x * TILE_SIZE, y * TILE_SIZE)
    if (!Number.isNaN(z))
      sprite.zIndex = z
    return sprite
  }

  /** Sprite */
  static Sprite(
    { frame = Render.engine.Texture.EMPTY, x = 0, y = 0, z = NaN, anchor, scale }: {
      frame?: frame
      x?: number
      y?: number
      z?: number
      anchor?: [number, number]
      scale?: [number, number]
    } = {},
  ) {
    let sprite
    if (frame instanceof Render.engine.Texture)
      sprite = new Render.engine.Sprite.from(frame)
    else if (`${frame}` in ANIMATED) {
      sprite = new Render.engine.AnimatedSprite.fromFrames(ANIMATED[frame as keyof typeof ANIMATED].frames)
      sprite.animationSpeed = ANIMATED[frame as keyof typeof ANIMATED].speed
      sprite.play()
    }
    else {
      sprite = new Render.engine.Sprite.from(`${frame}`)
    }
    sprite.position.set(x * TILE_SIZE, y * TILE_SIZE)
    if (anchor)
      sprite.anchor.set(...anchor)
    if (scale)
      sprite.scale.set(...scale)
    if (!Number.isNaN(z))
      sprite.zIndex = z
    return sprite
  }

  /** Texture cache */
  static get cache() {
    return Render.engine.utils.TextureCache
  }

  /** Filters */
  static get filters() {
    return Render.engine.filters
  }
}
