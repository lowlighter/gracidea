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
              position:{x:0, y:0}
          },
        //Maps data (like locations and interests points)
          maps:[],
        //Show states
          show:{
            map:false
          },
        //Lang data
          lang:{},
        //Loading status
          loading:{
            state:"Loading...",
            done:false
          }
      }

    //Methods reference (also used by controller)
      methods = {
        //Move camera
          camera:({x, y, offset}) => this.world.camera({x, y, offset}),
        //Update user position
          update:() => this.data.user.position = {x:u.to.coord.tile(this.view.center.x), y:u.to.coord.tile(this.view.center.y)},
        //Render world
          render:() => this.world.render(),
        //Redirect
          redirect:(url) => window.location.replace(url)
      }

    //Renderer reference
      renderer = new PIXI.Application({width:document.body.clientWidth, height:document.body.clientHeight, transparent:true, resizeTo:window, antialias:true})
  
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
                for (let [key, value] of Object.entries(properties))
                  this.params.get.map.set(key, value)
                window.history.pushState("", "", `/?${this.params.get.map.toString()}`)
              },
            //Params map
              map:new URLSearchParams(window.location.search),
          } 
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
          this.view.drag().pinch().wheel().decelerate().clamp({direction:"all"}).clampZoom({minScale:0.5, maxScale:1})
          this.view.scale.set(1)
        //Deffered constructor
          this.ready = new Promise(async solve => {
            const lang = axios.get(`/lang/${this.params.get.map.get("lang")||"en"}.json`)
            this.data.loading.state = "Loading world..."
            await this.world.load.world()
            App.loader.renderer.load(async () => {
              this.data.loading.state = "Loading sea..."
              await this.world.load.sea()
              this.data.loading.state = "Loading camera..."
              this.methods.camera(this.params.get.map.has("x")&&this.params.get.map.has("y") ? {x:Number(this.params.get.map.get("x"))||0, y:Number(this.params.get.map.get("y"))||0, offset:{x:0, y:0}} : {x:329, y:-924})
              this.methods.update()
              this.data.loading.state = "Loading life..."
              this.world.start()
              this.data.loading.state = "Loading lang..."
              this.data.lang = (await lang).data
              this.data.loading.state = "Waiting for first rendering..."
              await this.world.render({delay:0, fade:false})
              await this.world.cache.rendered
              this.data.loading.done = true
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
        //Property
          property:({target, change, from, to, duration, callback}) => {
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

    //Debug mode
      static debug = false
  }