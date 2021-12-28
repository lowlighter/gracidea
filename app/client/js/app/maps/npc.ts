//Imports
import type { Area } from "./area.ts";
import { Renderable } from "./../rendering/renderable.ts";
import { Render } from "../rendering/render.ts";
import type { Graphics } from "./../rendering/render.ts";
import type { rw } from "../types.ts";

/** Directions */
const enum Direction {
  none = 0,
  up = 1,
  right = 2,
  down = 3,
  left = 4,
}

/**
 * NPC.
 */
export class NPC extends Renderable {
  /** Area */
  readonly area: Area;

  /** Name */
  protected readonly name = "" as string;

  /** Constructor */
  constructor({ area }: { area: Area }) {
    super({ id: "" });
    this.area = area;
  }

  /** Destructor */
  destructor() {
    this.area.npcs.delete(this);
    return super.destructor();
  }

  /** Initialize renderable */
  protected async init({ frame, random = false }: { frame?: string; random?: boolean; parent?: Renderable } = {}) {
    //Search initial spawn point
    let [x, y] = this.area.data.points;
    for (const dx of [1, 0, -1]) {
      for (const dy of [1, 0, -1]) {
        if ((!dx) && (!dy)) {
          continue;
        }
        if (this.area.contains({ x: x + dx, y: y + dy })) {
          x += dx;
          y += dy;
          break;
        }
      }
    }

    //Search random spawn point
    if (random) {
      let xm = Infinity, xM = -Infinity, ym = Infinity, yM = -Infinity;
      this.area.data.points.forEach((v, i) => {
        if (i % 2) {
          ym = Math.min(ym, v);
          yM = Math.max(yM, v);
        } else {
          xm = Math.min(xm, v);
          xM = Math.max(xM, v);
        }
      });
      for (let i = 0; i < 20; i++) {
        const tx = Math.round(xm + xM * Math.random());
        const ty = Math.round(ym + yM * Math.random());
        if (this.area.contains({ x: tx, y: ty })) {
          x = tx;
          y = ty;
          break;
        }
      }
    }

    //Save initial position
    this.x = x;
    this.y = y;
    this.#tx = x;
    this.#ty = y;

    //Initialize main texture
    this.area.section.sprite.addChild(this.sprite);
    this.area.debug.addChild(this.debug);
    this.#texture = this.sprite.addChild(Render.Sprite({ frame, anchor: [0.5, 1], y: 1 }));

    //Initialize interactivity
    this.sprite.interactive = true;
    this.sprite.cursor = "pointer";
    this.sprite.mouseover = () => {
      if (!this.sprite.filters) {
        this.sprite.filters = Render.ColorFilter({ brightness: 1.5 });
      }
    };
    this.sprite.mouseout = () => this.sprite.filters = null;

    return super.init();
  }

  /** Update */
  async update({ debug = this.debug.visible, t, dt }: { t: number; dt: number; debug?: boolean }) {
    //Ignore if destroyed
    if (this.destroyed) {
      return;
    }
    this.refresh();

    //Debug sprite
    if ((debug) && (this.dirty)) {
      this.debug.bounds.removeChildren();
      this.debug.bounds.addChild(Render.Graphics({
        text: (this as rw).tracker,
        rect: [-.5, 0, 1, 1],
        ...(this.constructor as typeof Renderable).debug,
      }));
      this.debug.position.set(this.sprite.x, this.sprite.y);
    }
    return super.update({ debug: false, t, dt });
  }

  /** X coordinate */
  set x(value: number) {
    this.sprite.position.x = value * 16 + 8;
  }
  get x() {
    return (this.sprite.position.x - 8) / 16;
  }

  /** Target X coordinate */
  #tx = 0;

  /** Y coordinate */
  set y(value: number) {
    this.sprite.position.y = value * 16;
  }
  get y() {
    return this.sprite.position.y / 16;
  }

  /** Target Y coordinate */
  #ty = 0;

  /** Target tick wait */
  #tt = 0;

  /** Is moving */
  get moving() {
    return (this.#tx !== this.x) || (this.#ty !== this.y) || (this.#tt);
  }

  /** Perform refresh */
  protected refresh() {
    if (this.moving) {
      this.move();
    } else {
      this.action();
    }
  }

  /** Perform NPC action */
  protected action() {
    //No-op
  }

  /** Wander in a random direction */
  protected wander() {
    this.direction({
      direction: [Direction.none, Direction.left, Direction.right, Direction.up, Direction.down, Direction.none][Math.floor(Math.random() * 6)],
      move: true,
    });
  }

  /** Move sprite */
  private move({ delta = 1 / 2 ** 4 }: { delta?: number } = {}) {
    switch (this.#direction) {
      case Direction.none: {
        if (this.#tt) {
          this.#tt = Math.max(0, this.#tt - delta);
        }
        break;
      }
      case Direction.left: {
        this.x -= delta;
        if (this.x <= this.#tx) {
          this.x = this.#tx;
          this.#direction = Direction.none;
        }
        break;
      }
      case Direction.right: {
        this.x += delta;
        if (this.x >= this.#tx) {
          this.x = this.#tx;
          this.#direction = Direction.none;
        }
        break;
      }
      case Direction.up: {
        this.y -= delta;
        if (this.y <= this.#ty) {
          this.y = this.#ty;
          this.#direction = Direction.none;
        }
        break;
      }
      case Direction.down: {
        this.y += delta;
        if (this.y >= this.#ty) {
          this.y = this.#ty;
          this.#direction = Direction.none;
        }
        break;
      }
    }
  }

  /** Current direction */
  #direction = Direction.none;

  /** Change direction and optionally perform a step */
  protected direction({ direction, move = false }: { direction: Direction; move?: boolean }) {
    if (this.moving) {
      return;
    }
    if (move) {
      switch (direction) {
        case Direction.none: {
          this.#tt = 1;
          break;
        }
        case Direction.left: {
          if (this.area.contains({ x: this.x - 1.5, y: this.y })) {
            this.texture({ suffix: "_left_0", fallback: +1 });
            this.#tx = this.x - 1;
          }
          break;
        }
        case Direction.right: {
          if (this.area.contains({ x: this.x + 1.5, y: this.y })) {
            this.texture({ suffix: "_right_0", fallback: -1 });
            this.#tx = this.x + 1;
          }
          break;
        }
        case Direction.up: {
          if (this.area.contains({ x: this.x, y: this.y - 1.5 })) {
            this.texture({ suffix: "_up_0" });
            this.#ty = this.y - 1;
          }
          break;
        }
        case Direction.down: {
          if (this.area.contains({ x: this.x, y: this.y + 1.5 })) {
            this.texture({ suffix: "_down_0" });
            this.#ty = this.y + 1;
          }
          break;
        }
      }
    }
    this.#direction = direction;
  }

  /** Main texture */
  #texture: ReturnType<typeof Render.Sprite>;

  /** Set texture frame and optionally fallback on mirroring */
  private texture({ suffix = "", fallback = 0 }: { suffix?: string; fallback?: number } = {}) {
    const frame = `${this.name}${suffix}`;
    if (frame in Render.cache) {
      this.#texture.texture = Render.Texture(frame);
    } else if (fallback) {
      this.#texture.scale.x = Math.sign(fallback);
    }
  }

  /** Active effects */
  #effects = {
    fly: null as ReturnType<typeof Render.Sprite> | null,
    swim: null as ReturnType<typeof Render.Sprite> | null,
  };

  /** Set texture effects */
  protected effects(...effects: string[]) {
    //Flying effect
    if (effects.includes("fly")) {
      this.#effects.fly = this.sprite.addChildAt(Render.Graphics({ fill: [0, 0.5], ellipse: [0, 0.5, 2 / 3, 2 / 4] }), 0);
      this.#effects.fly.cacheAsBitmap = true;
      this.#texture.position.y = 1.5;
    } else if (this.#effects.fly) {
      this.sprite.removeChild(this.#effects.fly);
      this.#effects.fly.destroy({ children: true });
      this.#effects.fly = null;
      this.#texture.position.y = 1;
    }
    //Swimming effect
    if (effects.includes("swim")) {
      const mask = Render.Graphics({ rect: [-2, -2, 4, 2.4], fill: [0, 0] });
      this.#effects.swim = mask;
      this.#effects.swim.cacheAsBitmap = true;
      this.sprite.addChild(mask);
      this.#texture.mask = mask;
    } else if (this.#effects.swim) {
      this.sprite.removeChild(this.#effects.swim);
      this.#effects.swim.destroy({ children: true });
      this.#effects.swim = null;
      this.#texture.mask = null;
    }
  }

  /** Debug graphics properties */
  protected static debug = {
    fill: [0x001F3F, .25],
    textPosition: { x: 0, y: 1 },
    textStyle: { fill: "white", fontSize: 10, fontFamily: "monospace" },
  } as Partial<Graphics>;
}
