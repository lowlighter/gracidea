//Imports
  import { Render } from "./render/render.ts"
  import { World } from "./world/world.ts"

/** Window */
  const global = globalThis as any

/** App */
  export class App {

    /** World reference */
      readonly world:World

    /** App ready state */
      readonly ready:Promise<void>

    /** Constructor */
      constructor() {
        const that = this as any
        this.world = null as any
        this.ready = new Promise(async solve => {
          await Render.setup()
          that.world = new World()

          let timeout = null
          Render.app.view.addEventListener("wheel", (event:any) => {
            event.preventDefault()
            if (!this.world.minimap.open) {
              this.world.sprites.world.position.set(
                Math.round(this.world.sprites.world.position.x - event.deltaX),
                Math.round(this.world.sprites.world.position.y - event.deltaY),
              )
              } else {
            this.world.minimap.sprite.position.set(
              Math.round(this.world.minimap.sprite.position.x - event.deltaX),
              Math.round(this.world.minimap.sprite.position.y - event.deltaY),
            )
              }
            this.world.camera.render()
            this.updateDOM()
          })

          global.document.addEventListener("keydown", ({code}:any) => {
            switch (code) {
              case "ArrowLeft":
                this.world.camera.x--
                this.world.camera.render()
                break
              case "ArrowRight":
                this.world.camera.x++
                this.world.camera.render()
                break
              case "ArrowUp":
                this.world.camera.y--
                this.world.camera.render()
                break
              case "ArrowDown":
                this.world.camera.y++
                this.world.camera.render()
                break
            }
            this.updateDOM()
          })

          global.document.querySelector("[data-for='map']")?.addEventListener("click", () => {
            this.world.minimap.toggle()
          })

          solve()
        })

      }

      updateDOM() {

        const name = global.document.querySelector("#location .name")
        if (name)
          name.innerHTML = this.world.camera.location.join("<br>")
        const position = global.document.querySelector("#location .position")
          if (position)
            position.innerHTML = `${this.world.camera.x};${this.world.camera.y}`
      }

      static debugLogs = true
      static debugChunks = true
      static debugAreas = true
      static debugCamera = true

  }

  global.app = new App()