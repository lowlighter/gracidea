/**
 * Copyright 2017, Lecoq Simon (@lowlighter)
 * @license https://github.com/lowlighter/gracidea/blob/master/LICENSE
 */

;(async function () {
  
  //Animated textures
    const textures = {
      animated:{
        2374:{
          frames:[2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381].map(frame => `${frame}`),
          speed:0.075,
        },
        429:{
          frames:[429, 430].map(frame => `${frame}`),
          speed:0.05,
        }
      }
    }

  //Pixi Settings
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
    PIXI.settings.MIPMAP_TEXTURES =  PIXI.MIPMAP_MODES.OFF
  //Get params
    const GET = new URLSearchParams(window.location.search)

  //Utilitaries
    const u = {
      //Basename
        basename({path, extension}) { return path.substring(1+path.lastIndexOf("/")).replace(/(\..+?)$/, extension ? "$1" : "") },
      //Map get or set
        mget({map, key, create}) { return (!map.has(key) && map.set(key, create(key))), map.get(key) },
      //Render coordinates
        rc(c) { return c*World.Chunk.tile.size },
      //Compute distance between two points
        dist(a, b) { return Math.sqrt((b.x - a.x)**2 + (b.y - a.y)**2) },
    }

  //Application
    class App {
      //App is ready
        ready = new Promise(solve => null)
      //Data
        data = {
          user:{
            position:{x:0, y:0}
          },
          maps:[],
          show:{
            map:false
          },
          lang:{},
          ready:false
        }
      //Methods
        methods = {
          //Move camera
            camera:({x, y, offset}) => this.world.camera({x, y, offset}),
          //Update user position
            update:() => this.data.user.position = {x:~~(this.view.center.x/World.Chunk.tile.size), y:~~(this.view.center.y/World.Chunk.tile.size)},
          //Render world
            render:() => this.world.render(),
          //Redirect
            redirect:(url) => window.location.replace(url)
        }
      //Renderer
        renderer = new PIXI.Application({width:document.body.clientWidth, height:document.body.clientHeight, transparent:true, resizeTo:window, antialias:true})
      //Viewport
        viewport = new Viewport.Viewport({screenWidth: window.innerWidth, screenHeight: window.innerHeight, interaction:this.renderer.renderer.plugins.interaction})
      //Controller
        controller = new Vue({
          //Selector
            el:"#app", 
          //Data and methods
            data:this.data, methods:this.methods,
          //Mounted callback
            mounted:() => document.querySelector("#app .view").appendChild(this.renderer.view),
        })
      //View
        view = this.renderer.stage.addChild(this.viewport)
      //Loaders
        static loader = {renderer:PIXI.Loader.shared}
      //Constructor
        constructor({world}) {
          //Load world
            this.world = new World({app:this, name:world})
          //Configure viewport
            this.view.on("moved", () => this.methods.update())
            this.view.on("moved-end", () => this.methods.render())
            this.view.on("zoomed-end", () => this.methods.render())
            this.view.drag().pinch().wheel().decelerate().clamp({direction:"all"}).clampZoom({minScale:0.5, maxScale:1})
            this.view.scale.set(1)
          //Deffered constructor
            this.ready = new Promise(async solve => {
              await this.world.load.world()
              App.loader.renderer.load(async () => {
                await this.world.load.sea()
                await this.world.render({delay:0})
                this.methods.camera(GET.has("x")&&GET.has("y") ? {x:Number(GET.get("x"))||0, y:Number(GET.get("y"))||0, offset:{x:0, y:0}} : {x:329, y:-924})
                this.methods.update()
                this.data.ready = true
                this.data.lang = (await axios.get(`/lang/${GET.get("lang")||"en"}.json`)).data
                solve()
              })
            })
        }
      //Tweening
        tween = {
          //Quad in out
            quadInOut:(t) => t*t,
          //Fade
            fade:({target, change, from, to, duration}) => {
              //Prepare tween
                let t = 0, cached = target.cacheAsBitmap
                target.cacheAsBitmap = false
              //Tween
                const tween = (delta) => {
                  //Completed
                    if ((t += delta)/duration >= 1) {
                      target[change] = to
                      target.cacheAsBitmap = cached
                      this.renderer.ticker.remove(tween)
                    }
                  //Pending
                    else
                      target[change] = Math.min(to, from + (to - from) * this.tween.quadInOut(t/duration))
                }
                this.renderer.ticker.add(tween)
            }
        }
    }

  //World map
    class World {
      //Origin point
        origin = {x:Infinity, y:Infinity}
      //Boundary point
        boundary = {x:-Infinity, y:-Infinity}
      //Chunks
        chunks = new Map()
      //Creatures
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
                GET.set("x", this.app.data.user.position.x)
                GET.set("y", this.app.data.user.position.y)
                window.history.pushState("", "", `/?${GET.toString()}`)
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
    }

  //World chunk
    World.Chunk = class {
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

  //World sea
    World.Sea = class {
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

  //Creatures
    class Creature {
      //Constructor
        constructor({species}) {
          this.species = species
          this.sprite = new PIXI.AnimatedSprite([0, 1].map(i => `${species}_${i}`))
        }
    }

  //Instantiate app
    const app = new App({world:"overworld"})
    await app.ready
})() 
 