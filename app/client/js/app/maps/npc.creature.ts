//Imports
import type { Area } from "./area.ts";
import { App } from "../app.ts"
import { NPC } from "./npc.ts"

/**
 * NPC (Creature).
 */
export class Creature extends NPC {

  /** Name */
  protected readonly name = "" as string

  /** Constructor */
  constructor({area}:{area:Area}) {
    super({area})
    let random = Math.random()
    for (const name in this.area.encounters) {
      const rate = this.area.encounters[name]
      if (random <= rate) {
        this.name = name
        break
      }
      random -= rate
    }
    this.sprite.alpha = 0
    this.#lifetime = Math.floor(100 + Math.random() * 200)
    this.init({
      frame:`${Math.random() < App.config.creatures.shiny ? "shiny" : "regular"}/${this.name}`,
      random:true
    })
  }

  /** Lifetime */
  #lifetime = Infinity

  /** Update tracker */
  protected get tracker() {
    return this.#lifetime
  }

  /** Perform refresh */
  protected refresh() {
    this.#lifetime--
    if (this.#lifetime <= 0) {
      if (this.sprite.alpha > 0.1)
        this.sprite.alpha *= 0.9
      else
        return this.destructor()
    }
    else if (this.sprite.alpha < 1) {
      this.sprite.alpha = Math.min(1, this.sprite.alpha * 1.2)
      if (!this.sprite.alpha)
        this.sprite.alpha = 0.1
    }
    return super.refresh()
  }

  /** Perform NPC action */
  protected action() {
    this.wander()
  }

}

