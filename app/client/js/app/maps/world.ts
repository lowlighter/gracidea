//Imports
import { App } from "../app.ts"
import {Renderable} from "../rendering/renderable.ts"
import {Region} from "./region.ts"
import {Camera} from "./camera.ts"
import type { Graphics } from "./../rendering/render.ts"

/**
 * World.
 */
export class World extends Renderable {

  /** Loaded regions */
  readonly regions = new Map<string, Region>()

  /** Camera */
  readonly camera:Camera

  /** Constructor */
  constructor() {
    super({id:"gracidea"})
    this.camera = new Camera({world:this})
    this.init()
  }

  /** Initialize renderable */
  protected async init() {
    const {regions} = await fetch("/api/maps").then(res => res.json())
    for (const {id = "", x = 0, y = 0} of regions)
      this.regions.set(id, new Region({world:this, id, x, y}))
    return super.init({parent:App.rendering.stage})
  }

  /** Debug graphics properties */
  protected static debug = {text:""} as Partial<Graphics>

}
