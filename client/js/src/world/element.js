/** 
 * World element.
 * 
 * An object with coordinates and dimensions.
 */
  export default class Element {

    //Origin point (top-left tile)
      origin = {x:Infinity, y:Infinity}

    //Boundary point (bottom-right tile)
      boundary = {x:-Infinity, y:-Infinity}

    //X coordinate (alias for origin.x)
      get x() { return this.origin.x }

    //Y coordinate (alias for origin.y)
      get y() { return this.origin.y }

    //Chunk width 
      get width() { return Math.abs(this.boundary.x - this.origin.x) }

    //Chunk height
      get height() { return Math.abs(this.boundary.y - this.origin.y) }

  }