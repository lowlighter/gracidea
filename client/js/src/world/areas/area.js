//Imports
  import u from "../../app/utils.js"
  import Element from "../element.js"

/**
 * World area.
 */
  export default class Area extends Element {

    //Constructor
      constructor({world, key}) {
        //Heritage
          super(...arguments)
        //References
          this.key = key
          this.world = world
        //Sprite creation
          this.sprite = new PIXI.Container()
          this.sprite.visible = false
          this.world.layers.global.areas.addChild(this.sprite)
      }

    //Load
      async load({object:data}) {
        //Load data
          const {polygon, x:X, y:Y, width, height, properties = []} = data
          let points = polygon
          //Rectangle
            if (!polygon)
              points = [{x:0, y:0}, {x:width, y:0}, {x:width, y:height}, {x:0, y:height}]
        //Save properties
          this.name = data.name
          if (this.name.length) {
            if (!Area.shared.properties.has(`${this.constructor.name}#${this.name}`))
              Area.shared.properties.set(`${this.constructor.name}#${this.name}`, {})
            this.properties = Area.shared.properties.get(`${this.constructor.name}#${this.name}`)
          }
          else
            this.properties = {}
          properties.map(({name, value}) => this.properties[name] = value)
        //Update data origin and boundary
          const xs = points.map(point => u.to.coord.tile(X+point.x)), ys = points.map(point => u.to.coord.tile(Y+point.y))
          this.origin = {x:Math.min(...xs), y:Math.min(...ys)}
          this.boundary = {x:Math.max(...xs), y:Math.max(...ys)}
        //Save polygon definition (Note : all polygons points are positive)
          const dx = u.to.coord.tile(X)-this.origin.x
          const dy = u.to.coord.tile(Y)-this.origin.y
          this.area = {
            tiled:points.map(point => [u.to.coord.tile(X+point.x), u.to.coord.tile(Y+point.y)]),
            px:points.map(point => [u.to.coord.px(dx)+point.x, u.to.coord.px(dy)+point.y]),
            size:0,
          }
        //Compute polygon area
          let total = 0
          for (let i = 0, vertices = this.area.tiled; i < vertices.length; i++)
            total += (vertices[i][0] * vertices[i == vertices.length - 1 ? 0 : i + 1][1] * 0.5) - (vertices[i == vertices.length - 1 ? 0 : i + 1][0] * vertices[i][1] * 0.5)
          this.area.size = Math.abs(total)
        //Update sprite
          this.sprite.position.set(u.to.coord.px(this.origin.x), u.to.coord.px(this.origin.y))
      }

    //Check if point is inside area
      inside({x, y}) {
        //Ray-casting algorithm based on http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
          const vertices = this.area.tiled
          let inside = false
          for (let i = 0, j = vertices.length-1; i < vertices.length; j = i++) {
            const xi = vertices[i][0], yi = vertices[i][1]
            const xj = vertices[j][0], yj = vertices[j][1]
            if (((yi > y) !== (yj > y))&&(x < (xj - xi) * (y - yi) / (yj - yi) + xi))
              inside = !inside
          }
          return inside
      };

    //Render
      async render() {
        //Clean
          if (this.sprite.children.length)
            this.sprite.removeChildren()
        //Debug
          if ((this.world.app.data.debug.areas)&&(this.constructor.debug)) {
            //Draw graphics
              this.graphics = this.sprite.addChild(new PIXI.Graphics())
              this.graphics.lineStyle(1, this.constructor.debug.color, this.constructor.debug.opacity).beginFill(this.constructor.debug.color, this.constructor.debug.opacity).drawPolygon(this.area.px.flat()).endFill()
              this.sprite.visible = true
            //Polygon points
              const points = this.area.px
              for (let i = 0; i < points.length; i++) {
                const point = this.graphics.addChild(new PIXI.Text(i, {fontSize:9}))
                point.position.set(points[i][0], points[i][1])
                point.anchor.set(0.5)
              }
            //Name
              const name = this.graphics.addChild(new PIXI.Text(`[${this.key}]`, {fontSize:12, fontWeight:"bold"}))
              name.position.set(points.reduce((X, [x, y]) => X + x, 0)/points.length, points.reduce((Y, [x, y]) => Y + y, 0)/points.length)
              name.anchor.set(0.5)
          }
      }

    //Update
      async update({center, radius}) {
        //Reset if too far
          const {xa, ya, xb, yb} = {xa:this.origin.x-this.world.origin.x, ya:this.origin.y-this.world.origin.y, xb:this.boundary.x-this.world.origin.x, yb:this.boundary.y-this.world.origin.y}
          if (Math.min(u.dist(center, {x:xa, y:ya}), u.dist(center, {x:xb, y:yb})) > radius)
            return this.reset()
        //Create if needed
          if (!this.created)
            this.create()
        //Render
          this.render()
      }

    //Create
      create() {}

    //Reset
      reset() {
        //Reset if created
          if (this.created) {
            //Clear sprite
              this.sprite.visible = false
              this.sprite.children.map(child => child.destroy())
              this.sprite.removeChildren()
            //Reset state
              this.created = false
          }
      }

    //Create area from
      static from({world, key, object}) {
        //Retrieve type
          const {type} = object
        //Wild area
          if (type === "wild")
            return new Area.Wild(...arguments)
        //Location area
          if (type === "location")
            return new Area.Location(...arguments)
        //Trainer area
          if (type === "trainer")
            return new Area.Trainer(...arguments)
        //General area
          return new Area({world, key})
      }

    //Shared
      static shared = {
        //Shared properties
          properties:new Map()
      }

  }