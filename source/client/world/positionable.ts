//Imports
  import type { World } from "./world.ts"

/**
 * World positionable element.
 * An object with coordinates and dimensions.
 */
  export abstract class Positionable {

    /** World */
      private readonly world:World

    /** X coordinate */
      x:number

    /** Y coordinate */
      y:number

    /** Width */
      width:number

    /** Height */
      height:number

    /** Constructor */
      protected constructor({world, x = 0, y = 0, width = 0, height = 0}:{world:World, x?:number, y?:number, width?:number, height?:number}) {
        this.world = world
        this.x = x
        this.y = y
        this.width = width
        this.height = height
      }

  }