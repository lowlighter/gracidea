//Imports
  import { Render } from "../render/render.ts"
  import { Renderable } from "./renderable.ts"
  import { TILE_SIZE, CHUNK_SIZE, global } from "../render/settings.ts"
  import type { World } from "./world.ts"
  import { Chunk } from "./chunk.ts"
  import { App } from "./../app.ts"

/**
 * World camera.
 * An object used to find global position and choose which section of world to render.
 */
  export class Camera extends Renderable {

    /** Sprite */
      readonly sprite:ReturnType<typeof Render.Container>

    /** Constructor */
      constructor({world}:{world:World}) {
        super({world})
        this.sprite = this.world.sprites.world.addChild(Render.Container())
        Object.defineProperties(this, {
          x:{
            get:() => Math.floor((-this.world.sprites.world.position.x+global.document.body.clientWidth/2)/TILE_SIZE),
            set:x => this.moveTo({x, y:this.y}),
          },
          y:{
            get:() => Math.floor((-this.world.sprites.world.position.y+global.document.body.clientHeight/2)/TILE_SIZE),
            set:y => this.moveTo({x:this.x, y}),
          }
        })
        this.render()
      }

    /** Throttle rendering */
      private throttle = false

    /** Debounce rendering */
      private debounce = false

    /** Debug sprite */
      debug() {
        if (!this._debug)
          this._debug = this.world.sprites.debug.addChild(Render.Graphics({fill:[0xFF0000, .5], rect:[0, 0, 1, 1]}))
        return super.debug(App.debug.camera)
      }

    /** Render */
      render({DX = 1, DY = 1, DM = 3}:{DX?:number, DY?:number, DM?:number} = {}) {
        //Handle throttle and debouncing
          if (this.throttle) {
            this.debounce = true
            return
          }
          this.throttle = true
        //Debug
          this.debug()
        //Extract current tile and chunk positions
          const {x, y} = this
          const X = Math.floor(x/CHUNK_SIZE)
          const Y = Math.floor(y/CHUNK_SIZE)
        //Load and render visible chunks
          const visible = [] as string[]
          for (let x = X-DX; x <= X+DX; x++)
            for (let y = Y-DY; y <= Y+DY; y++)
              visible.push(`${x};${y}`)
          visible.forEach(id => {
            if (!this.world.loaded.chunks.has(id))
              this.world.loaded.chunks.set(id, new Chunk({id, world:this.world}))
            this.world.loaded.chunks.get(id)?.show()
          })
        //Hide not visible chunks and unload far away chunks
          this.world.loaded.chunks.forEach((chunk, id) => {
            if (!visible.includes(id)) {
              chunk.hide()
              if (Math.sqrt((chunk.x-X)**2+(chunk.y-Y)**2) > DM) {
                this.world.loaded.chunks.delete(id)
                chunk.destructor()
              }
            }
          })
        //Load and render visible areas
          const areas = new Set()
          this.world.loaded.chunks.forEach(chunk => chunk.areas.forEach(area => areas.add(area)))
        //Unload unrevelant areas
          this.world.loaded.areas.forEach((area, id) => {
            if (!areas.has(area)) {
              this.world.loaded.areas.delete(id)
              area.destructor()
            }
          })
        //Update controller data
          this.world.app?.controller?.updateDOM()
        //Handle throttle and debouncing
          setTimeout(() => {
            this.throttle = false
            if (this.debounce) {
              this.debounce = false
              this.render()
            }
          }, 200)
      }

    /** Current location */
      get location() {
        return [...this.world.loaded.areas.values()].filter(area => ((area.data.type === "locations")||(area.data.type === "regions"))&&(area.contains(this))).map(({data}) => data.name)
      }

    /** Move camera to given position */
      moveTo({x, y}:{x:number, y:number}) {
        this.world.sprites.world.position.set(-x*TILE_SIZE + global.document.body.clientWidth/2, -y*TILE_SIZE + global.document.body.clientHeight/2)
        this.render()
      }

  }