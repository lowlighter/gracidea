export const TILE_SIZE = 16
export const CHUNK_SIZE = 32

export const ANIMATED = {
  2266:{
    frames:[2266, 2267, 2268, 2269].map(frame => `${frame}`),
    speed:0.025,
  },
  2374:{
    frames:[2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381].map(frame => `${frame}`),
    speed:0.075,
  },
  658:{
    frames:[658, 659, 660, 659].map(frame => `${frame}`),
    speed:0.05,
  },
  661:{
    frames:[661, 662, 663, 664, 663, 664, 663, 664, 663, 664, 662, 661, 661, 661].map(frame => `${frame}`),
    speed:0.05,
  },
  774:{
    frames:[774, 775, 776, 777, 776, 777, 776, 777, 776, 777, 775, 774, 774, 774].map(frame => `${frame}`),
    speed:0.05,
  }
}

/**
 * Render engine.
 * A wrapper around PIXI engine.
 */
  class Render {

    /** Render engine */
      private static engine:any

    /** Render application */
      static app:any

    /** Render setup */
      static async setup() {
        //Load dependencies
          const [PIXI, {default:StatsJS}] = await Promise.all([import("https://cdn.skypack.dev/pixi.js@6.0.2"), import("https://cdn.skypack.dev/stats.js")])
        //Load and configure PIXI
          this.engine = PIXI
          this.engine.settings.SCALE_MODE = this.engine.SCALE_MODES.NEAREST
          this.engine.settings.ROUND_PIXELS = true
        //Load resources
          const loader = Render.engine.Loader.shared
          loader.add("/textures/tileset3.json")
          loader.add("/textures/creatures.json")
        //Create application
          this.app = new Render.engine.Application({
            width:document.body.clientWidth,
            height:document.body.clientHeight,
            resizeTo:globalThis.window,
            autoDensity:true,
            resolution:globalThis.devicePixelRatio,
            backgroundAlpha:0,
          })
          document.querySelector("body").appendChild(this.app.view)
        //FPS and frame
          for (const i of [0, 1]) {
            const stats = new StatsJS()
            stats.showPanel(i)
            document.querySelector("body").appendChild(stats.dom)
            stats.dom.style.left = `${i*80}px`
            this.app.ticker.add(() => stats.update())
          }
        //Wait for resources to be loaded
          await new Promise(solve => loader.load(() => solve(null)))
      }

    /** Polygon */
      static Polygon(points:number[]) {
        return new Render.engine.Polygon(...points.map(n => n*TILE_SIZE))
      }

    /** Graphics */
      static Graphics({stroke, fill, text, textStyle, textPosition, rect, circle, polygon}:{stroke?:any, fill?:any, text?:string, textStyle?:any, textPosition?:{x:number, y:number}, rect?:number[], circle?:number[], polygon?:number[]}) {
        const graphics = new Render.engine.Graphics()
          if (stroke)
            graphics.lineStyle(...stroke)
          if (fill)
            graphics.beginFill(...fill)
          if (rect)
            graphics.drawRect(...rect.map(n => n*TILE_SIZE))
          if (circle)
            graphics.drawCircle(...circle.map(n => n*TILE_SIZE))
          if (polygon) {
            if (polygon instanceof Render.engine.Polygon)
              graphics.drawPolygon(polygon)
            else
              graphics.drawPolygon(...polygon.map(n => n*TILE_SIZE))
          }
        graphics.endFill()
        if (text) {
          const textSprite = graphics.addChild(new Render.engine.Text(text, textStyle))
          textSprite.anchor.set(0.5)
          if (textPosition)
            textSprite.position.set(textPosition.x, textPosition.y)
        }
        return graphics
      }

    /** ParticleContainer */
      static ParticleContainer({x = 0, y = 0}:{x?:number, y?:number} = {}) {
        const container = new Render.engine.ParticleContainer()
        container.position.set(x*TILE_SIZE, y*TILE_SIZE)
        return container
      }

    /** Container */
      static Container({x = 0, y = 0, sorted = false}:{x?:number, y?:number, sorted?:boolean} = {}) {
        const container = new Render.engine.ParticleContainer.__proto__()
        container.position.set(x*TILE_SIZE, y*TILE_SIZE)
        if (sorted)
          container.sortableChildren = true
        return container
      }

    /** Sprite */
      static Sprite({frame = Render.engine.Texture.EMPTY, x = 0, y = 0, anchor}:{frame?:any, x?:number, y?:number, anchor?:[number, number]} = {}) {
        let sprite
        if (`${frame}` in ANIMATED) {
          sprite = new Render.engine.AnimatedSprite.fromFrames(ANIMATED[frame].frames)
          sprite.animationSpeed = ANIMATED[frame].speed
          sprite.play()
        }
        else
          sprite = new Render.engine.Sprite.from(`${frame}`)
        sprite.position.set(x*TILE_SIZE, y*TILE_SIZE)
        if (anchor)
          sprite.anchor.set(...anchor)
        return sprite
      }

    static tween({target, change, from, to, duration, callback}) {
      let t = 0
      const op = to > from ? Math.min : Math.max
      const transition = delta => {
        //Completed
          if ((t += delta)/duration >= 1) {
            target[change] = to
            Render.engine.Ticker.shared.remove(transition)
            callback?.()
          }
        //In progress
          else
            target[change] = op(to, from + (to - from) * (t/duration)**2)
      }
      Render.engine.Ticker.shared.add(transition)
    }

  }

/** App */
  export class App {

    /** World reference */
      readonly world:World

    /** App ready state */
      readonly ready:Promise<void>

    /** Constructor */
      constructor() {
        const that = this as any
        this.ready = new Promise(async solve => {
          await Render.setup()
          that.world = new World()

          let timeout = null
          Render.app.view.addEventListener("wheel", event => {
            event.preventDefault()
            this.world.sprites.world.position.x -= event.deltaX
            this.world.sprites.world.position.y -= event.deltaY
            clearTimeout(timeout)
            timeout = setTimeout(() => this.world.camera. render(), 500)
          })

          document.addEventListener("keydown", ({code}) => {
            switch (code) {
              case "ArrowLeft":
                this.world.camera.x--
                this.world.camera.render()
                break
              case "ArrowRight":
                this.world.camera.x++
                this.world.camera.render()
                break
              case "ArrowUp":
                this.world.camera.y--
                this.world.camera.render()
                break
              case "ArrowDown":
                this.world.camera.y++
                this.world.camera.render()
                break
            }
          })

          solve()
        })

      }

  }

/**
 * World.
 */
  export class World {

    /** Sprites */
      readonly sprites:{
        world:ReturnType<typeof Render.Container>
        chunks:ReturnType<typeof Render.Container>
        areas:ReturnType<typeof Render.Container>
      }

    /** Loaded */
      readonly loaded = {
        chunks:new Map<string, Chunk>(),
        areas:new Map<string, Area>(),
      }

    /** Camera */
      readonly camera:Camera

    /** Constructor */
      constructor() {
        const sprite = Render.app.stage.addChild(Render.Container())
        this.sprites = {
          world:sprite,
          chunks:sprite.addChild(Render.Container()),
          areas:sprite.addChild(Render.Container()),
        }
        this.camera = new Camera({world:this})
      }

    /** Return chunk for a position */
      chunkAt({x, y}:{x:number, y:number}) {
        return this.loaded.chunks.get(`${Math.floor(x/CHUNK_SIZE)};${Math.floor(y/CHUNK_SIZE)}`)
      }

  }

/**
 * World positionable element.
 * An object with coordinates and dimensions.
 */
  export abstract class Positionable {

    /** World */
      readonly world:World

    /** X coordinate */
      x:number

    /** Y coordinate */
      y:number

    /** Width */
      width:number

    /** Height */
      height:number

    /** Constructor */
      constructor({world, x = 0, y = 0, width = 0, height = 0}:{world:World, x?:number, y?:number, width?:number, height?:number}) {
        this.world = world
        this.x = x
        this.y = y
        this.width = width
        this.height = height
      }

  }

/**
 * World renderable element.
 * A positionable object with a sprite.
 */
  export abstract class Renderable extends Positionable {

    /** Sprite */
      abstract readonly sprite:ReturnType<typeof Render.Container>

    /** Rendered flag */
      rendered = false

    /** Render method */
      abstract render();

    /** Hide sprite */
      hide() {
        this.sprite.visible = false
      }

    /** Show sprite (call render method if needed) */
      show() {
        if (!this.rendered) {
          this.rendered = true
          this.render()
        }
        this.sprite.visible = true
      }


      destructor() {
        this.sprite.removeChildren().forEach(child => child.destroy({children:true}))
      }

  }

/**
 * World camera.
 * An object used to find global position and choose which section of world to render.
 */
  export class Camera extends Positionable {

    /** Sprite */
      readonly sprite:ReturnType<typeof Render.Container>

    /** Constructor */
      constructor({world}:{world:World}) {
        super({world})
        this.sprite = this.world.sprites.world.addChild(Render.Container())
        Object.defineProperties(this, {
          x:{
            get:() => Math.floor((-this.world.sprites.world.position.x+document.body.clientWidth/2)/TILE_SIZE),
            set:x => this.moveTo({x, y:this.y}),
          },
          y:{
            get:() => Math.floor((-this.world.sprites.world.position.y+document.body.clientHeight/2)/TILE_SIZE),
            set:y => this.moveTo({x:this.x, y}),
          }
        })
        this.render()
      }

    /** Render */
      async render() {
        //Extract current tile and chunk positions
          const {x, y} = this
          const X = Math.floor(x/CHUNK_SIZE)
          const Y = Math.floor(y/CHUNK_SIZE)

        //Load
          const data = await fetch(`/map/overworld?X=${X}&Y=${Y}&DX=2&DY=1`).then(res => res.json())

        //Chunks
          {
            //Display loaded elements
              const unused = new Set([...this.world.loaded.chunks.keys()])
              Object.entries(data.chunks).forEach(([id, chunk]) => {
                if (!this.world.loaded.chunks.has(id))
                  this.world.loaded.chunks.set(id, new Chunk({id, data:chunk as any, world:this.world}))
                this.world.loaded.chunks.get(id)?.show()
                unused.delete(id)
              })
            //Hide unused elements
              unused.forEach(id => {
                const chunk = this.world.loaded.chunks.get(id)
                if (chunk)
                  chunk.hide()
                if (Math.sqrt((chunk.x-X)**2+(chunk.y-Y)**2) > 3) {
                  this.world.loaded.chunks.delete(id)
                  chunk.destructor()
                }
              })
          }
        //Areas
          {
            //Display loaded elements
              const unused = new Set([...this.world.loaded.areas.keys()])
              Object.entries(data.areas).forEach(([layer, areas]) => {
                areas.forEach(area => {
                  const id = `${layer}-${area.name}`
                  if (!this.world.loaded.areas.has(id))
                    this.world.loaded.areas.set(id, new Area({id, data:area as any, world:this.world}))
                  this.world.loaded.areas.get(id)?.show()
                  unused.delete(id)
                })
              })
            //Hide unused elements
              /*unused.forEach(id => {
                const chunk = this.loaded.areas.get(id)
                if (chunk)
                  chunk.hide()
                if (Math.sqrt((chunk.x-X)**2+(chunk.y-Y)**2) > 3) {
                  this.loaded.areas.delete(id)
                  chunk.destructor()
                }
              })*/
          }
        //this.sprites.chunks.removeChildren().forEach(child => child.destroy({children:true}))
        //this.sprites.areas.removeChildren().forEach(child => child.destroy({children:true}))
          {
            //
              /*for (const [id, areas] of Object.entries(data.areas)) {
                if (!this.loaded.chunks.has(id))
                  this.loaded.chunks.set(id, new Chunk({id, data:chunk as any, world:this.world}))
                this.loaded.chunks.get(id)?.show()
              }*/
          }


        if (!window.test) {
          window.test = new NPC({world:this.world})
        }

        //new Area({id:"test", data:{points:[ -29, -45, 34, -45, 34, 72, -29, 72 ]}, world:this.world})




        this.world.sprites.chunks.addChild(Render.Graphics({fill:[0xFF0000, .5], rect:[0, 0, 1, 1]})).position.set(this.x*TILE_SIZE, this.y*TILE_SIZE)
      }

    /** Move camera to given position */
      moveTo({x, y}:{x:number, y:number}) {
        this.world.sprites.world.position.set(-x*TILE_SIZE + document.body.clientWidth/2, -y*TILE_SIZE + document.body.clientHeight/2)
      }

  }


  type ChunkData = {
    layers:{[key:string]:number[]}
  }

/**
 * World chunk.
 * Split world in smaller parts for improved rendering.
 * Chunks are divided internally into layers.
 */
  export default class Chunk extends Renderable {

    /** Identifier */
      readonly id:string

    /** Sprite */
      readonly sprite:ReturnType<typeof Render.Container>

    /** Chunk data */
      readonly data:ChunkData

    /** Layers */
      readonly layers = new Map()

    /** Constructor */
      constructor({id, data, world}:{id:string, data:ChunkData, world:World}) {
        super({world})
        this.id = id
        this.data = data
        this.width = this.height = CHUNK_SIZE
        ;[this.x, this.y] = this.id.split(";").map(n => Number(n)*CHUNK_SIZE)
        this.sprite = this.world.sprites.chunks.addChild(Render.Container({x:this.x, y:this.y}))
        console.debug(`loaded chunk: ${this.id}`)
      }

    /** Destructor */
      destructor() {
        console.debug(`unloaded loaded chunk: ${this.id}`)
        return super.destructor()
      }

    /** Render */
      render() {
        for (const {name, sublayers, sorted = false} of [
          {name:"ground", sublayers:["01-ground", "02-ground", "03-ground"]},
          {name:"elements", sublayers:["11-elements", "12-elements", "13-elements"], sorted:true},
        ]) {
          //
            if (!this.layers.has(name))
              this.layers.set(name, this.sprite.addChild(Render.Container({sorted})))
            const layer = this.layers.get(name)

            let z = 0
            for (const name of sublayers) {
              //
                const tiles = this.data?.layers?.[name]
                if (!tiles)
                  continue
              //Draw tiles
                for (let i = 0; i < tiles.length; i++) {
                  const tile = tiles[i]
                  if (tile >= 0) {
                    const y = i%CHUNK_SIZE, x = Math.floor(i/CHUNK_SIZE)
                    layer.addChild(Render.Sprite({frame:tile, x, y})).zIndex = z*CHUNK_SIZE**2 + y*CHUNK_SIZE+x
                  }
                }
                z++
            }
        }


        //
          this.sprite.addChild(Render.Graphics({text:this.id, textStyle:{fontSize:12, fill:"white"}, stroke:[1, 0x0000FF, .5], fill:[0x0000FF, .25], rect:[0, 0, this.width, this.height]}))
      }

  }


  type AreaData = {
    center:{x:number, y:number}
    points:number[]
  }


  export class Area extends Renderable {

    /** Identifier */
      readonly id:string

    /** Sprite */
      readonly sprite:ReturnType<typeof Render.Container>

    /** Area data */
      readonly data:AreaData

    /** Polygon */
      readonly polygon:ReturnType<typeof Render.Polygon>

    /** Constructor */
      constructor({id, data, world}:{id:string, data:AreaData, world:World}) {
        super({world})
        this.id = id
        this.data = data
        this.polygon = Render.Polygon(this.data.points)
        this.sprite = this.world.sprites.areas.addChild(Render.Graphics({text:this.id, textStyle:{fontSize:12, fill:"white"}, textPosition:{x:this.data.center.x*TILE_SIZE, y:this.data.center.y*TILE_SIZE}, stroke:[1, 0x00FF00, .5], fill:[0x00FF00, .25], polygon:this.polygon}))
        console.debug(`loaded area: ${this.id}`)
      }

    /** Test if point is within area */
      contains({x, y}:{x:number, y:number}) {
        return this.polygon.contains(x*TILE_SIZE, y*TILE_SIZE)
      }

      show() {
        this.sprite.tint = this.contains(this.world.camera) ? 0xFFFFFF : 0xFF00FF
        return super.show()
      }

    /** Render */
      render() {}
  }


  export class NPC extends Renderable {

    /** Sprite */
      readonly sprite:ReturnType<typeof Render.Sprite>

    /** Constructor */
      constructor({world}:{world:World}) {
        super({world})
        this.sprite = Render.Container()
        this.sprite.addChild(Render.Sprite({frame:"regular/abra", anchor:[0.5, 1]}))

        console.debug(`loaded npc:`)
        this.x = 1
        this.y = -2
        this.render()
      }

      async wander() {
        console.log("next!")
        const {dx, dy} = [{dx:0, dy:0}, {dx:-1, dy:0}, {dx:+1, dy:0}, {dx:0, dy:-1}, {dx:0, dy:+1}][Math.floor(Math.random()/0.2)]
        this.render()
      }

      render() {
        const chunk = this.world.chunkAt(this)
        if (chunk) {
          const rx = this.x-chunk.x, ry = this.y-chunk.y
          this.sprite.position.set((rx+0.5)*TILE_SIZE, ry*TILE_SIZE)

          chunk?.layers.get("elements")?.addChild(this.sprite)
          this.sprite.zIndex = CHUNK_SIZE**2+ ry*CHUNK_SIZE+rx
        }

      }

  }






;(async () => new App())()

/*

  {"-1;-56":{"layers":[{"name":"01-ground","data":[113,113,113,113,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,113,113,113,113,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,113,113,113,113,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,113,113,113,113,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,113,113,113,113,-1,113,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,113,-1,-1,-1,-1,-1,-1,-1,-1,-1,-

    //Render chunk
      async render({force, animated, fade}) {
        //Global flags
          const flags = {rendered:false}
        //Render layers
          for (let [layer, {x, y, width, height, data:tiles}] of this.layers.entries()) {


            //Animated chunk
              if (animated) {
                chunk.animated = chunk.animated ?? this.sprite.getChildByName(`${layer}_animated`) ?? this.sprite.addChild(new PIXI.Container())
                chunk.animated.name = `${layer}_animated`
                chunk.animated.position.set(u.to.coord.px(x), u.to.coord.px(y))
                chunk.animated.removeChildren()
              }
            //Render tiles
              chunk.cacheAsBitmap = false
              chunk.removeChildren()
              for (let [index, texture] of tiles.entries()) {
                //Check texture
                  let tile = null
                  if (--texture >= 0) {
                    //Animated texture
                      if (texture in textures.animated) {
                        tile = chunk.animated.addChild(new PIXI.AnimatedSprite(textures.animated[texture].frames.map(PIXI.Texture.from)))
                        tile.animationSpeed = textures.animated[texture].speed
                        if (animated)
                          animated.add(tile)
                      }
                    //Static texture
                      else
                        tile = chunk.addChild(new PIXI.Sprite.from(`${texture}`))
                    //Set position and size
                      tile.position.set(u.to.coord.px(index%width), u.to.coord.px(~~(index/width)))
                      tile.width = tile.height = World.Chunk.tile.size
                  }
                //Compute diff
                  if ((this.world.app.data.debug.diff)&&(this.world.diff)) {
                    const prev = (this.world.diff[layer]?.[this.key]?.data?.[index] ?? 0)-1
                    //New texture
                      if ((prev === -1)&&(texture >= 0))
                        tile.tint = 0x00FF00
                    //Deleted texture
                      else if ((texture === -1)&&(prev >= 0)) {
                        tile = chunk.addChild(new PIXI.Sprite.from(`${prev}`))
                        tile.position.set(u.to.coord.px(index%width), u.to.coord.px(~~(index/width)))
                        tile.width = tile.height = World.Chunk.tile.size
                        tile.tint = 0xFF0000
                      }
                    //Untouched texture
                      else if ((prev === texture)&&(texture >= 0))
                        tile.alpha = .15
                    //Edited texture
                      else if ((prev >= 0)&&(texture >= 0))
                        tile.tint = 0xFFFF00
                  }
              }
            //Cache
              chunk.cacheAsBitmap = true
          }
        //Additional processing if chunk has been rendered
          if (flags.rendered) {
            //Fade if needed
              if (fade)
                this.world.app.tween.fade({target:this.sprite, from:0, to:1, duration:16})
            //Add sprite
              this.world.layers.global.world.addChild(this.sprite)


          }
      }*/