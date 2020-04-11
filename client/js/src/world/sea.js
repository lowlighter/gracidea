//Imports
  import World from "./world.js"
  import textures from "./../app/textures.js"

/** 
 * World sea.
 */
  export default class Sea {
    //Constructor
      constructor({world}) {
        this.world = world
        this.sprite = new PIXI.Sprite()
        this.render({delay:0})
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
              const width = Math.ceil(this.world.app.renderer.view.width/World.Chunk.tile.size)
              const height = Math.ceil(this.world.app.renderer.view.height/World.Chunk.tile.size)
            //Render sea tiles
              const texture = textures.animated[`${World.Sea.texture}`]
              for (let x = -width; x <= width; x++) {
                for (let y = -height; y <= height; y++) {
                  const tile = this.sprite.addChild(new PIXI.AnimatedSprite(texture.frames.map(PIXI.Texture.from)))
                  tile.animationSpeed = texture.speed
                  tile.position.set(x * World.Chunk.tile.size, y * World.Chunk.tile.size)
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
        this.sprite.position.set((origin.x + x) * World.Chunk.tile.size, (origin.y + y) * World.Chunk.tile.size)
        this.world.app.tween.fade({target:this.sprite, change:"alpha", from:0, to:1, duration:15})
      }
    //Texture
      static texture = 2374
  }