//Imports
  import { Render } from "../render/render.ts"
  import { Renderable } from "./renderable.ts"
  import { CHUNK_SIZE, TILE_SIZE } from "../render/settings.ts"
  import type { World } from "./world.ts"

  export class NPC extends Renderable {

    /** Sprite */
      readonly sprite:ReturnType<typeof Render.Container>

    /** Sprites */
      readonly sprites:{
        main:ReturnType<typeof Render.Sprite>
        mask:ReturnType<typeof Render.Graphics>|null
      }

      readonly offset = {x:0, y:0}

    /** Constructor */
      constructor({world}:{world:World}) {
        super({world})
        this.sprite = Render.Container()
        this.sprites = {main:this.sprite.addChild(Render.Sprite({frame:"regular/abra", anchor:[0.5, 1]})), mask:null}

        console.debug(`loaded npc:`)
        this.x = 1
        this.y = -2
        this.wander()
      }

      async wander() {
        console.log("next!")
        const {dx, dy} = [{dx:0, dy:0}, {dx:-1, dy:0}, {dx:+1, dy:0}, {dx:0, dy:-1}, {dx:0, dy:+1}][Math.floor(Math.random()/0.2)]
        this.x += dx
        this.y += dy
      }

      render() {
        const chunk = this.world.chunkAt(this)
        if (chunk) {
          const rx = this.x-chunk.x, ry = this.y-chunk.y
          this.sprite.position.set((rx+0.5)*TILE_SIZE+this.offset.x, (ry+1)*TILE_SIZE+this.offset.y)

          chunk?.layers.get("2X")?.addChild(this.sprite)
          this.sprite.zIndex = ry*CHUNK_SIZE
          console.log(chunk.tileEnvAt(this))

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
