//Imports
import type { Renderable } from "../rendering/renderable.ts"
import type {event} from "../types.ts"
import {global} from "../types.ts"
import { App } from "./../app.ts";
import {debounce} from "https://deno.land/std@0.114.0/async/debounce.ts"

/**
 * Controller
 */
export class Controller {


  static instance = null as unknown as Controller

  /** Constructor */
  constructor({target}:{target:Renderable}) {
    this.#scrollers()
    this.target = target
    this.focus(target)
    Controller.instance = this
  }

  focus(element:Renderable|null) {
    this.#focus = element
  }

  target:Renderable

  #focus = null as Renderable|null


  #scrollers() {
    let click = { x: 0, y: 0, active: false }
    let touch = { x: 0, y: 0 }
    const sync = debounce(() => this.#sync(), 50)
    App.rendering.view.addEventListener("touchstart", (event: event) => {
      touch = { x: event.touches[0].pageX, y: event.touches[0].pageY }
    })
    App.rendering.view.addEventListener("mousedown", (event: event) => {
      click = { x: event.pageX, y: event.pageY, active: true }
    })
    App.rendering.view.addEventListener("touchmove", (event: event) => {
      const delta = { x: touch.x - event.touches[0].pageX, y: touch.y - event.touches[0].pageY }
      touch = { x: event.touches[0].pageX, y: event.touches[0].pageY }
      this.#update({delta})
    })
    global.document.addEventListener("mousemove", (event: event) => {
      if (click.active) {
        if (event.buttons === 0) {
          click.active = false
          return
        }
        const delta = { x: click.x - event.pageX, y: click.y - event.pageY }
        click = {x: event.pageX, y: event.pageY, active: true }
        this.#update({delta})
      }
      this.#cursor = {x:event.clientX, y:event.clientY}
      sync()
    })
    App.rendering.view.addEventListener("wheel", (event: event) => {
      event.preventDefault()
      this.#update({delta:{x:event.deltaX, y:event.deltaY}})
    })
  }

  #update({delta}:{delta?:{x:number, y:number}}) {
    if (this.#focus) {
      if (delta) {
        this.#focus.sprite.position.set(
          Math.round(this.#focus.sprite.position.x - delta.x),
          Math.round(this.#focus.sprite.position.y - delta.y),
        )
      }
    }
  }


  #sync() {
    const {x, y} = this.cursor
    global.document.querySelector("#cursor-x").innerText = x
    global.document.querySelector("#cursor-y").innerText = y
  }


  get camera() {
    return {
      x:Math.floor((-this.target.sprite.position.x + global.document.body.clientWidth / 2) / 16),
      y:Math.floor((-this.target.sprite.position.y + global.document.body.clientHeight / 2) / 16),
    }
  }

  #cursor = {x:0, y:0}

  get cursor() {
    return {
      x:Math.floor((-this.target.sprite.position.x + this.#cursor.x) / 16),
      y:Math.floor((-this.target.sprite.position.y + this.#cursor.y) / 16),
    }
  }



  /*Object.defineProperties(this, {
    x: {
      get: () =>
      set: x => this.moveTo({ x, y: this.y }),
    },
    y: {
      set: y => this.moveTo({ x: this.x, y }),
    },
  })*/

  /** Controls
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

  /** Update DOM
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

  /** Update FPS
  updateFPS(fps: number) {
    global.document.querySelector(".debug [data-control-for='fps']").innerText = `${Math.round(fps)} FPS`
  }*/
}
