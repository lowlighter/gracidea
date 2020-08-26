//Imports
  import NPC from "./npc.js"
  import App from "../../app/app.js"
  import u from "../../app/utils.js"

/**
 * Trainers.
 */
  export default class Trainer extends NPC {

    //Constructor
      constructor({categorie, x, y, area}) {
        //Heritage
          super(...arguments)
        //Reference
          this.categorie = categorie
          this.area = area
        //Sprite creation
          this.sprite = new PIXI.AnimatedSprite(Trainer.textures({endpoint:this.world.app.endpoints.maps, categorie}))
          this.world.layers.global.characters.addChild(this.sprite)
          this.sprite.animationSpeed = 0.25
          this.sprite.anchor.set(0.5, 1)
          this.sprite.play()
          this.x = x
          this.y = y
        //Track computation
          if ((this.path === "loop")||(this.path === "patrol")) {
            //Prepare track
              const vertices = JSON.parse(JSON.stringify(this.area.area.tiled))
              vertices.push(vertices[0])
              this.track = [vertices[0]]
            //Compute track
              for (let i = 1; i < vertices.length; i++) {
                const [px, py] = vertices[i-1]
                const [nx, ny] = vertices[i]
                const dx = nx - px
                const dy = ny - py
                let [cx, cy] = [px, py]
                for (let j = 0; j < Math.abs(dx); j++)
                  this.track.push([cx+=Math.sign(dx), cy])
                for (let j = 0; j < Math.abs(dy); j++)
                  this.track.push([cx, cy+=Math.sign(dy)])
              }
            //Push reversed array if patrol
              if (this.path === "patrol") {
                const reversed = JSON.parse(JSON.stringify(this.track)).reverse()
                reversed.shift()
                this.track.push(...reversed)
              }
            //Remove duplicated cell if loop
              if (this.path === "loop") {
                if ((this.track[0][0] === this.track[this.track.length-1][0])&&(this.track[0][1] === this.track[this.track.length-1][1]))
                  this.track.pop()
              }
          }
          else
            this.track = [[x, y]]
          this.track = this.track.map(([x, y]) => ({x, y}))
          this.track.index = 0
      }


    //Textures
      textures({direction}) {
        return Trainer.textures({endpoint:this.world.app.endpoints.maps, categorie:this.categorie, direction})
      }

    //Textures
      static textures({endpoint = "", categorie, direction = "down"}) {
        const key = `${categorie}_${direction}`
        const textures = App.loader.renderer.resources[`${endpoint}/trainers/textures.json`].data
        return textures.animations[key]?.map(PIXI.Texture.from) ?? [`${key}_0` in textures.frames ? PIXI.Texture.from(`${key}_0`) : PIXI.Texture.EMPTY]
      }

    //Move
      go = {
        //Left
          left:() => {
            this.look.left()
            this.world.app.tween.property({target:this, change:"x", from:this.x, to:this.x-1, duration:8})
          },
        //Right
          right:() => {
            this.look.right()
            this.world.app.tween.property({target:this, change:"x", from:this.x, to:this.x+1, duration:8})
          },
        //Up
          up:() => {
            this.look.up()
            this.world.app.tween.property({target:this, change:"y", from:this.y, to:this.y-1, duration:8})
          },
        //Down
          down:() => {
            this.look.down()
            this.world.app.tween.property({target:this, change:"y", from:this.y, to:this.y+1, duration:8})
          }
      }

    //Look
      look = {
        //Left
          left:() => {
            this.sprite.textures = this.textures({direction:"left"})
          },
        //Right
          right:() => {
            this.sprite.textures = this.textures({direction:"right"})
          },
        //Up
          up:() => {
            this.sprite.textures = this.textures({direction:"up"})
          },
        //Down
          down:() => {
            this.sprite.textures = this.textures({direction:"down"})
          }
      }

    //Move
      move(to) {
        //Prepare movement
          const {x, y} = this
          const dx = to.x - x
          const dy = to.y - y
        //Move
          if (dx || dy) {
            if (dx < 0)
              this.go.left()
            if (dx > 0)
              this.go.right()
            if (dy < 0)
              this.go.up()
            if (dy > 0)
              this.go.down()
          }
      }

    //Wander
      wander() {
        //Prepare movement
          const {x, y} = this
          const {dx, dy} = [{dx:0, dy:0}, {dx:0, dy:0}, {dx:0, dy:0}, {dx:0, dy:0}, {dx:-1, dy:0}, {dx:+1, dy:0}, {dx:0, dy:-1}, {dx:0, dy:+1}][Math.floor(u.rand()/0.125)]
        //Move if still inside forced area
          if ((dx || dy)&&(this.area.inside({x:x+dx, y:y+dy})))
            this.move({x:x+dx, y:y+dy})
      }

    //Look around
      lookaround() {
        //Prepare movement
          const {dx, dy} = [{dx:0, dy:0}, {dx:0, dy:0}, {dx:0, dy:0}, {dx:0, dy:0}, {dx:-1, dy:0}, {dx:+1, dy:0}, {dx:0, dy:-1}, {dx:0, dy:+1}][Math.floor(u.rand()/0.125)]
        //Move if still inside forced area
          if (dx || dy) {
            if (dx < 0)
              this.look.left()
            if (dx > 0)
              this.look.right()
            if (dy < 0)
              this.look.up()
            if (dy > 0)
              this.look.down()
          }
      }

    //Patrol (follow path and reverse)
      patrol() {
        //Move on track
          this.loop()
      }

    //Loop (follow path and loop)
      loop() {
        //Move on track
          this.track.index = (++this.track.index)%this.track.length
          this.move(this.track[this.track.index])
      }

    //Path
      get path() {
        return this.area.properties.path ?? "fixed"
      }

    //Update
      update() {
        //Wander
          if (this.path === "wander")
            this.wander()
        //Lookaround
          if (this.path === "lookaround")
            this.lookaround()
        //Loop
          if (this.path === "loop")
            this.loop()
        //Patrol
          if (this.path === "patrol")
            this.patrol()
        //Fixed
          if (this.path === "fixed")
            null
      }

  }
