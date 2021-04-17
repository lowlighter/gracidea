import StatsJS from "https://cdn.skypack.dev/stats.js"

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
 *
 * A wrapper around PIXI engine.
 */
class Render {

  /** Render engine */
    private static engine:any

  /** Render application */
    static app:any

  /** Render setup */
    static async setup() {
      //Load and configure PIXI
      this.engine = await import("https://cdn.skypack.dev/pixi.js@6.0.2")
      this.engine.settings.SCALE_MODE = this.engine.SCALE_MODES.NEAREST
      this.engine.settings.ROUND_PIXELS = true
      //Load resources
      const loader = Render.engine.Loader.shared
      loader.add("/textures/tileset3.json")
      await new Promise(solve => loader.load(() => solve(null)))
      //
      this.app = new Render.engine.Application({
        width:document.body.clientWidth,
        height:document.body.clientHeight,
        resizeTo:globalThis.window,
        autoDensity:true,
        resolution:globalThis.devicePixelRatio,
        backgroundAlpha:0,
      })
      document.querySelector("body").appendChild(this.app.view)

      for (const i of [0, 1]) {
        const stats = new StatsJS()
        stats.showPanel(i)
        document.querySelector("body").appendChild(stats.dom)
        stats.dom.style.left = `${i*80}px`
        this.app.ticker.add(() => stats.update())
      }



    }


  static Graphics({stroke, fill, text, textStyle, rect}:{stroke?:any, fill?:any, text?:string, textStyle?:any, rect:number[]}) {
    const graphics = new Render.engine.Graphics()
    graphics.lineStyle(...stroke).beginFill(...fill).drawRect(...rect.map(n => n*TILE_SIZE)).endFill()
    if (text)
      graphics.addChild(new Render.engine.Text(text, textStyle))
    return graphics
  }

  static ParticleContainer({x = 0, y = 0}:{x?:number, y?:number} = {}) {
    const container = new Render.engine.ParticleContainer()
    container.position.set(x*TILE_SIZE, y*TILE_SIZE)
    return container
  }


  static Container({x = 0, y = 0}:{x?:number, y?:number} = {}) {
    const container = new Render.engine.ParticleContainer.__proto__()
    container.position.set(x*TILE_SIZE, y*TILE_SIZE)
    return container
  }

  static Sprite({frame = Render.engine.Texture.EMPTY, x = 0, y = 0}:{frame?:any, x?:number, y?:number} = {}) {
    let sprite
    if (`${frame}` in ANIMATED) {
      sprite = new Render.engine.AnimatedSprite.fromFrames(ANIMATED[frame].frames)
      sprite.animationSpeed = ANIMATED[frame].speed
      sprite.play()
    }
    else
      sprite = new Render.engine.Sprite.from(`${frame}`)
    sprite.position.set(x*TILE_SIZE, y*TILE_SIZE)
    return sprite
  }

}


type WorldData = {
  chunks:{[key:string]:ChunkData}
}

export class World {

  /** Sprite */
    readonly sprite:ReturnType<typeof Render.Container>

  /** Chunk data */
    readonly data:WorldData

  /** Chunks reference */
    readonly chunks = new Map()

  /** Constructor */
    constructor(data:WorldData) {
      this.sprite = Render.app.stage.addChild(Render.Container())
      this.data = data
      this.load()
    }

    async load() {

      const X = -Math.floor(this.sprite.position.x/(TILE_SIZE*CHUNK_SIZE))
      const Y = -Math.floor(this.sprite.position.y/(TILE_SIZE*CHUNK_SIZE))

      const data = await fetch(`/map/overworld?X=${X}&Y=${Y}&DX=2&DY=1`).then(res => res.json())
      console.log(data)

      this.chunks.clear()

      this.sprite.removeChildren().forEach(child => child.destroy({children:true}))

      for (const [id, chunk] of Object.entries(data.chunks))
        this.chunks.set(id, new Chunk({id, data:chunk as any, world:this}))

    }

}

/**
 * World positionable element.
 * An object with coordinates and dimensions.
 */
  export class Positionable {

    /** World reference */
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


  type ChunkData = {
    layers:{[key:string]:number[]}
  }

/**
 * World chunk.
 * Split world in smaller parts for improved rendering.
 * Chunks are divided internally into layers.
 */
  export default class Chunk extends Positionable {

    /** Identifier */
      readonly id:string

    /** Sprite */
      readonly sprite:ReturnType<typeof Render.Container>

    /** Chunk data */
      readonly data:ChunkData

    /** Constructor */
      constructor({id, data, world}:{id:string, data:ChunkData, world:World}) {
        super({world})
        this.id = id
        this.data = data
        this.width = this.height = CHUNK_SIZE
        ;[this.x, this.y] = this.id.split(";").map(n => Number(n)*CHUNK_SIZE)
        this.sprite = world.sprite.addChild(Render.Container({x:this.x, y:this.y}))
        console.debug(`loaded chunk: ${this.id}`)
        this.render()
      }

      readonly layers = new Map()


      //"01-ground", "02-ground", "03-ground", "11-elements", "12-elements", "13-elements"

    /** Render */
      async render({force = false}:{force?:boolean} = {}) {
        //
          for (const name of ["01-ground", "02-ground", "03-ground", "11-elements", "12-elements", "13-elements"]) {
            //Load layer sprite
              const tiles = this.data?.layers?.[name]
              if (!tiles)
                continue
              if (this.layers.has(name))
                continue
              this.layers.set(name, this.sprite.addChild(Render.Container()))
              const layer = this.layers.get(name)
            //Draw tiles
              for (let i = 0; i < tiles.length; i++) {
                const tile = tiles[i]
                if (tile >= 0) {
                  const y = i%CHUNK_SIZE, x = Math.floor(i/CHUNK_SIZE)
                  layer.addChild(Render.Sprite({frame:tile, x, y}))
                }
              }





          }
        //
          this.sprite.addChild(Render.Graphics({text:this.id, textStyle:{fontSize:12, fill:"white"}, stroke:[1, 0x0000FF, 0.5], fill:[0x0000FF, .25], rect:[0, 0, this.width, this.height]}))
      }


  }

;(async () => {
  console.log("============================")
  await Render.setup()

  const world = new World()

  console.log(Render.app.view)

  let timeout = null

  Render.app.view.addEventListener("wheel", event => {
    event.preventDefault()
    world.sprite.position.x -= event.deltaX
    world.sprite.position.y -= event.deltaY
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      world.load()
    }, 500)
  })

})()

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