/** 
 * Creatures.
 */
  export default class Creature {
    //Constructor
      constructor({species}) {
        this.species = species
        this.sprite = new PIXI.AnimatedSprite([0, 1].map(i => `${species}_${i}`))
      }
  }
