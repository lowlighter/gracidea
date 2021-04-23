//Imports
  import { Render } from "../render/render.ts"
  import { Renderable } from "./renderable.ts"
  import { CHUNK_SIZE, TILE_SIZE } from "../render/settings.ts"
  import type { World } from "./world.ts"
  import type { Area } from "./area.ts"

  export class NPC extends Renderable {

    /** Sprite */
      readonly sprite:ReturnType<typeof Render.Container>

    /** Sprites */
      readonly sprites:{
        main:ReturnType<typeof Render.Sprite>
        mask:ReturnType<typeof Render.Graphics>|null
        shadow:ReturnType<typeof Render.Graphics>|null
      }

      readonly offset = {x:0, y:0}

      readonly area:Area

    /** Constructor */
      constructor({world, area}:{world:World, area:Area}) {
        super({world})
        this.sprite = Render.Container()
        this.sprites = {
          main:this.sprite.addChild(Render.Sprite({frame:"regular/mew", anchor:[0.5, 1]})),
          mask:null,
          shadow:null
        }
        console.debug(`loaded npc:`)
        this.area = area
        this.x = 1
        this.y = -2
        this.wander()
      }

      async wander() {
        console.log("next!")
        const {dx, dy} = [{dx:0, dy:0}, {dx:-1, dy:0}, {dx:+1, dy:0}, {dx:0, dy:-1}, {dx:0, dy:+1}][Math.floor(Math.random()/0.2)]
        if (this.area.contains({x:this.x+dx, y:this.y+dy})) {
          this.x += dx
          this.y += dy
          this.render()
        }
        setTimeout(() => this.wander(), 250)
      }

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
          //Shadow
          const shadow = Render.Graphics({fill:[0, 0.5], ellipse:[0, 0, this.sprites.main.width/TILE_SIZE/3, this.sprites.main.width/TILE_SIZE/4]})
          this.sprites.shadow = this.sprite.addChildAt(shadow, 0)
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
