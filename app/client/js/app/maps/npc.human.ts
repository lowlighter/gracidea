//Imports
import type { Area } from "./area.ts";
import { App } from "../app.ts"
import { NPC } from "./npc.ts"

/**
 * NPC (Human).
 */
export class Human extends NPC {

  /** Name */
  protected readonly name = "" as string

  /** Constructor */
  constructor({area}:{area:Area}) {
    super({area})
    this.name = this.area.data.name
    this.init()
  }

  /** Allowed directions */
  readonly #directions = [] as string[]

  /** Track points */
  readonly #track = [] as number[]

  /** Track index */
  #index = 0

  /** Track pattern */
  #pattern = Pattern.fixed

  /** Initialize renderable */
  protected async init() {
    //Allowed directions for lookaround
    if (this.#pattern === Pattern.lookaround)
      this.#directions.push(...(this.area.data.properties.directions ?? []) as string[])

    //Compute track for loop and patrols
    if ((this.#pattern === Pattern.loop) || (this.#pattern === Pattern.patrol)) {
      const points = this.area.polygon.points.map((n: number) => n / 16)
      points.push(points[0], points[1])
      this.#track.push(points[0], points[1])
      for (let i = 2; i < points.length; i += 2) {
        let [x, y, nx, ny] = [points[i - 2], points[i - 1], points[i], points[i + 1]]
        const dx = nx - x
        const dy = ny - y
        for (let j = 0; j < Math.abs(dx); j++)
          this.#track.push(x += Math.sign(dx), y)
        for (let j = 0; j < Math.abs(dy); j++)
          this.#track.push(x, y += Math.sign(dy))
      }
      //Remove invalid cells
      for (let i = 0; i < this.#track.length; i += 2) {
        const [x, y] = [this.#track[i], this.#track[i + 1]]
        if (!this.area.contains({ x, y }))
          this.#track[i] = this.#track[i + 1] = NaN
      }
      (this as any).#track = this.#track.filter(Number.isFinite)

      //Push reversed track on patrol
      if (this.#pattern === Pattern.patrol) {
        const points = this.#track.slice()
        for (let i = points.length - 4; i > 0; i -= 2)
          this.#track.push(points[i], points[i + 1])
      }

      //Remove duplicated cell on loop
      if ((this.#pattern === Pattern.loop) && (this.#track.at(0) === this.#track.at(-2)) && (this.#track.at(1) === this.#track.at(-1))) {
        this.#track.pop()
        this.#track.pop()
      }
    }
    return super.init()
  }

  /** Update tracker */
  protected get tracker() {
    return this.#index
  }

  /** Perform NPC action */
  protected action() {
    this.wander()
  }


}

/** Patterns */
export const enum Pattern {
  patrol = "patrol",
  loop = "loop",
  wander = "wander",
  fixed = "fixed",
  lookaround = "lookaround",
}


/**
 * NPC

export class NPxC extends Renderable {

  /** Sprites
  readonly sprites: {
    main: ReturnType<typeof Render.Sprite>
    mask: ReturnType<typeof Render.Graphics> | null
    shadow: ReturnType<typeof Render.Graphics> | null
  }

  /** Offset
   * readonly offset = { x: 0, y: 0 }

  /** Track index
  private _track_index = 0

  /** Loop (follow track and loop over)
  private loop() {
    this._track_index = (this._track_index + 2) % this.track.length
    const dx = this.track[this._track_index] - this.x
    const dy = this.track[this._track_index + 1] - this.y
    if (dx > 0)
      this.goRight()
    else if (dx < 0)
      this.goLeft()
    else if (dy < 0)
      this.goUp()
    else if (dy > 0)
      this.goDown()
  }

  /** Patrol (follow track and reverse)
  private patrol() {
    this.loop()
  }

  /** Lookaround
  private lookaround() {
    void ([() => null, () => this.lookLeft(), () => this.lookRight(), () => this.lookUp(), () => this.lookDown()][Math.floor(Math.random() / 0.2)])()
  }

  const dx = Math.round(Math.abs(this.x - Math.floor(this.x)) / (1 / 6)) % 3
  const dy = Math.round(Math.abs(this.y - Math.floor(this.y)) / (1 / 6)) % 3

}*/
