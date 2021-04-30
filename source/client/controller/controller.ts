//Imports
  import { Render } from "../render/render.ts"
  import type { World } from "../world/world.ts"
  import type { App } from "../app.ts"
  import { global } from "./../render/settings.ts"

/** Event */
//deno-lint-ignore no-explicit-any
  type event = any

/**
 * Controller
 */
  export class Controller {

    /** App */
      private readonly app:App

    /** World */
      private readonly world:World

    /** Constructor */
      constructor({app, world}:{app:App, world:World}) {
        this.app = app
        this.world = world
        Render.app.view.addEventListener("wheel", (event:event) => {
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
        })
        global.document.addEventListener("keydown", ({code}:event) => {
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
        })
        global.document.querySelector("[data-for='map']")?.addEventListener("click", () => {
          this.world.minimap.toggle()
        })
      }

    /** update DOM */
      updateDOM() {
        //Location
          const location = global.document.querySelector("#location .name")
          if (location)
            location.innerHTML = this.world.camera.location[0] ?? "-  "
        //Position
          const position = global.document.querySelector("#location .position")
            if (position)
              position.innerHTML = `${this.world.camera.x};${this.world.camera.y}`
      }

  }