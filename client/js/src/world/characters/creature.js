//Imports
  import NPC from "./npc.js"
  import App from "../../app/app.js"

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
          this.sprite = new PIXI.AnimatedSprite(Creature.textures({species}))
          this.world.layers.global.characters.addChild(this.sprite)
          this.sprite.animationSpeed = 0.125
          this.sprite.anchor.set(0.5, 1)
          this.sprite.play()
          this.x = x
          this.y = y
          this.world.app.tween.fade({target:this.sprite, from:0, to:1, duration:15})
        //Lifetime
          this.lifetime = 16 + Math.floor(16*Math.random())
      }

    //Textures
      static textures({species}) { return App.loader.renderer.resources["/maps/creatures/creatures.json"].data.animations[species].map(PIXI.Texture.from) }

    //Wander
      wander() {
        //Prepare movement
          const {x, y} = this
          const {dx, dy} = [{dx:0, dy:0}, {dx:-1, dy:0}, {dx:+1, dy:0}, {dx:0, dy:-1}, {dx:0, dy:+1}][Math.floor(Math.random()/0.25)]
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
            this.world.app.tween.fade({target:this.sprite, from:1, to:0, duration:15, callback:() => this.destroy()})
          }    
      }

  }
