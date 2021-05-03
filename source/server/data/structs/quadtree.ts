/** Quadtree indexes */
  const enum INDEX {
    NORTH_WEST = 0,
    NORTH_EAST = 1,
    SOUTH_EAST = 2,
    SOUTH_WEST = 3,
  }

/** Rectangle type */
  export type Rectangle = {x:number, y:number, width:number, height:number}

/**
 * Quadtree structure.
 * This is a typescript port from https://github.com/lowlighter/quadtree.
 */
  export class Quadtree<T extends Rectangle> {

    /** Parent quadtree */
      private readonly parent = null as Quadtree<T>|null

    /** Child quadtrees */
      private nodes = null as Array<Quadtree<T>>|null

    /** All items (node item, including children items) */
      readonly allItems = new Set<T>()

    /** Local items (node item) */
      private readonly nodeItems = new Set<T>()

    /** X coordinate */
      readonly x:number

    /** Y coordinate */
      readonly y:number

    /** Width */
      readonly width:number

    /** Height */
      readonly height:number

    /** Depth */
      readonly depth:number

    /** Max depth */
      readonly maxDepth = 100 as number

    /** Max items */
      readonly maxItems = 100 as number

    /** Constructor */
      constructor({x = 0, y = 0, width = 400, height = 400, parent = null, maxItems = 100, maxDepth = 100}:{x?:number, y?:number, width?:number, height?:number, parent?:Quadtree<T>|null, maxItems?:number, maxDepth?:number} = {}) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.depth = (this.parent?.depth ?? -1) + 1
        this.parent = parent
        this.maxItems = this.parent?.maxItems ?? maxItems
        this.maxDepth = this.parent?.maxDepth ?? maxDepth
      }

    /** Compute indexes of item */
      index({x, y, width, height}:Rectangle) {
        const ah = y + height
        const aw = x + width
        const bh = this.y + this.height/2
        const bw = this.x + this.width /2
        if (ah < bh) {
          if (aw < bw)
            return [INDEX.NORTH_WEST]
          if (aw > bw)
            return [INDEX.NORTH_EAST]
          return [INDEX.NORTH_WEST, INDEX.NORTH_EAST]
        }
        if (ah > bh) {
          if (aw < bw)
            return [INDEX.SOUTH_WEST]
          if (aw > bw)
            return [INDEX.SOUTH_EAST]
          return [INDEX.SOUTH_WEST, INDEX.SOUTH_EAST]
        }
        return [INDEX.NORTH_WEST, INDEX.NORTH_EAST, INDEX.SOUTH_WEST, INDEX.SOUTH_EAST]
      }

    /** Insert item */
      add(item:T) {
        return this.manage(item, "add")
      }

    /** Delete item */
      delete(item:T) {
        return this.manage(item, "delete")
      }

    /** Manage item */
      private manage(item:T, action:"add"|"delete") {
        this.allItems[action](item)
        if (this.nodes === null) {
          this.nodeItems[action](item)
          if ((action === "add")&&(this.nodeItems.size > this.maxItems)&&(this.depth < this.maxDepth))
            this.split()
        }
        else
          this.index(item).forEach(index => this.nodes?.[index][action](item))
      }

    /** Split node in child nodes */
      private split() {
        if (this.nodes === null) {
          const hw = this.width/2, hh = this.height/2
          this.nodes = [
            new Quadtree<T>({parent:this, x:this.x, y:this.y, width:hw, height:hh}),
            new Quadtree<T>({parent:this, x:this.x+hw, y:this.y, width:hw, height:hh}),
            new Quadtree<T>({parent:this, x:this.x+hw, y:this.y+hh, width:hw, height:hh}),
            new Quadtree<T>({parent:this, x:this.x, y:this.y+hh, width:hw, height:hh}),
          ]
          this.nodeItems.forEach(value => this.add(value))
          this.nodeItems.clear()
        }
      }

    /** Get values contained in given area */
      get(area:Rectangle, list = new Set<T>()) {
        if (this.nodes === null)
          this.nodeItems.forEach(value => list.add(value))
        else
          this.index(area).forEach(index => this.nodes?.[index].get(area, list))
        return list
      }

    /** Clear elements */
      clear({soft = false} = {}) {
        if (!soft)
          this.allItems.clear()
        this.nodeItems.clear()
        this.nodes?.forEach(node => node.clear())
        this.nodes = null
      }

    /** Construct quadtree from a set of object */
      static from<T extends Rectangle>(items:T[], options:{[key:string]:unknown} = {}) {
        const ax = Math.min(...items.map(({x}) => x))
        const bx = Math.max(...items.map(({x, width}) => x + width))
        const ay = Math.min(...items.map(({y}) => y))
        const by = Math.max(...items.map(({y, height}) => y + height))
        const quadtree = new Quadtree<T>({x:ax, y:ay, width:bx-ax, height:by-ay, ...options})
        items.forEach(item => quadtree.add(item))
        return quadtree
      }

    /** Test whether rectangle A contains rectangle B */
      static contains(a:Rectangle, b:Rectangle) {
        return (a.x+a.width >= b.x)&&(a.x <= b.x+b.width)&&(a.y <= b.y+b.height)&&(a.y+a.height >= b.y)
      }

  }
