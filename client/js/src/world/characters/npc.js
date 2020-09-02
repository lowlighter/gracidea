//Imports
  import Element from "./../element.js"
  import u from "./../../app/utils.js"
  import World from "../world.js"
  import App from "../../app/app.js"

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

    //Textures
      static textures({endpoint = "", key, defaults = null}) {
        //Textures atlas
          const atlas = App.loader.renderer.resources[`${endpoint}/textures.json`].data
        //Animated sprite
          if (atlas.animations[key])
            return atlas.animations[key].map(PIXI.Texture.from)
        //Single frame sprite
          if (`${key}_0` in atlas.frames)
            return [PIXI.Texture.from(`${key}_0`)]
          if (key in atlas.frames)
            return [PIXI.Texture.from(key)]
        //Default texture
          if (defaults in atlas.frames)
            return [PIXI.Texture.from(defaults)]
        return [PIXI.Texture.EMPTY]
      }

  }