//Imports
  import App from "./../app/app.js"
  import u from "./../app/utils.js"
  import Chunk from "./chunk.js"
  import Sea from "./sea.js"

/** 
 * World.
 */
  export default class World {
    //Origin point (top-left tile)
      origin = {x:Infinity, y:Infinity}
    //Boundary point (bottom-right)
      boundary = {x:-Infinity, y:-Infinity}
    //Chunks
      chunks = new Map()
    //Instancied creatures
      creatures = new Set()
    //Constructor
      constructor({app, name}) {
        this.name = name
        this.sprite = new PIXI.Container()
        this.sprite.name = this.name
        this.app = app
        this.app.viewport.addChild(this.sprite)
      }
    //Loader
      load = {
        //Load world
          world:async () => {
            //Load data
              const {layers, tilesets} = (await axios.get(`/maps/${this.name}/map.json`)).data
            //Load tilesets
              for (let tileset of tilesets) 
                App.loader.renderer.add(`/maps/${this.name}/${u.basename({path:tileset.source, extension:false})}.textures.json`)
            //Load layers
              for (let layer of layers) 
                for (let chunk of layer.chunks) 
                  await u.mget({map:this.chunks, key:World.Chunk.key(chunk), create:key => new World.Chunk({world:this, key})}).load({layer, chunk})
            //Update world boundaries
              this.app.viewport.left = this.origin.x * World.Chunk.tile.size
              this.app.viewport.top = this.origin.y * World.Chunk.tile.size
              this.app.viewport.worldWidth = Math.abs(this.boundary.x - this.origin.x) * World.Chunk.tile.size
              this.app.viewport.worldHeight = Math.abs(this.boundary.y - this.origin.y) * World.Chunk.tile.size
            //Update sprite position
              this.sprite.position.set(-this.origin.x*World.Chunk.tile.size, -this.origin.y*World.Chunk.tile.size)
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
            this.pokemons.add(creature)
            this.sprite.addChild(creature.sprite)
          }
      }
    //Render chunks
      async render({center = this.app.data.user.position, delay = 100, radius = "auto", offset  = this.origin, force = false} = {}) {
        //Delay rendering
          clearTimeout(this._render)
          this._render = setTimeout(async () => {
            //Compute radius
              if (radius === "auto")
                radius = Math.ceil(1.5 * Math.max(this.app.renderer.view.height/World.Chunk.tile.size, this.app.renderer.view.width/World.Chunk.tile.size))
            //Apply offset
              if (offset)
                center = {x:center.x + offset.x, y:center.y + offset.y}
            //Render
              const animated = new Set()
              const renders = []
              for (let chunk of this.chunks.values())
                renders.push(chunk.render({center, radius, force, animated}))
            //Play animated tiles after rendering
              await Promise.all(renders)
              animated.forEach(tile => (tile.play(), tile.parent.cacheAsBitmap = false))
            //Update parameters
              this.app.GET.set("x", this.app.data.user.position.x)
              this.app.GET.set("y", this.app.data.user.position.y)
              window.history.pushState("", "", `/?${this.app.GET.toString()}`)
          }, delay)
          this.sea.refresh(this.app.data.user.position)
      }
    //Set camera position
      camera({x, y, offset = this.origin}) {
        this.app.viewport.moveCenter({x:(x-offset.x)*World.Chunk.tile.size, y:(y-offset.y)*World.Chunk.tile.size})
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
  }