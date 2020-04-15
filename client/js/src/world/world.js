//Imports
  import App from "./../app/app.js"
  import u from "./../app/utils.js"
  import Chunk from "./chunk.js"
  import Sea from "./sea.js"
  import Area from "./areas/area.js"
  import Quadtree from "./../structs/quadtree.js"
  import Element from "./element.js"
  import Creature from "./characters/creature.js"
  import Wild from "./areas/wild.js"

/** 
 * World.
 * 
 * This class is the main renderer for the world.
 * It handles chunks data and rendering, instantiated characters and world data.
 */
  export default class World extends Element {

    //World chunks reference
      chunks = new Map()

    //World data reference
      areas = new Map()

    //Quadtrees reference
      qt = {
        //Chunks quadtree
          chunks:new Quadtree({max:{items:128, depth:64}}),
        //Areas quadtree
          areas:new Quadtree({max:{items:128, depth:64}}),
      }

    //Cache
      cache = {
        //Last ticked valued
          ticked:-Infinity,
        //Has been rendered once
          rendered:new Promise(solve => this._rendered = solve),
      }

    //Constructor
      constructor({app, name}) {
        //Heritage
          super(...arguments)
        //References
          this.name = this.key = name
          this.app = app
        //Sprite creation
          this.sprite = new PIXI.Container()
          this.sprite.name = this.name
          this.app.viewport.addChild(this.sprite)
        //Layers creation
          this.layers = {
            global:{
              sea:this.sprite.addChild(new PIXI.Container()),
              world:this.sprite.addChild(new PIXI.Container()),
              characters:this.sprite.addChild(new PIXI.Container()),
              areas:this.sprite.addChild(new PIXI.Container()),
            }
          }
          this.layers.global.characters.visible = false
        //Update static values
          Area.Wild = Wild
      }

    //Loaders
      load = {
        //Load world
          world:async () => {
            //Load creatures textures
              App.loader.renderer.add(`/maps/creatures/textures.json`)
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
                        await u.mget({map:this.areas, key:object.name||World.Area.uid++, create:key => World.Area.from({world:this, key, object})}).load({object})
                      break
                    }
                }
            //Update world boundaries
              this.app.viewport.left = u.to.coord.px(this.origin.x)
              this.app.viewport.top = u.to.coord.px(this.origin.y)
              this.app.viewport.worldWidth = u.to.coord.px(this.width)
              this.app.viewport.worldHeight = u.to.coord.px(this.height)
            //Update maps locations
              this.app.data.maps = (await axios.get(`/maps/${this.name}/locations.json`)).data
            //Update quadtrees
              this.qt.chunks.resize({...this.origin, width:this.width, height:this.height}).clear()
              this.chunks.forEach(chunk => this.qt.chunks.add(chunk))
              this.qt.areas.resize({...this.origin, width:this.width, height:this.height}).clear()
              this.areas.forEach(area => this.qt.areas.add(area))
            //Update sprite position and create sprite
              this.sprite.position.set(u.to.coord.px(-this.origin.x), u.to.coord.px(-this.origin.y))
          },
        //Load sea
          sea:async () => {
            //Create sea
              this.sea = new World.Sea({world:this})
          }
      }

    //Create entities
      add = {
        //Add creature
          creature:({species, x, y, area}) => new Creature({world:this, x, y, area, species})
      }

    //Render world
      async render({center = this.app.data.user.position, delay = 100, radius = "auto", offset  = this.origin, force = false} = {}) {
        //Delay rendering
          clearTimeout(this._render)
          this._render = setTimeout(async () => {
            //Compute radius
              if (radius === "auto")
                radius = Math.ceil(1.5 * Math.max(u.to.coord.tile(this.app.renderer.view.height), u.to.coord.tile(this.app.renderer.view.width)))
            //Apply offset
              if (offset)
                center = {x:center.x + offset.x, y:center.y + offset.y}
            //Prepare rendering
              const renderable = this.qt.chunks.get({x:center.x-radius, y:center.y-radius, width:2*radius, height:2*radius})
              const animated = new Set()
              const renders = []
              //Clear rendered chunks and character layers
                const rendered = [...this.layers.global.world.children]
                this.layers.global.world.removeChildren()
              //Render chunks
                for (let chunk of renderable)
                  renders.push(chunk.render({force, animated, fade:delay && !rendered.includes(chunk.sprite)}))
            //Play animated tiles after rendering
              await Promise.all(renders)
              animated.forEach(tile => (tile.play(), tile.parent.cacheAsBitmap = false))
            //Refresh world sea position 
              this.sea.refresh(this.app.data.user.position)
            //Display characters layer
              this.layers.global.characters.visible = true
            //Update parameters
              this.app.params.get.update({x:this.app.data.user.position.x, y:this.app.data.user.position.y})
            //Update cache rendered value
              if (this.cache.rendered !== true)
                (this._rendered(), this.cache.rendered = true)
          }, delay)
      }

    //Set camera position
      camera({x, y, offset = this.origin}) {
        this.app.viewport.moveCenter({x:u.to.coord.px(x-offset.x), y:u.to.coord.px(y-offset.y)})
        this.app.methods.update()
        this.render()
      }

    //Start
      start() {
        //Ticker
          this.app.renderer.ticker.add(() => this.ticker())
      }

    //Ticker for world
      ticker(dt) {
        //Update each second
          if (App.time - this.cache.ticked > 1000) {
            //Prepare update
              const center = this.app.data.user.position
              const radius = Math.max(u.to.coord.tile(this.app.renderer.view.height), u.to.coord.tile(this.app.renderer.view.width))
            //Update areas
              const areas = this.qt.areas.get({x:center.x-radius, y:center.y-radius, width:2*radius, height:2*radius})
              areas.forEach(area => area.update({center, radius}))
            //Update last ticked time
              this.cache.ticked = App.time
          }
      }

    //Layers options
      static layers = {
        ignored:new Set(["00-boundaries"])
      }

    //Chunk class reference
      static Chunk = Chunk

    //Sea class reference
      static Sea = Sea
      
    //Area class reference
      static Area = Area

  }