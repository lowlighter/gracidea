//Imports
import type { friend } from "./types.ts"
import { global } from "./types.ts"
import {deferred} from "https://deno.land/std@0.114.0/async/deferred.ts"
import {Render} from "./rendering/render.ts"
import {World} from "./maps/world.ts"
import {Controller} from "./controls/controller.ts"

/** App */
export class App {

  /** World */
  readonly world!:World

  /** App setup */
  static async setup() {
    this.loaded("loaded /js/app.js", null, {update:true})
    const {x = 5, y = -55} = Object.fromEntries(new URLSearchParams(window.location.search).entries())

    await (Render as friend).setup({app:this})
    const world = new World()
    new Controller({target:world})

    Object.assign(this, {world})

    //
    this.ready.resolve()

    world.camera.place({x:Number(x)||0, y:Number(y)||0})

    this.loaded("waiting for first rendering")
    global.document.querySelector(".loader").remove()
    return App
  }

  /** App ready state */
  static readonly ready = deferred()

  /** Rendering instance */
  static get rendering() {
    return (Render as friend).instance
  }

  /** Print a message to loading console */
  static get loaded() {
    return global.gracidea.loaded as (text:string, type?:string|null, options?:{update?:boolean}) => void
  }

  /** Current commit sha */
  static get sha() {
    return global.gracidea.sha as string
  }

  /** Config */
  static config = {
    style: "rse",
    debug: false,
    creatures:{
      display:true,
      shiny: 1/8
    }
  }
}
