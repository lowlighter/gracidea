/** 
 * Quadtree structure.
 * 
 * This is used to speed computations for dimensional elements.
 * Chunks rendering are optimized through this to know which chunks needs to be rendered based on current camera position.
 * It also improves collisions calculations.
 * 
 * This is a port from https://github.com/lowlighter/quadtree
 */
  export default class Quadtree {
  
    //Constructor
      constructor({x = 0, y = 0, width = 400, height = 400, parent = null, max = {items:20, depth:20}} = {}) {
        //Initialize parameters
          this.resize({x, y, width, height, rebuild:false})
          this.parent = parent
          this.nodes = [null, null, null, null]
          this.items = {
            node:new Set(), //Items in current node
            all:new Set(),  //Items in current node and its childrent
          }
        //Compute attributes from parent
          if (this.parent) 
            (this.max = this.parent.max, this.depth = this.parent.depth+1)
          else 
            (this.max = max, this.depth = 0)
      }

    //Is leaf
      get leaf() { return this.nodes[0] === null }

    //Is root
      get root() { return this.depth === 0 }

    //Size
      get size() { return this.items.all.size }

    //Insert value
      add(value) {
        //Check properties
          if ([value.x, value.y, value.width, value.height].filter(Number.isFinite).length < 4) 
            throw new Error(`Cannot add value to quadtree, missing coordinates or dimensions`)
        //Reference
          this.items.all.add(value)
        //Insertion if leaf
          if (this.leaf) {
            this.items.node.add(value)
            //Split if max capacity reached
              if ((this.items.node.size > this.max.items)&&(this.depth < this.max.depth)) 
                this.split()
          } 
        //Propagate if parent
          else 
            this.index(value).forEach(index => this.nodes[index].add(value))
      }

    //Delete value
      delete(value) {
        //Reference
          this.items.all.delete(value)
        //Deletion if leaf
          if (this.leaf) 
            this.items.node.delete(value)
        //Propagate if parent
          else 
            this.index(value).forEach(index => this.nodes[index].delete(value))
      }

    //Get values contained in given area
      get(area, {list = new Set(), exclude = null} = {}) {
        //Add values from leaf if leaf
          if (this.leaf) {
            this.items.node.forEach(value => list.add(value))
            //Remove excluded value if needed
              if (exclude)
                exclude.forEach(excluded => list.delete(excluded))
          }
        //Propagate if parent
          else 
            this.index(area).forEach(index => this.nodes[index].get(area, {list, self}))
        return list
      }

    //Index
      index({x, y, width, height}) {
        //Compute indexes
          const v = y + height < (this.y + this.height/2) ? "N" : y > (this.y + this.height/2) ? "S" : "B"
          const h = x + width  < (this.x + this.width /2) ? "W" : x > (this.x + this.width /2) ? "E" : "B"
        return Quadtree.INDEXES[v+h]
      }

    //Clear quadtree
      clear({soft = false} = {}) {
        //Clear all items if hard clear
          if (!soft)
            this.items.all.clear()
        //Clear items in node
          this.items.node.clear()
        //Clear children nodes
          if (!this.leaf)
            this.nodes.forEach(node => node.clear())
        //Clear all references if not root
          if (!this.root)
            this.items = this.parent = this.nodes = null
        //Clear children references
          else
            this.nodes = [null, null, null, null]
      }

    //Rebuild instance
      rebuild() {
        //Clear if root
          if (this.root) {
            this.clear({soft:true})
            this.items.all.forEach(value => this.add(value))
          }
        return this
      }

    //Resize quadtree
      resize({x, y, width, height, rebuild}) {
        //Resize quadtree
          this.x = x
          this.y = y
          this.width = width
          this.height = height
        //Rebuild if needed
          if (rebuild)
            this.rebuild()
        return this
      }

    //Split into child nodes
      split() {
        //Split if leaf
          if (this.leaf) {
            //Instantiate four children
              const {x, y} = this, width = this.width/2, height = this.height/2
              for (let [index, args] of Object.entries({[Quadtree.INDEX.NW]:{width, height, x, y}, [Quadtree.INDEX.NE]:{width, height, x:x+width, y}, [Quadtree.INDEX.SE]:{width, height, x:x+width, y:y+height}, [Quadtree.INDEX.SW]:{width, height, x, y:y+height}})) 
                this.nodes[index] = new Quadtree({parent:this, ...args})
            //Delegate values
              this.items.node.forEach(value => this.add(value))
              this.items.node.clear()
          }
      }

    //Index
      static INDEX = {NW:0, NE:1, SE:2, SW:3}

    //Indexes
      static INDEXES = {NW:[0], NE:[1], SE:[2], SW:[3], BE:[1, 2], BW:[0, 3], NB:[0, 1], SB:[2, 3], BB:[0, 1, 2, 3]}

  }
