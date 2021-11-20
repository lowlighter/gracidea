//Imports
import * as PIXI from "../../../../../app/build/cache/pixi.js/package/dist/browser/pixi.min.mjs"
import {global} from "../types.ts"
import type {App} from "../app.ts"
import type {Renderable} from "./renderable.ts"

/**
 * Render engine.
 * A wrapper around PIXI engine.
 */
export class Render {

  /** Render engine */
  static readonly engine: Engine

  /** Render application instance */
  private static readonly instance: Application

  /** Render setup */
  protected static async setup({app}:{app:typeof App}) {
    //Configure PIXI
    Object.assign(this, {engine:PIXI, cache:PIXI.utils.TextureCache})
    this.engine.settings.SCALE_MODE = this.engine.SCALE_MODES.NEAREST
    this.engine.settings.ROUND_PIXELS = true
    const pending = []

    //Load resources
    const loader = Render.engine.Loader.shared
    for (const texture of ["tileset", "npcs", "creatures"])
      loader.add(`/textures/${app.config.style}/${texture}.json?sha=${app.sha}`)
    loader.onProgress.add((_:unknown, { url = "" }) => app.loaded(`loaded ${new URL(url, global.location).pathname}`))
    loader.onComplete.add(() => app.loaded("all textures successfully loaded"))
    pending.push(new Promise(solve => loader.load(() => solve(null))))

    //Load tileset properties
    pending.push(new Promise<void>(async solve => {
      const tileset = await fetch("/api/textures/tilesets/tileset").then(response => response.json())
      app.loaded(`loaded tileset metadata`)
      Object.assign(this, {tileset})
      solve()
    }))

    //Create application
    Object.assign(this, {instance:new Render.engine.Application({
      width: global.document.body.clientWidth,
      height: global.document.body.clientHeight,
      resolution: global.devicePixelRatio,
      backgroundAlpha: 0,
    })})
    this.instance.resizeTo = global.window
    global.document.querySelector("body").appendChild(this.instance.view)

    //Wait for resources to be loaded
    await Promise.all(pending)
    app.loaded("render engine ready")
  }

  /** Time */
  static readonly t = 0

  /** Registered renderable instances */
  private static readonly registered = new WeakMap<Renderable>()

  /** Register a new renderable */
  static register(renderable:Renderable) {
    this.registered.set(renderable, (dt:number) => renderable.update({t:Render.t, dt}))
    Render.engine.Ticker.shared.add(this.registered.get(renderable))
    return this
  }

  /** Unregister an existing renderable */
  static unregister(renderable:Renderable) {
    Render.engine.Ticker.shared.remove(this.registered.get(renderable))
    this.registered.delete(renderable)
    return this
  }

  /** Frames per second */
  static get fps() {
    return Render.engine.Ticker.shared.FPS
  }

  /** Tileset tiles properties */
  static readonly tileset: {
    animated:{[key:string]:{frames:string[], speed:number}},
    zindex:{[key:string]:number}
  }

  /** Texture cache */
  static readonly cache:{[key:string]:ReturnType<typeof Render.engine.Texture>}

  /** Load a texture */
  static Texture(frame = null as frame) {
    if (`${frame}` in Render.cache)
      return Render.engine.Texture.from(`${frame}`)
    return Render.engine.Texture.EMPTY
  }

  /** Color filter */
  static ColorFilter({brightness = NaN, saturate = NaN, tint = NaN} = {}) {
    const filter = new Render.engine.filters.ColorMatrixFilter()
    if (!Number.isNaN(brightness))
      filter.brightness(brightness)
    if (!Number.isNaN(saturate))
      filter.saturate(saturate)
    if (!Number.isNaN(tint))
      filter.tint(tint)
    return [filter]
  }

  /** Create a new polygon */
  static Polygon(points = [] as number[]) {
    return new Render.engine.Polygon(...points.map(n => n * 16))
  }

  /** Create a new rectangle */
  static Rectangle(points = [] as number[]) {
    return new Render.engine.Rectangle(...points.map(n => n * 16))
  }

  /** Create a new container */
  static Container({ x = 0, y = 0, z = NaN, sorted = false, visible = true } = {}) {
    const container = new Render.engine.Container()
    if (sorted)
      container.sortableChildren = true
    container.position.set(x * 16, y * 16)
    if (!Number.isNaN(z))
      container.zIndex = z
    container.visible = visible
    return container
  }

  /** Created a new tiling sprite */
  static TilingSprite({ frame = null, x = 0, y = 0, z = NaN, width = 0, height = 0 }:TilingSprite = {}) {
    const sprite = Render.engine.TilingSprite(Render.Texture(frame), { width: width * 16, height: height * 16 })
    sprite.position.set(x * 16, y * 16)
    if (!Number.isNaN(z))
      sprite.zIndex = z
    return sprite
  }

  /** Create a new sprite */
  static Sprite({ frame = null, x = 0, y = 0, z = NaN, anchor, scale}:Sprite = {}) {
    let sprite
    if (`${frame}` in this.tileset.animated) {
      const {frames, speed} = this.tileset.animated[frame]
      sprite = new Render.engine.AnimatedSprite.fromFrames(frames)
      sprite.animationSpeed = speed
      sprite.play()
    }
    else
      sprite = new Render.engine.Sprite(Render.Texture(frame))
    sprite.position.set(x * 16, y * 16)
    if (anchor)
      sprite.anchor.set(...anchor)
    if (scale)
      sprite.scale.set(...scale)
    if (!Number.isNaN(z))
      sprite.zIndex = z
    return sprite
  }

  /** Create a new graphics */
  static Graphics({ z = NaN, stroke, fill, text, textStyle, textPosition, textAnchor = [0.5, 0.5], rect, circle, ellipse, polygon }:Graphics = {}) {
    const graphics = new Render.engine.Graphics()
    if (stroke)
      graphics.lineStyle(...stroke)
    if (fill)
      graphics.beginFill(...fill)
    if (rect)
      graphics.drawRect(...rect.map(n => n * 16))
    if (circle)
      graphics.drawCircle(...circle.map(n => n * 16))
    if (ellipse)
      graphics.drawEllipse(...ellipse.map(n => n * 16))
    if (polygon) {
      if (polygon instanceof Render.engine.Polygon)
        graphics.drawPolygon(polygon)
      else
        graphics.drawPolygon(...polygon.map(n => n * 16))
    }
    graphics.endFill()
    if (text) {
      const textSprite = graphics.addChild(new Render.engine.Text(text, textStyle))
      textSprite.anchor.set(...textAnchor)
      if (textPosition)
        textSprite.position.set(textPosition.x * 16, textPosition.y * 16)
    }
    if (!Number.isNaN(z))
      graphics.zIndex = z
    return graphics
  }

}

/** Compute intersection between two rectangle (from @pixi/math) */
PIXI.Rectangle.prototype.intersects = function intersects(other:ReturnType<typeof Render.engine.Rectangle>){
  const x0 = this.x < other.x ? other.x : this.x;
  const x1 = this.right > other.right ? other.right : this.right;
  if (x1 <= x0)
    return false;
  const y0 = this.y < other.y ? other.y : this.y;
  const y1 = this.bottom > other.bottom ? other.bottom : this.bottom;
  return y1 > y0;
};

/** Render engine */
//deno-lint-ignore no-explicit-any
export type Engine = any

/** Render application */
//deno-lint-ignore no-explicit-any
export type Application = any

/** Frame */
export type frame = null|string|number|typeof Render.engine.Texture.EMPTY

/** TilingSprite constructor */
export type TilingSprite = {
  frame?:frame,
  x?:number,
  y?:number,
  z?:number,
  width?:number,
  height?:number
}

/** Sprite constructor */
export type Sprite = {
  frame?:frame,
  x?:number,
  y?:number,
  z?:number,
  anchor?:[number, number],
  scale?:[number, number]
}

/** Graphics constructor */
export type Graphics = {
  z?:number,
  stroke?:[number, number, number],
  fill?:[number, number],
  text?:string,
  textStyle?:{[key:string]:unknown},
  textPosition?: { x: number; y: number }
  textAnchor?:[number, number],
  rect?:number[],
  circle?:number[],
  ellipse?:number[],
  polygon?:number[]
}