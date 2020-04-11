//Imports
  import World from "./world.js"
  import u from "./../app/utils.js"
  import textures from "./../app/textures.js"

/** 
 * World chunk.
 * 
 * This class allows to split the world into smaller chunks for improved rendering.
 * Chunk are also divided internally into layers.
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
        //Save layer data
          this.layers.set(layer, {x, y, width, height, data})
        //Update world origin and boundary
          const {origin, boundary} = this.world
          u.sync({a:origin, b:{x:Math.min(x, origin.x), y:Math.min(y, origin.y)}})
          u.sync({a:boundary, b:{x:Math.max(x, boundary.x), y:Math.max(y, boundary.y)}})
      }
    //Render
      async render({center, radius, force, animated, cache}) {
        //Render layers
          for (let [layer, {x, y, width, height, data:tiles}] of this.layers.entries()) {
            //Skip if ignored layer
              if (World.layers.ignored.has(layer))
                continue
            //Retrieve chunk sprite
              const chunk = this.sprite.getChildByName(layer) || this.sprite.addChild(new PIXI.Container())
              chunk.name = layer
              chunk.position.set(u.to.coord.px(x), u.to.coord.px(y))
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
                //Skip if unknown texture
                  let tile = null
                  if (--texture < 0)
                    continue
                //Animated texture
                  if (texture in textures.animated) {
                    tile = chunk.addChild(new PIXI.AnimatedSprite(textures.animated[texture].frames.map(PIXI.Texture.from)))
                    tile.animationSpeed = textures.animated[texture].speed
                    if (animated) {
                      animated.add(tile)
                      flags.animated = true
                    }
                  }
                //Static texture
                  else
                    tile = chunk.addChild(new PIXI.Sprite.from(`${texture}`))
                //Set position and size
                  tile.position.set(u.to.coord.px(index%width), u.to.coord.px(~~(index/width)))
                  tile.width = tile.height = World.Chunk.tile.size
              }
            //Cache sprite if needed
              if (cache)
                chunk.cacheAsBitmap = true
            //Cache sprite if not animated
              if (!flags.animated)
                chunk.cacheAsBitmap = true
            //Fading
              this.world.app.tween.fade({target:chunk, change:"alpha", from:0, to:1, duration:15})
          }
      }
    //Key
      static key({x, y}) { return `${x};${y}` }
    //Tile properties
      static tile = {size:16}
  }