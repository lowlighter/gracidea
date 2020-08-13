//Imports
  import NPC from "./npc.js"
  import App from "../../app/app.js"
  import u from "../../app/utils.js"

/**
 * Creatures.
 */
  export default class Creature extends NPC {

    //Constructor
      constructor({species, x, y, area}) {
        //Heritage
          super(...arguments)
        //Reference
          this.species = species
          this.area = area
        //Sprite creation
          this.sprite = new PIXI.AnimatedSprite(Creature.textures({endpoint:this.world.app.endpoints.maps, species}))
          this.world.layers.global.characters.addChild(this.sprite)
          this.sprite.animationSpeed = 0.125
          this.sprite.anchor.set(0.5, 1)
          this.sprite.play()
          this.x = x
          this.y = y
          this.world.app.tween.fade({target:this.sprite, from:0, to:1, duration:16})
        //Lifetime
          this.lifetime = u.rand({a:16, b:32, int:true})
        //Special processing if in water
          if (this.area.water)
            this.in.water()
      }

    //Textures
      static textures({endpoint = "", species}) { return App.loader.renderer.resources[`${endpoint}/creatures/textures.json`].data.animations[species].map(PIXI.Texture.from) }

    //Wander
      wander() {
        //Prepare movement
          const {x, y} = this
          const {dx, dy} = [{dx:0, dy:0}, {dx:-1, dy:0}, {dx:+1, dy:0}, {dx:0, dy:-1}, {dx:0, dy:+1}][Math.floor(u.rand()/0.25)]
        //Move if still inside forced area
          if ((dx || dy)&&(this.area.inside({x:x+dx, y:y+dy}))) {
            if (dx) {
              this.world.app.tween.property({target:this, change:"x", from:this.x, to:this.x+dx, duration:8})
              this.sprite.scale.x = -Math.sign(dx)
            }
            if (dy) {
              this.world.app.tween.property({target:this, change:"y", from:this.y, to:this.y+dy, duration:8})
            }
          }
      }

    //Update
      update() {
        //Update lifetime
          if (this.lifetime-- > 0) {
            //Wander
              this.wander()
          }
        //End of life
          else {
            this.area.creatures.delete(this)
            this.world.app.tween.fade({target:this.sprite, from:1, to:0, duration:32, callback:() => this.destroy()})
          }
      }

    //Special processing when inside
      in = {
        //When inside water
          water:() => {
            //Apply mask
              const mask = new PIXI.Graphics().beginFill(0x000000).drawRect(-this.sprite.width/2, -this.sprite.height, this.sprite.width, this.sprite.height-12).endFill()
              this.sprite.addChild(mask)
              this.sprite.mask = mask
          }
      }

  }
