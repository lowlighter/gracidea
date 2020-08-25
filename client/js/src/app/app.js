//Imports
  import World from "./../world/world.js"
  import settings from "./settings.js"
  import u from "./utils.js"

/**
 * Application.
 *
 * This is the main handler for the application.
 * It instantiates renderer, viewport, controller, url params and other stuff.
 */
  export default class App {

    //Promise which tell if app is ready
      ready = new Promise(solve => null)

    //Data reference
      data = {
        //User data
          user:{
            //User position
              position:{x:0, y:0},
            //User location
              location:{},
          },
        //Maps data (like locations and interests points)
          maps:[],
        //Show states
          show:{
            map:false,
            debug:false,
          },
        //Lang data
          lang:{},
        //Loading status
          loading:{
            state:"Loading...",
            substate:"",
            stated:[],
            done:false
          },
        //Debug
          debug:{
            sea:true,
            characters:true,
            areas:false,
            chunks:false,
            tweens:false,
            pause:false,
            branch:"master",
            branch_owner:"lowlighter",
            diff:false,
            lang:"en",
          }
      }

    //Methods reference (also used by controller)
      methods = {
        //Move camera
          camera:({x, y, offset}) => this.world.camera({x, y, offset}),
        //Update user position
          update:() => this.data.user.position = {x:u.to.coord.tile(this.view.center.x), y:u.to.coord.tile(this.view.center.y)},
        //Render world
          render:() => this.data.loading.done ? this.world.render() : null,
        //Redirect
          redirect:(url) => window.location.replace(url),
        //Render world (debug)
          debug_render:() => {
            //Rendering state
              if (this.data.debug.pause)
                return this.renderer.ticker.stop()
              if (!this.renderer.ticker.started)
                this.renderer.ticker.start()
            //Render
              this.methods.render()
          }
      }

    //Renderer reference
      renderer = new PIXI.Application({width:document.body.clientWidth, height:document.body.clientHeight, transparent:true, resizeTo:window, autoDensity:true})

    //Viewport reference
      viewport = new Viewport.Viewport({screenWidth: window.innerWidth, screenHeight: window.innerHeight, interaction:this.renderer.renderer.plugins.interaction})

    //View reference
      view = this.renderer.stage.addChild(this.viewport)

    //Controller reference
      controller = new Vue({
        //Selector
          el:"#app",
        //Data and methods
          data:this.data, methods:this.methods,
        //Mounted callback
          mounted:() => document.querySelector("#app .view").appendChild(this.renderer.view),
      })

    //URL params
      params = {
        //Get params
          get:{
            //Update params
              update:(properties) => {
                for (let [key, value] of Object.entries(properties)) {
                  if (/^\d+$/.test(value))
                    value = Number(value)
                  if (/^true$/.test(value))
                    value = true
                  if (/^false$/.test(value))
                    value = false
                  this.params.get.map.set(key, value)
                }
                window.history.pushState("", "", `/?${this.params.get.map.toString()}`)
              },
            //Params map
              map:new URLSearchParams(window.location.search),
          }
      }

    //Endpoints
      endpoints = {
        repo:{
          raw:"https://raw.githubusercontent.com",
          user:"https://raw.githubusercontent.com/lowlighter/gracidea",
          master:"https://raw.githubusercontent.com/lowlighter/gracidea/master",
        },
        lang:"/lang",
        maps:"/maps",
      }

    //Constructor
      constructor({world}) {
        //Apply settings
          settings()
        //Load world
          this.world = new World({app:this, name:world})
        //Configure viewport
          this.view.on("moved", () => this.methods.update())
          this.view.on("moved-end", () => this.methods.render())
          this.view.on("zoomed-end", () => this.methods.render())
          this.view.drag().pinch().wheel().decelerate({friction:0.5}).clamp({direction:"all"}).clampZoom({minScale:0.5, maxScale:1})
          this.view.scale.set(1)
        //Deffered constructor
          this.ready = new Promise(async (solve, reject) => {
            //Load language
              this.data.loading.state = "Loading"
              for (let lg of [this.params.get.map.get("lang") || "en", "en"]) {
                try {
                  const {data:lang} = await axios.get(`${this.endpoints.lang}/${lg}.json`)
                  this.data.lang = lang
                  break
                } catch (error) { console.warn(`Could not load language [${lg}]`) }
              }
              if (!Object.keys(this.data.lang).length)
                reject(this.data.loading.state = `An error occured while loading language :(`)
              this.data.loading.stated.unshift(this.data.lang.loading.loaded.lang)
            //Load parameters
              this.data.loading.state = this.data.lang.loading.params
              this.data.debug.sea = this.params.get.map.has("sea") ? this.params.get.map.get("sea") : true
              this.data.debug.characters = this.params.get.map.has("characters") ? this.params.get.map.get("characters") : true
              this.data.debug.areas = this.params.get.map.get("areas") || false
              this.data.debug.chunks = this.params.get.map.get("chunks") || false
              this.data.debug.diff = this.params.get.map.get("diff") || false
            //Branch and diff
              const branch = this.params.get.map.get("branch")
              if (branch) {
                const [,owner, name] = decodeURIComponent(branch).match(/^([\w-]+):([\w-]+)$/)||["", "lowlighter", "master"]
                this.data.debug.branch = name
                this.data.debug.branch_owner = owner
                this.endpoints.repo.user = `${this.endpoints.repo.raw}/${owner}/gracidea`
                this.endpoints.maps = `${this.endpoints.repo.user}/${name}/maps`
                this.endpoints.lang = `${this.endpoints.repo.user}/${name}/client/lang`
              }
              if (this.data.debug.diff) {
                this.data.debug.sea = false
                this.data.debug.characters = false
                this.data.debug.tweens = false
              }
              this.data.loading.stated.unshift(this.data.lang.loading.loaded.params)
            //Load world
              this.data.loading.state = this.data.lang.loading.world
              await this.world.load.world()
              this.data.loading.stated.unshift(this.data.lang.loading.loaded.world)
            //Rendering
              App.loader.renderer.onProgress.add((loader, resource) => this.data.loading.stated.unshift(`${this.data.lang.loading.loaded.tileset} : ${resource.name}`))
              App.loader.renderer.load(async () => {
                //Load sea
                  this.data.loading.state = this.data.lang.loading.sea
                  await this.world.load.sea()
                  this.data.loading.stated.unshift(this.data.lang.loading.loaded.sea)
                //Set camera
                  this.data.loading.state = this.data.lang.loading.camera
                  this.methods.camera(this.params.get.map.has("x")&&this.params.get.map.has("y") ? {x:Number(this.params.get.map.get("x"))||0, y:Number(this.params.get.map.get("y"))||0, offset:{x:0, y:0}, render:false} : {x:329, y:-924, render:false})
                  this.methods.update()
                  this.data.loading.stated.unshift(this.data.lang.loading.loaded.camera)
                //First render
                  this.data.loading.state = this.data.lang.loading.render
                  this.world.start()
                  await this.world.cache.rendered
                  this.data.loading.done = true
                //Count fps
                  this.renderer.ticker.add(() => this.data.debug.fps = this.renderer.ticker.FPS|0)
                  solve()
              })
            })
      }

    //Tweening
      tween = {
        //Quad in out
          quadInOut:(t) => t*t,
        //Fade
          fade:({target, from, to, duration, callback}) => {
            //Prepare tween
              const cached = target.cacheAsBitmap
              target.cacheAsBitmap = false
            //Tween
              this.tween.property({target, change:"alpha", from, to, duration, callback:() => {
                target.cacheAsBitmap = cached
                if (callback)
                  callback()
              }})
          },
        //Property (/* Experimental feature */)
          property:({target, change, from, to, duration, callback}) => {
            //Debug
              if (!this.world.app.data.debug.tweens) {
                target[change] = to
                return
              }
            //Prepare tween
              let t = 0, op = to > from ? Math.min : Math.max
            //Tween
              const tween = (delta) => {
                //Completed
                  if ((t += delta)/duration >= 1) {
                    target[change] = to
                    this.renderer.ticker.remove(tween)
                    if (callback)
                      callback()
                  }
                //Pending
                  else
                    target[change] = op(to, from + (to - from) * this.tween.quadInOut(t/duration))
              }
              this.renderer.ticker.add(tween)
          }
      }

    //App time
      static get time() { return PIXI.Ticker.shared.lastTime }

    //Loaders
      static loader = {renderer:PIXI.Loader.shared}

  }