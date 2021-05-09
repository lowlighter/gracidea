//Imports
import type { asyncdef } from "../../build/constants.ts"
import { World } from "./world/world.ts"
import { Controller } from "./controller.ts"
import { Render } from "./render.ts"

/** App */
export class App {
  /** World reference */
  readonly world: World

  /** Controller reference */
  readonly controller: Controller

  /** App ready state */
  readonly ready: Promise<void>

  /** Constructor */
  constructor() {
    const that = this as asyncdef
    this.world = null as asyncdef
    this.controller = null as asyncdef
    const params = new URLSearchParams(window.location.search)
    App.debug.patch = params.get("patch")
    this.ready = new Promise(solve => {
      Render.setup().then(() => {
        that.world = new World({ app: this, name: params.get("map") })
        that.controller = new Controller({ app: this, world: this.world })
        that.world.camera.moveTo({ x: 329, y: -924 })
        solve()
      })
    })
  }

  /** Debug */
  static debug = {
    logs: false,
    chunks: false,
    areas: false,
    camera: false,
    patch: null as string | null,
  }

  /** Config */
  static config = {
    showNpcs: true,
    showCreatures: true,
    shinyRate: 1 / 8,
    delta: 0.0625,
  }
}
