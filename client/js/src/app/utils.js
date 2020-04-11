//Imports
  import World from "./../world/world.js"

/** 
 * Utilitaires functions.
 */
  export default {
    //Basename
      basename({path, extension}) { return path.substring(1+path.lastIndexOf("/")).replace(/(\..+?)$/, extension ? "$1" : "") },
    //Map get or set
      mget({map, key, create}) { return (!map.has(key) && map.set(key, create(key))), map.get(key) },
    //Render coordinates
      rc(c) { return c*World.Chunk.tile.size },
    //Compute distance between two points
      dist(a, b) { return Math.sqrt((b.x - a.x)**2 + (b.y - a.y)**2) },
  }