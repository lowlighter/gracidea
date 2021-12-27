//Imports
import { App } from "../app.ts"
import { Render } from "../rendering/render.ts"
import { Renderable } from "./../rendering/renderable.ts"
import type { Section } from "./section.ts"
import { Controller } from "../controls/controller.ts"
import { NPC } from "./npc.ts";
import { Creature } from "./npc.creature.ts";
import { Human } from "./npc.human.ts";

import type { Graphics } from "./../rendering/render.ts"

/**
 * Section area.
 * It is used to display characters, creatures and others areas within a map section.
 */
export class Area extends Renderable {

  /** Section */
  readonly section: Section

  /** Data */
  readonly data: Data

  /** Polygon */
  readonly polygon: ReturnType<typeof Render.Polygon>

  /** Loaded NPCs */
  readonly npcs = new Set<NPC>()

  /** Constructor */
  constructor({ section, data }: {section:Section, data: Data; }) {
    super({id:data.name})
    this.section = section
    this.data = data
    this.polygon = Render.Polygon(this.data.points)
    this.section.debug.addChild(this.debug)
  }

  /** Destructor */
  destructor() {
    this.section.areas.delete(this)
    this.npcs.forEach(npc => npc.destructor())
    return super.destructor()
  }

  /** Test if point is contained within area */
  contains({ x, y }: { x: number; y: number }) {
    return this.polygon.contains(x * 16, y * 16)
  }

  get encounters() {
    return this.section.data.encounters?.[this.id] as { [name: string]: number } ?? null
  }

  /** Update renderable */
  async update({debug = this.debug.visible, t, dt}:{t:number, dt:number, debug?:boolean}) {

    if (this.data.type === "creatures") {
      if ((App.config.creatures.display) && (this.npcs.size < 1 /*+ Number(this.data.properties.size)/10*/)) {
        if (this.encounters)
          this.npcs.add(new Creature({ area: this}))
      }
    }
    if (this.data.type === "people") {
      if (this.npcs.size < 1)
      this.npcs.add(new Human({ area: this}))
    }



    if ((debug)&&(this.dirty)) {
      this.debug.bounds.removeChildren()
      this.debug.bounds.addChild(Render.Graphics({
        text: `${this.id}`,
        polygon:this.polygon,
        ...Renderable.debug,
        ...(this.constructor as typeof Renderable).debug,
        textPosition: { x: this.polygon.points[0]/16, y: this.polygon.points[1]/16 },
        ...(this.contains(Controller.instance.cursor) ? {stroke:[3, 0xFFFFFF, .5]} : {})
      }))
    }
    return super.update({t, dt, debug:false})
  }

  /** Debug graphics properties */
  protected static debug = {
    stroke:[1, 0x85144B, .5],
    fill:[0x85144B, .125],
    textStyle: { align: "center", fontSize: 10, fill: "#85144B", fontFamily: "monospace" },
  } as Partial<Graphics>

  /*static creatures = class extends Area {


    constructor() {

      //this.npcs.add(new NPC({area:this}))
    }

  }*/

  /** Update area
  update(_tick: number) {
    if (this.data.name) {
      switch (this.data.type) {
        //People
        case Type.people: {
          if ((App.config.showNpcs) && (!this.npcs.size))
            this.npcs.add(new NPC({ world: this.world, area: this, type: this.data.type, name: this.data.name, pattern: this.data.properties.pattern as Pattern }))
          break
        }
        //Creatures
        case Type.creatures: {
          if ((App.config.showCreatures) && (this.npcs.size < 1 + Math.floor(Number(this.data.properties.size) / 20))) {
            if (this.data.properties.encounters) {
              const encounters = this.data.properties.encounters as { [key: string]: number }
              const random = Math.random()
              let weight = 0
              for (const species in encounters) {
                if (random <= weight + encounters[species]) {
                  this.npcs.add(new NPC({ world: this.world, area: this, type: this.data.type, name: species }))
                  break
                }
                weight += encounters[species]
              }
            }
          }
          break
        }
      }
    }
    this.npcs.forEach(npc => npc.update(this.world.tick))
  }
*/
}

/** Types */
export const enum Type {
  people = "people",
  creatures = "creatures",
  regions = "regions",
  locations = "locations",
}

/** Area data */
export type Data = {
  id: number
  name: string
  type: Type
  points: number[]
  properties: { [key: string]: unknown }
}
