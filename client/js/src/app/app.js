//Imports
  import World from "./../world/world.js"
  import settings from "./settings.js"

/** 
 * Application.
 */
  export default class App {
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
    //Get params
      GET = new URLSearchParams(window.location.search)
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
            await this.world.load.world()
            App.loader.renderer.load(async () => {
              await this.world.load.sea()
              await this.world.render({delay:0})
              this.methods.camera(this.GET.has("x")&&this.GET.has("y") ? {x:Number(this.GET.get("x"))||0, y:Number(this.GET.get("y"))||0, offset:{x:0, y:0}} : {x:329, y:-924})
              this.methods.update()
              this.data.ready = true
              this.data.lang = (await axios.get(`/lang/${this.GET.get("lang")||"en"}.json`)).data
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