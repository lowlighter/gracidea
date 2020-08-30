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

    //Mounted
      mounted = new Promise((solve, reject) => this._mounted = solve)

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
            wiki:{
              enabled:false,
              _page:"",
              set page(page) { this._page = page ; this.loading = true },
              get page() { return this._page },
              loading:false
            }
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
            sea:null,
            characters:null,
            areas:null,
            chunks:null,
            tweens:null,
            pause:null,
            branch:"master",
            branch_owner:"lowlighter",
            diff:null,
            lang:null,
            history:null,
            wiki:null
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
                return this.methods.pause()
              if (!this.renderer.ticker.started)
                this.methods.resume()
            //Render
              this.methods.render()
          },
        //Pause renderer
          pause:() => {
            this.renderer.ticker.stop()
            this.viewport.pause = true
          },
        //Resume renderer
          resume:() => {
            this.renderer.ticker.start()
            this.viewport.pause = false
          }
      }

    //Controller reference
      controller = new Vue({
        //Selector
          el:"#app",
        //Data and methods
          data:this.data, methods:this.methods,
        //Mounted callback
          mounted:() => this._mounted(),
      })

    //URL params
      params = {
        //Get params
          get:{
            //Update params
              update:() => {
                //Skip if history update is disabled
                  if (!this.data.debug.history)
                    return
                //Compute properties
                  const properties = {...this.data.user.position, ...JSON.parse(JSON.stringify(this.data.debug))}
                  properties.branch = `${properties.branch_owner}:${properties.branch}`
                  delete properties.fps
                  delete properties.branch_owner
                  for (let i in properties)
                    if (App.debug.defaults[i] === properties[i])
                      delete properties[i]
                  window.history.pushState("", "", `/?${(new URLSearchParams(properties)).toString()}`)
              },
            //Parse url params
              parse:(params) => {
                //Parse values
                  params = Object.fromEntries([...params])
                  for (let [key, value] of Object.entries(params)) {
                    if ((/^\d+$/.test(value))||(/^NaN$/.test(value)))
                      value = Number(value)
                    if (/^true$/.test(value))
                      value = true
                    if (/^false$/.test(value))
                      value = false
                    if (/^null$/.test(value))
                      value = null
                    params[key] = value
                  }
                //Return parsed map
                  return new Map(Object.entries(params))
              },
            //Parsed params
              parsed:new Map(),
            //Url search params
              usp:new URLSearchParams(window.location.search)
          },
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
        //
          Object.defineProperty(this.data.show.wiki, "enabled", {get:() => this.data.debug.wiki})
        //Deffered constructor
          this.ready = new Promise(async (solve, reject) => {
            //Load language
              this.data.loading.state = "Loading"
              for (let lg of [this.params.get.usp.get("lang") ?? "en", "en"]) {
                try {
                  const {data:lang} = await axios.get(`${this.endpoints.lang}/${lg}.json`)
                  this.data.lang = lang
                  break
                } catch (error) { console.warn(`Could not load language [${lg}]`) }
              }
              if (!Object.keys(this.data.lang).length)
                reject(this.data.loading.state = `An error occured while loading language :(`)
              this.data.lang.creatures = (await axios.get(`/maps/creatures/name/${this.data.lang.id}`)).data
              this.data.loading.stated.unshift(this.data.lang.loading.loaded.lang)
            //Load scripts
              this.data.loading.state = this.data.lang.loading.scripts
              const scripts = new Promise(async (solve) => {
                for (let script of ["js/pixi.min.js", "js/viewport.js"]) {
                  this.data.loading.state = `${this.data.lang.loading.script} : ${script}`
                  let el = document.createElement("script")
                  el.src = script
                  el.type = "text/javascript"
                  await new Promise ((loaded) => {
                    el.onload = loaded
                    document.querySelector("body").appendChild(el)
                    this.data.loading.stated.unshift(`${this.data.lang.loading.loaded.script} : ${script}`)
                  })
                }
                solve()
              })
            //Load parameters
              const params = this.params.get.parsed = this.params.get.parse(this.params.get.usp)
              window.test = params.get("history")
              this.data.loading.state = this.data.lang.loading.params
              this.data.debug.lang = this.data.lang.id
              this.data.debug.sea = params.has("sea") ? params.get("sea") : App.debug.defaults.sea
              this.data.debug.characters = params.has("characters") ? params.get("characters") : App.debug.defaults.characters
              this.data.debug.areas = params.get("areas") ?? App.debug.defaults.areas
              this.data.debug.tweens = params.get("tweens") ?? App.debug.defaults.tweens
              this.data.debug.pause = params.get("pause") ?? App.debug.defaults.pause
              this.data.debug.chunks = params.get("chunks") ?? App.debug.defaults.chunks
              this.data.debug.diff = params.get("diff") ?? App.debug.defaults.diff
              this.data.debug.history = params.get("history") ?? App.debug.defaults.history
              this.data.debug.highlights = params.get("highlights") ?? App.debug.defaults.highlights
              this.data.debug.wiki = params.get("wiki") ?? App.debug.defaults.wiki
              this.data.debug.header = params.get("header") ?? App.debug.defaults.header
            //Branch and diff
              const branch = decodeURIComponent(params.get("branch") ?? App.debug.defaults.branch)
              if ((branch !== App.debug.defaults.branch)&&(/^([\w-]+):([\w-]+)$/.test(branch))) {
                const [,owner, name] = branch.match(/^([\w-]+):([\w-]+)$/) ?? ["", "lowlighter", "master"]
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
            //Wait for additional scripts to be loaded
              this.data.loading.state = this.data.lang.loading.scripts
              await scripts
              this.data.loading.stated.unshift(this.data.lang.loading.loaded.scripts)
            //Renderer reference
              this.data.loading.state = this.data.lang.loading.renderer
              settings()
              this.renderer = new PIXI.Application({width:document.body.clientWidth, height:document.body.clientHeight, transparent:true, resizeTo:window, autoDensity:true})
              this.data.loading.stated.unshift(this.data.lang.loading.loaded.renderer)
            //Configure viewport
              this.data.loading.state = this.data.lang.loading.view
              this.viewport = new Viewport.Viewport({screenWidth: window.innerWidth, screenHeight: window.innerHeight, interaction:this.renderer.renderer.plugins.interaction})
              this.view = this.renderer.stage.addChild(this.viewport)
              this.view.on("moved", () => this.methods.update())
              this.view.on("moved-end", () => this.methods.render())
              this.view.on("zoomed-end", () => this.methods.render())
              this.view.drag().pinch().wheel().decelerate({friction:0.5}).clamp({direction:"all"}).clampZoom({minScale:0.5, maxScale:1})
              this.view.scale.set(1)
              await this.mounted
              document.querySelector("#app .view").appendChild(this.renderer.view)
              this.data.loading.stated.unshift(this.data.lang.loading.loaded.view)
            //Load world
              this.data.loading.state = this.data.lang.loading.world
              this.world = new World({app:this, name:world})
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
                  this.methods.camera(params.has("x")&&params.has("y") ? {x:Number(params.get("x")) ?? 0, y:Number(params.get("y")) ?? 0, offset:{x:0, y:0}, render:false} : {x:329, y:-924, render:false})
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
      static get loader() { return {renderer:PIXI.Loader.shared} }

      static debug = {
        defaults:{
          sea:true,
          characters:true,
          areas:false,
          tweens:true,
          chunks:false,
          diff:false,
          history:true,
          highlights:false,
          pause:false,
          branch:"lowlighter:master",
          history:true,
          wiki:true,
          lang:"en",
          header:true,
        }
      }

  }