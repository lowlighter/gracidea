//Imports
  import u from "./../app/utils.js"

/** 
 * World Data.
 */
  export default class Data {
    //Constructor
      constructor({world, key}) {
        //references
          this.key = key
          this.world = world
        //Sprite creation
          this.sprite = new PIXI.Container()
      }
      
    //Load
      async load({object:data}) {
        //Load data
          const {polygon:points, x:X, y:Y, properties} = data
        //Save properties
          this.properties = {}
          properties.map(({name, value}) => this.properties[name] = value)
        //Save polygon definition
          this.polygons = {
            tiled:new PIXI.Polygon(points.map(({x, y}) => { return {x:u.to.coord.tile(X+x), y:u.to.coord.tile(Y+y)} })),
            points:points.flatMap(point => [point.x, point.y])
          }
        //Update sprite
          this.sprite.position.set(X, Y)
      }

    //Render
      async render() {
        //Draw graphics
          this.sprite.removeChildren()
          this.graphics = this.sprite.addChild(new PIXI.Graphics())
          this.graphics.beginFill(0xFF0000, .5).drawPolygon(this.polygons.points).endFill()
          this.world.layers.global.data.addChild(this.sprite)
      }
  }