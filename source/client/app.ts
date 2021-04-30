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
        const that = this as any
        this.world = null as any
        this.ready = new Promise(async solve => {
          await Render.setup()
          that.world = new World({app:this})
          that.controller = new Controller({app:this, world:this.world})

          that.world.camera.moveTo({x:329, y:-924})
          solve()
        })
      }

      static debugLogs = true
      static debugChunks = true
      static debugAreas = true
      static debugCamera = true

  }

//Start app
  ;(globalThis as any).app = new App()