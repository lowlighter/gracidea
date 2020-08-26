//Imports
  import Area from "./area.js"

/**
 * World trainer area.
 */
  export default class Trainer extends Area {

    //Create
      create() {
        //Instantiate trainer
          if (!this.trainer) {
            const {categorie} = this.properties
            this.trainer = this.world.add.trainer({categorie, x:this.area.tiled[0][0], y:this.area.tiled[0][1], area:this})
          }
      }

    //Update
      async update() {
        //Heritage
          await super.update(...arguments)
        //Update trainer
          this.trainer.update()
      }

    //Reset
      reset() {
        //Heritage
          super.reset()
        //Clear instantiated trainer
          if (this.trainer)
            this.trainer.destroy()
          this.trainer = null
      }

    //Debug
      static debug = {
        //Debug color
          color:0xFF0000,
        //Debug opacity
          opacity:.25,
      }

  }
