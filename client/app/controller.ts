//Imports
import { event, global } from "../../build/constants.ts"
import type { World } from "./world/world.ts"
import { App } from "./app.ts"
import { Render } from "./render.ts"

/**
 * Controller
 */
export class Controller {
  /** App */
  private readonly app: App

  /** World */
  private readonly world: World

  /** Constructor */
  constructor({ app, world }: { app: App; world: World }) {
    this.app = app
    this.world = world
    this.scrollers()
    this.controls()
  }

  /** Scrollers */
  private scrollers() {
    let click = { x: 0, y: 0, active: false }
    let touch = { x: 0, y: 0 }
    Render.app.view.addEventListener("touchstart", (event: event) => touch = { x: event.touches[0].pageX, y: event.touches[0].pageY })
    Render.app.view.addEventListener("touchmove", (event: event) => {
      const delta = { x: touch.x - event.touches[0].pageX, y: touch.y - event.touches[0].pageY }
      touch = { x: event.touches[0].pageX, y: event.touches[0].pageY }
      if (!this.world.minimap.open) {
        this.world.sprites.world.position.set(
          Math.round(this.world.sprites.world.position.x - delta.x),
          Math.round(this.world.sprites.world.position.y - delta.y),
        )
      }
      else {
        this.world.minimap.sprite.position.set(
          Math.round(this.world.minimap.sprite.position.x - delta.x),
          Math.round(this.world.minimap.sprite.position.y - delta.y),
        )
      }
      this.world.camera.render()
    })
    Render.app.view.addEventListener("mousedown", (event: event) => click = { x: event.pageX, y: event.pageY, active: true })
    global.document.addEventListener("mousemove", (event: event) => {
      if (click.active) {
        const delta = { x: click.x - event.pageX, y: click.y - event.pageY }
        click = { x: event.pageX, y: event.pageY, active: true }
        if (!this.world.minimap.open) {
          this.world.sprites.world.position.set(
            Math.round(this.world.sprites.world.position.x - delta.x),
            Math.round(this.world.sprites.world.position.y - delta.y),
          )
        }
        else {
          this.world.minimap.sprite.position.set(
            Math.round(this.world.minimap.sprite.position.x - delta.x),
            Math.round(this.world.minimap.sprite.position.y - delta.y),
          )
        }
      }
    })
    Render.app.view.addEventListener("mouseup", () => click.active = false)
    Render.app.view.addEventListener("wheel", (event: event) => {
      event.preventDefault()
      if (!this.world.minimap.open) {
        this.world.sprites.world.position.set(
          Math.round(this.world.sprites.world.position.x - event.deltaX),
          Math.round(this.world.sprites.world.position.y - event.deltaY),
        )
      }
      else {
        this.world.minimap.sprite.position.set(
          Math.round(this.world.minimap.sprite.position.x - event.deltaX),
          Math.round(this.world.minimap.sprite.position.y - event.deltaY),
        )
      }
      this.world.camera.render()
    })
  }

  /** Controls */
  private controls() {
    global.document.querySelector("[data-control-for='map']")?.addEventListener("click", () => this.world.minimap.toggle())
    global.document.querySelector("[data-control-for='debug']")?.addEventListener("click", () => {
      global.document.querySelector("nav.debug").style.display = global.document.querySelector("nav.debug").style.display === "flex" ? "none" : "flex"
    })
    Object.keys(App.debug).forEach(key => {
      const input = global.document.createElement("input")
      input.setAttribute("data-control-for", key)
      input.setAttribute("type", "checkbox")
      if (["patch"].includes(key))
        input.setAttribute("disabled", true)
      input.checked = App.debug[key as keyof typeof App.debug]
      input.addEventListener("change", () => {
        App.debug[key as keyof typeof App.debug] = input.checked as never
        this.world.camera.render()
      })
      const label = global.document.createElement("label")
      label.innerText = key
      label.prepend(input)
      global.document.querySelector(".debug")?.append(label)
    })
  }

  /** Update DOM */
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

  /** Update FPS */
  updateFPS(fps: number) {
    global.document.querySelector(".debug [data-control-for='fps']").innerText = `${Math.round(fps)} FPS`
  }
}
