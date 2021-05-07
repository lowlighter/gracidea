//Imports
  import { Render } from "../render/render.ts"
  import { Renderable } from "./renderable.ts"
  import { CHUNK_SIZE, TILE_SIZE } from "../render/settings.ts"
  import type { World } from "./world.ts"
  import type { Area } from "./area.ts"
  import { App } from "./../app.ts"

/** Patterns */
  const enum Pattern {
    patrol = "patrol",
    loop = "loop",
    wander = "wander",
    fixed = "fixed",
    lookaround = "lookaround",
  }

/** Types */
  export const enum Type {
    people = "people",
    creatures = "creatures",
  }

/** Read-write */
//deno-lint-ignore no-explicit-any
  type rw = any

/**
 * NPC
 */
  export class NPC extends Renderable {

    /** Sprite */
      readonly sprite:ReturnType<typeof Render.Container>

    /** Sprites */
      readonly sprites:{
        main:ReturnType<typeof Render.Sprite>
        mask:ReturnType<typeof Render.Graphics>|null
        shadow:ReturnType<typeof Render.Graphics>|null
      }

    /** Offset */
      readonly offset = {x:0, y:0}

    /** Area */
      readonly area:Area

    /** Track */
      private readonly track = [] as number[]

    /** Track index */
      private _track_index = 0

    /** Track pattern */
      readonly pattern = "wander" as Pattern

    /** Frame */
      readonly frame:string

    /** Type */
      readonly type:Type

    /** Constructor */
      constructor({world, area, type, frame}:{world:World, area:Area, type:Type, frame:string}) {
        super({world})
        this.area = area
        this.frame = frame
        this.type = type
        this.sprite = Render.Container()
        if (type === Type.people)
          frame = `${frame}_down_0`
        this.sprites = {
          main:this.sprite.addChild(Render.Sprite({frame, anchor:[0.5, 1]})),
          mask:null,
          shadow:null
        }
        if (App.debug.logs)
          console.debug(`loaded npc:`)
        this.computeSpawn()
        this.computePattern()
        this.area.npcs.add(this)
      }

    /** Compute spawn point */
      private computeSpawn() {
        this.x = this.area.polygon.points[0]/TILE_SIZE
        this.y = this.area.polygon.points[1]/TILE_SIZE
        for (const {dx, dy} of [{dx:-1, dy:-1}, {dx:0, dy:-1}, {dx:+1, dy:-1}, {dx:-1, dy:0}, {dx:+1, dy:0}, {dx:-1, dy:+1}, {dx:0, dy:+1}, {dx:+1, dy:+1}]) {
          this.x += dx
          this.y += dy
          if (this.area.contains(this))
            break
        }
      }

    /** Compute pattern */
      private computePattern() {
        if ((this.pattern === "loop")||(this.pattern === "patrol")) {
          //Compute track
            const points = this.area.polygon.points.map((n:number) => n/TILE_SIZE) as number[]
            points.push(points[0], points[1])
            ;(this as rw).track = [points[0], points[1]]
            for (let i = 2; i < points.length; i+=2) {
              const [px, py, nx, ny] = [points[i-2], points[i-1], points[i], points[i+1]]
              const dx = nx - px
              const dy = ny - py
              let [x, y] = [px, py]
              for (let j = 0; j < Math.abs(dx); j++)
                this.track.push(x+=Math.sign(dx), y)
              for (let j = 0; j < Math.abs(dy); j++)
                this.track.push(x, y+=Math.sign(dy))
            }
          //Push reversed track on patrol
            if (this.pattern === "patrol") {
              const points = this.track.slice()
              for (let i = points.length-4; i > 0; i-=2)
                this.track.push(points[i], points[i+1])
            }
          //Remove duplicated cell on loop
            if ((this.pattern === "loop")&&(this.track[0] === this.track[this.track.length-2])&&(this.track[1] === this.track[this.track.length-1])) {
              this.track.pop()
              this.track.pop()
            }
        }
      }

    /** Render */
      render() {
        const chunk = this.world.chunkAt(this)
        if (chunk) {
          const rx = this.x-chunk.x, ry = this.y-chunk.y
          this.sprite.position.set((rx+0.5)*TILE_SIZE+this.offset.x, (ry+1)*TILE_SIZE+this.offset.y)

          chunk?.layers.get("2X")?.addChild(this.sprite)
          this.sprite.zIndex = ry*CHUNK_SIZE

        /* switch (chunk.tileEnvAt(this)) {
            case "WATER":{
              if (!this.sprites.mask) {
                const mask = Render.Graphics({rect:[-2, -0.5, 4, -0.5], fill:[0, 0.5]})
                this.sprite.addChild(mask)
                this.sprites.main.mask = this.sprites.mask = mask
              }
              break
            }
            default:
              this.sprites.mask = null
          }*/

        }

        if (!this.sprites.shadow) {
          const shadow = Render.Graphics({fill:[0, 0.5], ellipse:[0, 0, 2/3, 2/4]})
          this.sprites.shadow = this.sprite.addChildAt(shadow, 0)
        }


      }

    /** Update */
      update(tick:number) {
        if (Number.isInteger(tick)) {
          this[this.pattern]()
          this.render()
        }
      }

    /** Fixed */
      private fixed() {}

    /** Loop (follow track and loop over) */
      private loop() {
        this._track_index = (this._track_index+2)%this.track.length
        this.x = this.track[this._track_index]
        this.y = this.track[this._track_index+1]
      }

    /** Patrol (follow track and reverse) */
      private patrol() {
        this.loop()
      }

    /** Wander */
      private wander() {
        ([() => this.goLeft(), () => this.goRight(), () => this.goUp(), () => this.goDown()][Math.floor(Math.random()/0.25)])()
      }

    /** Lookaround */
      private lookaround() {
        ([() => this.lookLeft(), () => this.lookRight(), () => this.lookUp(), () => this.lookDown()][Math.floor(Math.random()/0.25)])()
      }

    /** Texture */
      private texture(suffix?:string) {
        const frame = `${this.frame}${suffix ? `_${suffix}` : ""}`
        if (frame in Render.cache)
          this.sprites.main.texture = Render.Texture({frame})
      }

    /** Look left */
      private lookLeft() {
        this.texture("left_0")
      }

    /** Go left */
      private goLeft() {
        if (this.area.contains({x:this.x-1, y:this.y})) {
          this.x--
          this.lookLeft()
        }
      }

    /** Look right */
      private lookRight() {
        this.texture("right_0")
      }

    /** Go right */
      private goRight() {
        if (this.area.contains({x:this.x+1, y:this.y})) {
          this.x++
          this.lookRight()
        }
      }

    /** Look up */
      private lookUp() {
        this.texture("up_0")
      }

    /** Go up */
      private goUp() {
        if (this.area.contains({x:this.x, y:this.y-1})) {
          this.y--
          this.lookUp()
        }
      }

    /** Look down */
      private lookDown() {
        this.texture("down_0")
      }

    /** Go down */
      private goDown() {
        if (this.area.contains({x:this.x, y:this.y+1})) {
          this.y++
          this.lookDown()
        }
      }



      /*environment(mode) {
        switch (mode) {
          case "air":{
            //Apply vertical offset
              this.offset.y = -.30
              if (this.area.water)
                this.offset.y *= 2
              //Shadow
                const mask = new PIXI.Graphics().beginFill(0x000000, 0.5).drawEllipse(0, -u.to.coord.px(this.offset.y), this.sprite.width/3, this.sprite.height/4).endFill()
                this.sprite.addChild(mask)
          }
        }
      }*/

  }
