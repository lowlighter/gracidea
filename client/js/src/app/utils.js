//Imports
  import World from "./../world/world.js"

/** 
 * Utilitaries functions.
 */
  export default {

    //Basename
      basename({path, extension}) { return path.substring(1+path.lastIndexOf("/")).replace(/(\..+?)$/, extension ? "$1" : "") },

    //Map get or set
      mget({map, key, create}) { return (!map.has(key) && map.set(key, create(key))), map.get(key) },

    //Compute distance between two points
      dist(a, b) { return Math.sqrt((b.x - a.x)**2 + (b.y - a.y)**2) },

    //Converters
      to:{
        //Coordinates
          coord:{
            //Pixels
              px(c) { return c*World.Chunk.tile.size },
            //Tiles
              tile(c) { return Math.floor(c/World.Chunk.tile.size) },
          }
      },
      
    //Sync two objects
      sync({a, b}) {
        for (let key in b)
          a[key] = b[key]
      },

    //Shuffle an array
      shuffle(array) {
        array = [...array]
        for (let i = array.length - 1, j = 0; i > 0; i--) 
          [array[i], array[(j = Math.floor(Math.random() * (i + 1)))]] = [array[j], array[i]]
        return array
      },

    //Generate a random number
      rand({a = 0, b = 1, int = false} = {}) {
        const rand = a + Math.random()*(b-a)
        return int ? Math.floor(rand) : rand 
      },
  }