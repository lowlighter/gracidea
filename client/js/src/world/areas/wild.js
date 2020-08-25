//Imports
  import Area from "./area.js"
  import u from "../../app/utils.js"

/**
 * World wild area.
 */
  export default class Wild extends Area {

    //World instancied creatures reference
      creatures = new Set()

    //Species in wild area (associated to spawn probability)
      species = {}

    //Constructor
      constructor() {
        //Heritage
          super(...arguments)
      }

    //Load
      async load() {
        //Heritage
          await super.load(...arguments)
        //Load species probabilities
          const species = Object.keys(this.properties).filter(property => Wild.species.property.test(property))
          let p = 0
          for (let name of species) {
            const dp = this.properties[name]
            this.species[`${p}-${p+dp}`] = name.replace(Wild.species.property, "")
            p += dp
          }
        //Spawn parameters
          this.spawns = {
            max:{creatures:Math.ceil(this.properties.max_creatures||Math.max(1, 0.5*Math.log2(this.area.size)-1))},
            probability:0.1
          }
      }

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

    //Create
      create() {
        //Create creatures
          for (let i = 0; i < this.creatures.size; i++)
            if (u.rand() < this.spawns.probability)
              this.spawn()
      }

    //Update
      async update() {
        //Heritage
          await super.update(...arguments)
        //Add creature if possible
          if ((this.creatures.size < this.spawns.max.creatures)&&(u.rand() < this.spawns.probability))
            this.spawn()
        //Wander
          this.creatures.forEach(creature => creature.update())
      }

    //Reset
      reset() {
        //Heritage
          super.reset()
        //Clear instantiated creatures
          this.creatures.forEach(creature => creature.destroy())
          this.creatures.clear()
      }

    //Area is water
      get water() { return this.properties.water }

    //Species variable
      static species = {
        //Property associated to species
          property:/^pk_/
      }

    //Debug
      static debug = {
        //Debug color
          color:0x00FF00,
        //Debug opacity
          opacity:.5,
      }

  }
