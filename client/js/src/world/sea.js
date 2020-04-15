//Imports
  import World from "./world.js"
  import textures from "./../app/textures.js"
  import u from "./../app/utils.js"

/** 
 * World sea.
 * 
 * This is a special chunk which contains animated tiles of water.
 * It is rendered once and for all and moved each time camera is moved.
 */
  export default class Sea {

    //Constructor
      constructor({world}) {
        //References
          this.world = world
        //Sprite creation
          this.sprite = new PIXI.Sprite()
          this.render({delay:0})
          this.world.layers.global.sea.addChild(this.sprite)
      }

    //Render
      async render({delay = 250} = {}) {
        //Delay rendering
          clearTimeout(this._render)
          this._render = setTimeout(async () => {
            //Clean sprite
              this.sprite.removeChildren()
              this.sprite.anchor.set(0.5)
            //Compute size
              const width = u.to.coord.tile(this.world.app.renderer.view.width)
              const height = u.to.coord.tile(this.world.app.renderer.view.height)
            //Render sea tiles
              const texture = textures.animated[`${World.Sea.texture}`]
              for (let x = -width; x <= width; x++) {
                for (let y = -height; y <= height; y++) {
                  const tile = this.sprite.addChild(new PIXI.AnimatedSprite(texture.frames.map(PIXI.Texture.from)))
                  tile.animationSpeed = texture.speed
                  tile.position.set(u.to.coord.px(x), u.to.coord.px(y))
                  tile.width = tile.height = World.Chunk.tile.size
                  tile.play()
                }
              }
          }, delay)
      }

    //Refresh sea
      refresh({x, y}) {
        const {origin} = this.world
        this.sprite.alpha = 0
        this.sprite.position.set(u.to.coord.px(origin.x + x), u.to.coord.px(origin.y + y))
        this.world.app.tween.fade({target:this.sprite, change:"alpha", from:0, to:1, duration:16})
      }

    //Texture
      static texture = 2374
  }