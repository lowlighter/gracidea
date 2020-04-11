//Imports
  import App from "./../app/app.js"
  import u from "./../app/utils.js"
  import Chunk from "./chunk.js"
  import Sea from "./sea.js"
  import Data from "./data.js"

/** 
 * World.
 * 
 * This class is the main renderer for the world.
 * It handles chunks data and rendering, instantiated characters and world data.
 */
  export default class World {
    //Origin point (top-left tile)
      origin = {x:Infinity, y:Infinity}
    //Boundary point (bottom-right)
      boundary = {x:-Infinity, y:-Infinity}
    //World chunks
      chunks = new Map()
    //World data
      data = new Map()
    //World instancied creatures
      creatures = new Set()
    //Constructor
      constructor({app, name}) {
        this.name = name
        this.sprite = new PIXI.Container()
        this.sprite.name = this.name
        this.app = app
        this.app.viewport.addChild(this.sprite)
      }
    //Loaders
      load = {
        //Load world
          world:async () => {
            //Load map data
              const {layers, tilesets} = (await axios.get(`/maps/${this.name}/map.json`)).data
            //Load map tilesets
              for (let tileset of tilesets) 
                App.loader.renderer.add(`/maps/${this.name}/${u.basename({path:tileset.source, extension:false})}.textures.json`)
            //Load map layers
              for (let layer of layers)
                switch (layer.type) {
                  //Tile layer
                    case "tilelayer":{
                      for (let chunk of layer.chunks) 
                        await u.mget({map:this.chunks, key:World.Chunk.key(chunk), create:key => new World.Chunk({world:this, key})}).load({layer, chunk})
                      break
                    }
                  //Object group
                    case "objectgroup":{
                      for (let object of layer.objects)
                        await u.mget({map:this.data, key:object.name, create:key => new World.Data({world:this, key, object})})
                      break
                    }
                }      
            //Update world boundaries
              this.app.viewport.left = u.to.coord.px(this.origin.x)
              this.app.viewport.top = u.to.coord.px(this.origin.y)
              this.app.viewport.worldWidth = u.to.coord.px(Math.abs(this.boundary.x - this.origin.x))
              this.app.viewport.worldHeight = u.to.coord.px(Math.abs(this.boundary.y - this.origin.y))
            //Update sprite position and create sprite
              this.sprite.position.set(u.to.coord.px(-this.origin.x), u.to.coord.px(-this.origin.y))
              this.sprite.data = this.sprite.addChild(new PIXI.Container())
            //Update maps locations
              this.app.data.maps = (await axios.get(`/maps/${this.name}/locations.json`)).data
          },
        //Load sea
          sea:async () => {
            //Create sea
              this.sea = new World.Sea({world:this})
              this.sprite.addChildAt(this.sea.sprite, 0)
          }
      }
    //Create units
      add = {
        //Add creature
          creature() {
            const creature = new Creature({species:"mudkip"}) 
            this.creatures.add(creature)
            this.sprite.addChild(creature.sprite)
          }
      }
    //Render world
      async render({center = this.app.data.user.position, delay = 100, radius = "auto", offset  = this.origin, force = false, data = true} = {}) {
        //Delay rendering
          clearTimeout(this._render)
          this._render = setTimeout(async () => {
            //Compute radius
              if (radius === "auto")
                radius = Math.ceil(1.5 * Math.max(u.to.coord.tile(this.app.renderer.view.height), u.to.coord.tile(this.app.renderer.view.width)))
            //Apply offset
              if (offset)
                center = {x:center.x + offset.x, y:center.y + offset.y}
            //Render chunks
              const animated = new Set()
              const renders = []
              for (let chunk of this.chunks.values())
                renders.push(chunk.render({center, radius, force, animated}))
            //Render data if needed
              if (data)
                renders.push(...[...this.data.values()].map(value => value.render()))
            //Play animated tiles after rendering
              await Promise.all(renders)
              animated.forEach(tile => (tile.play(), tile.parent.cacheAsBitmap = false))

            //Update parameters
              this.app.params.get.update({x:this.app.data.user.position.x, y:this.app.data.user.position.y})
          }, delay)
          this.sea.refresh(this.app.data.user.position)
      }
    //Set camera position
      camera({x, y, offset = this.origin}) {
        this.app.viewport.moveCenter({x:u.to.coord.px(x-offset.x), y:u.to.coord.px(y-offset.y)})
        this.app.methods.update()
        this.render()
      }
    //Layers options
      static layers = {
        ignored:new Set(["00-boundaries"])
      }
    //Chunk class reference
      static Chunk = Chunk
    //Sea class reference
      static Sea = Sea
    //Data class reference
      static Data = Data
  }