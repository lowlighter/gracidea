//Imports
  import World from "./world.js"
  import u from "./../app/utils.js"
  import textures from "./../app/textures.js"

/** 
 * World chunk.
 */
  export default class Chunk {
    //Layers data
      layers = new Map()
    //Constructor
      constructor({world, key}) {
        this.key = key
        this.world = world
        this.sprite = new PIXI.Container()
        this.sprite.name = this.key
        this.world.sprite.addChild(this.sprite)
      }
    //Loader
      async load({layer:{name:layer}, chunk:{x, y, width, height, data}}) {
        //Save data
          this.layers.set(layer, {x, y, width, height, data})
        //Update origin and boundary
          const {origin, boundary} = this.world
          origin.x = Math.min(x, origin.x)
          origin.y = Math.min(y, origin.y)
          boundary.x = Math.max(x, boundary.x)
          boundary.y = Math.max(y, boundary.y)
      }
    //Render
      async render({center, radius, force, animated, cache}) {
        //Render layers
          for (let [layer, {x, y, width, height, data:tiles}] of this.layers.entries()) {
            //Skip if ignored
              if (World.layers.ignored.has(layer))
                continue
            //Retrieve chunk
              const chunk = this.sprite.getChildByName(layer) || this.sprite.addChild(new PIXI.Container())
              chunk.name = layer
              chunk.position.set(u.rc(x), u.rc(y))
            //Skip rendering if too far
              if (u.dist(center, {x, y}) > radius) {
                chunk.removeChildren()
                continue
              }
            //Skip rendering if already rendered
              if ((chunk.children.length)&&(!force))
                continue 
            //Render tiles
              const flags = {}
              chunk.cacheAsBitmap = false
              chunk.alpha = 0
              chunk.removeChildren()
              for (let [index, texture] of tiles.entries()) {
                let x = index%width, y = ~~(index/width), tile = null
                texture--
                if (texture in textures.animated) {
                  tile = chunk.addChild(new PIXI.AnimatedSprite(textures.animated[texture].frames.map(PIXI.Texture.from)))
                  tile.animationSpeed = textures.animated[texture].speed
                  if (animated) {
                    animated.add(tile)
                    flags.animated = true
                  }
                }
                else
                  tile = chunk.addChild(new PIXI.Sprite.from(`${texture}`))
                tile.position.set(u.rc(x), u.rc(y))
                tile.width = tile.height = World.Chunk.tile.size
              }
            //Cache if needed
              if (cache)
                chunk.cacheAsBitmap = true
            //Cache if not animated
              if (!flags.animated)
                chunk.cacheAsBitmap = true
            //Fade
              this.world.app.tween.fade({target:chunk, change:"alpha", from:0, to:1, duration:15})
          }
      }
    //Key
      static key({x, y}) { return `${x};${y}` }
    //Tile variables
      static tile = {size:16}
  }