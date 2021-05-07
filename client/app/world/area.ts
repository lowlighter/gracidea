//Imports
  import { Render } from "../render/render.ts"
  import { Renderable } from "./renderable.ts"
  import { TILE_SIZE } from "../render/settings.ts"
  import type { World } from "./world.ts"
  import type { Chunk } from "./chunk.ts"
  import { App } from "../app.ts"
  import { NPC, Type } from "./npc.ts"

/** Area data */
  export type AreaData = {
    id:number
    name:string
    type:Type,
    points:number[]
    properties:{[key:string]:unknown}
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

    /** Render */
      render() {
        if (!this.data.name)
          return

        switch (this.data.type) {
          case Type.people:{
            break
            new NPC({world:this.world, area:this, type:this.data.type, frame:this.data.name}).show()
            break
          }
          case Type.creatures:{
            console.log("creatures!!!")
            setTimeout(() => this.spawn(), 1000)
            setTimeout(() => this.spawn(), 1000)
            setTimeout(() => this.spawn(), 1000)
            break
          }
        }
      }

    /** Destructor */
      destructor() {
        if (App.debug.logs)
          console.debug(`unloaded loaded area: ${this.id}`)
        this.npcs.forEach(npc => npc.destructor())
        this.npcs.clear()
        return super.destructor()
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



    //
      spawn() {


        if (this.data.properties.encounters) {
          const encounters = this.data.properties.encounters as {[key:string]:number}
          const random = Math.random()
          let weight = 0
          for (const species in encounters) {
            if (random <= weight + encounters[species]) {
              new NPC({world:this.world, area:this, type:this.data.type, frame:`regular/${species}`}).show()
              break
            }
            weight += encounters[species]
          }
        }




         //

        /*
        //Add creature if possible
          if (this.creatures.size < this.spawns.max.creatures) {
            //Generate spawn point (random point inside polygon)
              let [x, y] = [NaN, NaN]
              for (let i = 0; i < 128; i++, x = u.rand({a:this.origin.x, b:this.boundary.x, int:true}), y = u.rand({a:this.origin.y, b:this.boundary.y, int:true}))
                if (this.inside({x, y}))
                  break
                else
                  [x, y] = [NaN, NaN]
            //Create creature
              if ((species)&&(Number.isFinite(x))&&(Number.isFinite(y))) {
                const creature = this.world.add.creature({species, x, y, area:this})
                this.creatures.add(creature)
              }
          }*/
      }




  }