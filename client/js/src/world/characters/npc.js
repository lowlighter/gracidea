//Imports
  import Element from "./../element.js"
  import u from "./../../app/utils.js"
  import World from "../world.js"

/** 
 * Character.
 * 
 * Base structure to instantiate characters.
 */
  export default class NPC extends Element {
    //Constructor
      constructor({world}) {
        //Heritage
          super(...arguments)
        //Reference
          this.world = world
      }

    //X coordinate
      _x = 0
      set x(x) { 
        this._x = x 
        if (this.sprite)
          this.sprite.position.x = u.to.coord.px(this.x) + World.Chunk.tile.size/2 
      }
      get x() { return this._x }

    //Y coordinate
      _y = 0
      set y(y) { 
        this._y = y 
        if (this.sprite)
          this.sprite.position.y = u.to.coord.px(this.y) + (this.sprite.height - World.Chunk.tile.size) 
      }
      get y() { return this._y }

    //Update
      update() {}

    //Destroy
      destroy() {
        //Destroy sprite
          if (this.sprite) {
            this.sprite.visible = false
            this.sprite.destroy()
            this.sprite = null
          }
      }
  }