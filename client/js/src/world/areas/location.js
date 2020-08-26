//Imports
  import Area from "./area.js"

/**
 * World location area.
 */
  export default class Location extends Area {

    //Debug
      static debug = {
        //Debug color
          color:0x00FFFF,
        //Debug opacity
          opacity:.25,
      }

    //Location
      get location() {
        const key = this.name
        const name = this.world.app.data.lang.map.locations[key]
        return {key, name}
      }

    //Update
      async update() {
        //Heritage
          await super.update(...arguments)
        //Update location if needed
          const {user} = this.world.app.data
          const position = {x:user.position.x+this.world.origin.x, y:user.position.y+this.world.origin.y}
          if (this.inside(position))
            user.location = this.location
        //Reset location if outside but previous key still reference this location
          else if (user.location.key === this.key)
            user.location = {}
      }

  }
