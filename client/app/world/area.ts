//Imports
  import { Render } from "../render/render.ts"
  import { Renderable } from "./renderable.ts"
  import { TILE_SIZE } from "../render/settings.ts"
  import type { World } from "./world.ts"
  import type { Chunk } from "./chunk.ts"
  import { App } from "../app.ts"
  import { NPC } from "./npc.ts"

/** Area data */
  export type AreaData = {
    id:number
    name:string
    type:Type,
    points:number[]
    properties:{[key:string]:unknown}
  }

/** Types */
  export const enum Type {
    people = "people",
    creatures = "creatures",
    regions = "regions",
    locations = "locations",
  }

/**
 * World area.
 * Define a world area, which can be used to define zones, locations, etc.
 */
  export class Area extends Renderable {

    /** Identifier */
      readonly id:string

    /** Sprite */
      readonly sprite:ReturnType<typeof Render.Container>

    /** Data */
      readonly data:AreaData

    /** Polygon */
      readonly polygon:ReturnType<typeof Render.Polygon>

    /** NPCs */
      readonly npcs = new Set<NPC>()

    /** Constructor */
      constructor({id, data, world}:{id:string, data:AreaData, world:World}) {
        super({world})
        this.id = id
        this.data = data
        this.polygon = Render.Polygon(this.data.points)
        this.sprite = Render.Container()
        if (App.debug.logs)
          console.debug(`loaded area: ${this.id} (${this.data.name})`)
      }

    /** Test if point is within area */
      contains({x, y}:{x:number, y:number}) {
        return this.polygon.contains(x*TILE_SIZE, y*TILE_SIZE)
      }

    /** Debug sprite */
      debug() {
        if (!this._debug)
          this._debug = this.world.sprites.debug.addChild(Render.Graphics({text:`${this.data.name ?? ""}\n(${this.data.type}#${this.id})`.trim(), textStyle:{align:"center", fontSize:10, fill:"white"}, textPosition:{x:this.polygon.points[0], y:this.polygon.points[1]}, stroke:[1, 0x00FF00, .5], fill:[0x00FF00, .25], polygon:this.polygon}))
        if ((this._debug)&&(App.debug.areas))
          this._debug.tint = this.contains(this.world.camera) ? 0xFFFFFF : 0xFF00FF
        return super.debug(App.debug.areas)
      }

    /** Update area */
      update(tick:number) {
        if (this.data.name) {
          switch (this.data.type) {
            //People
            case Type.people:{
              if ((App.config.showNpcs)&&(!this.npcs.size))
                this.npcs.add(new NPC({world:this.world, area:this, type:this.data.type, name:this.data.name}))
              break
            }
            //Creatures
            case Type.creatures:{
              if ((App.config.showCreatures)&&(this.npcs.size < 1+Math.floor(Number(this.data.properties.size)/20))) {
                if (this.data.properties.encounters) {
                  const encounters = this.data.properties.encounters as {[key:string]:number}
                  const random = Math.random()
                  let weight = 0
                  for (const species in encounters) {
                    if (random <= weight + encounters[species]) {
                      this.npcs.add(new NPC({world:this.world, area:this, type:this.data.type, name:species}))
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

    /** Destructor */
      destructor() {
        if (App.debug.logs)
          console.debug(`unloaded loaded area: ${this.id}`)
        this.npcs.forEach(npc => npc.destructor())
        this.npcs.clear()
        return super.destructor()
      }

    /** Render */
      render() {

      }

    /** Create new area from chunk */
      static from({data, chunk}:{data:AreaData, chunk:Chunk}) {
        const id = `${data.id}`
        if (!chunk.world.loaded.areas.has(id))
          chunk.world.loaded.areas.set(id, new Area({id, data, world:chunk.world}))
        const area = chunk.world.loaded.areas.get(id) as Area
        chunk.areas.add(area)
        return area
      }

  }