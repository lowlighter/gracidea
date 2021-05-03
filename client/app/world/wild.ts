//Imports
 /* import { Render } from "../render/render.ts"
  import { Renderable } from "./renderable.ts"
  import { Area } from "./area.ts"
  import { CHUNK_SIZE } from "../render/settings.ts"
  import type { World } from "./world.ts"
  import { App } from "./../app.ts"


  export class Wild extends Area {


     //Spawn a new creature
     spawn() {
      //Add creature if possible
        if (this.creatures.size < this.spawns.max.creatures) {
          //Generate a species
            let species = null
            const r = u.rand()
            for (let p in this.species) {
              const [a, b] = p.split("-").map(Number)
              if ((a < r)&&(r < b)) {
                species = this.species[p]
                break
              }
            }
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
        }
    }


  }*/