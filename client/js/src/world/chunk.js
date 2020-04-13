//Imports
  import World from "./world.js"
  import u from "./../app/utils.js"
  import textures from "./../app/textures.js"
  import Element from "./element.js"

/** 
 * World chunk.
 * 
 * This class allows to split the world into smaller chunks for improved rendering.
 * Chunk are also divided internally into layers.
 */
  export default class Chunk extends Element {

    //Layers reference (contains {x, y, width, height, data} of each loaded layer)
      layers = new Map()

    //Constructor
      constructor({world, key}) {
        //Heritage
          super(...arguments)
        //References
          this.key = key
          this.world = world
        //Sprite creation
          this.sprite = new PIXI.Container()
          this.sprite.name = this.key
      }

    //Load a chunk layer 
      async load({layer:{name:layer}, chunk:{x, y, width, height, data}}) {
        //Save layer data
          this.layers.set(layer, {x, y, width, height, data})
        //Update chunk origin and boundary
          this.origin = {x:Math.min(x, this.origin.x), y:Math.min(y, this.origin.y)}
          this.boundary = {x:Math.max(x, this.boundary.x), y:Math.max(y, this.boundary.y)}
        //Update world origin and boundary
          const {origin, boundary} = this.world
          u.sync({a:origin, b:{x:Math.min(this.origin.x, origin.x), y:Math.min(this.origin.y, origin.y)}})
          u.sync({a:boundary, b:{x:Math.max(this.boundary.x, boundary.x), y:Math.max(this.boundary.y, boundary.y)}})
      }

    //Render chunk
      async render({force, animated, cache, fade}) {
        //Global flags
          const flags = {rendered:false}
        //Render layers
          for (let [layer, {x, y, width, height, data:tiles}] of this.layers.entries()) {
            //Skip if ignored layer
              if (World.layers.ignored.has(layer))
                continue
            //Retrieve chunk sprite
              const chunk = this.sprite.getChildByName(layer) || this.sprite.addChild(new PIXI.Container())
              chunk.name = layer
              chunk.position.set(u.to.coord.px(x), u.to.coord.px(y))
            //Skip rendering if already rendered
              if ((chunk.children.length)&&(!force)) {
                flags.rendered = true
                continue
              }
            //Render tiles
              flags.rendered = true
              flags.local = {}
              chunk.cacheAsBitmap = false
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
                      flags.local.animated = true
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
              if (!flags.local.animated)
                chunk.cacheAsBitmap = true
          }
        //Additional processing if chunk has been rendered
          if (flags.rendered) {
            //Fade if needed
              if (fade)
                this.world.app.tween.fade({target:this.sprite, from:0, to:1, duration:15})
            //Add sprite
              this.world.layers.global.world.addChild(this.sprite)
          }
      }

    //Chunk key generator
      static key({x, y}) { return `${x};${y}` }

    //Tile general properties
      static tile = {size:16}
  }