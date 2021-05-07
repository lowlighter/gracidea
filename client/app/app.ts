//Imports
  import { Render } from "./render/render.ts"
  import { World } from "./world/world.ts"
  import { Controller } from "./controller/controller.ts"

/** App */
  export class App {

    /** World reference */
      readonly world:World

    /** Controller reference */
      readonly controller:Controller

    /** App ready state */
      readonly ready:Promise<void>

    /** Constructor */
      constructor() {
        //deno-lint-ignore no-explicit-any
        const that = this as any
        //deno-lint-ignore no-explicit-any
        this.world = null as any
        //deno-lint-ignore no-explicit-any
        this.controller = null as any
        this.ready = new Promise(async solve => {
          await Render.setup()
          that.world = new World({app:this})
          that.controller = new Controller({app:this, world:this.world})
          that.world.camera.moveTo({x:329, y:-924})
          solve()
        })
      }

    /** Debug */
      static debug = {
        logs:false,
        chunks:false,
        areas:false,
        camera:false,
      }

    /** Config */
      static config = {
        showNpcs:true,
        showCreatures:true,
        shinyRate:1/8,
      }

  }