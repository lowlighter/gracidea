//Imports
import { Render } from "app/client/rendering/render.ts";
import { App } from "app/client/app.ts";
import type { Graphics } from "app/client/rendering/render.ts";
import { deferred } from "std/async/deferred.ts";

/**
 * Renderable object.
 * It contains additional methods that can be used for easier management and debugging.
 */
export abstract class Renderable {
  /** Identifier */
  readonly id: string;

  /** Constructor */
  constructor({ id, x = 0, y = 0, z = 0, visible = true }: { id: string; x?: number; y?: number; z?: number; visible?: boolean }) {
    this.id = id;
    this.sprite = Render.Container({ x, y, z, visible });
    this.debug = Render.Container({ x, y, z });
    Object.defineProperty(this.debug, "visible", {
      get() {
        return App.config.debug;
      },
    });
    this.debug.bounds = this.debug.addChild(Render.Container());
    Render.register(this);
  }

  /** Is destroyed */
  protected readonly destroyed = false;

  /** Destructor */
  destructor() {
    Render.unregister(this);
    this.sprite.parent?.removeChild(this.sprite);
    this.debug.parent?.removeChild(this.debug);
    this.debug.bounds.parent?.removeChild(this.debug.bounds);
    this.sprite.destroy({ children: true });
    this.debug.destroy({ children: true });
    this.debug.bounds.destroy({ children: true });
    Object.assign(this, { destroyed: true });
    if (App.config.debug) {
      console.debug(`destroyed: ${this.constructor.name}#${this.id}`);
    }
  }

  /** Renderable initialized */
  readonly ready = deferred();

  /** Initialize renderable */
  protected async init({ parent = null }: { parent?: null | Renderable | typeof App.rendering.stage } = {}) {
    if (parent === App.rendering.stage) {
      App.rendering.stage.addChild(this.sprite);
      App.rendering.stage.addChild(this.debug);
    } else if (parent) {
      if ((this.destroyed) || (parent.destroyed)) {
        if (App.config.debug) {
          console.debug(`creation aborted: ${this.constructor.name}#${this.id} (sprite already destroyed)`);
        }
        return this.destructor();
      }
      parent.sprite.addChild(this.sprite);
      parent.debug.addChild(this.debug);
    }
    if (App.config.debug) {
      console.debug(`created: ${this.constructor.name}#${this.id}`);
    }
    this.ready.resolve();
  }

  /** Sprite */
  readonly sprite: ReturnType<typeof Render.Container>;

  /** Debug sprite */
  readonly debug: ReturnType<typeof Render.Container> & { bounds: ReturnType<typeof Render.Container> };

  /** Show renderable */
  show() {
    this.sprite.visible = true;
  }

  /** Hide renderable */
  hide() {
    this.sprite.visible = false;
  }

  /** Update renderable */
  async update({ debug = this.debug.visible }: { t: number; dt: number; debug?: boolean }) {
    if (this.destroyed) {
      return;
    }
    if (debug) {
      if (this.dirty) {
        const { width, height } = this.sprite._bounds.getRectangle();
        this.debug.bounds.removeChildren();
        this.debug.bounds.addChild(Render.Graphics({
          text: `${this.id}`,
          rect: [0, 0, width / 16, height / 16],
          ...Renderable.debug,
          ...(this.constructor as typeof Renderable).debug,
        }));
      }
      this.debug.position.set(this.sprite.x, this.sprite.y);
    }
  }

  /** Tell if bounds have changed since last update */
  protected get dirty() {
    if (this.destroyed) {
      return false;
    }
    const { x, y, width, height } = this.sprite.getBounds(true);
    const hash = `${x}/${y}/${width}/${height}`;
    const dirty = (this.#dirty === hash);
    this.#dirty = hash;
    return dirty;
  }

  /** Dirty hash */
  #dirty = "";

  /** Debug graphics properties */
  protected static debug = {
    stroke: [1, 0x0000FF, .5],
    fill: [0x00FF00, .125],
    textStyle: { fontSize: 10, fill: "white", fontFamily: "monospace" },
    textPosition: { x: .25, y: .25 },
    textAnchor: [0, 0],
  } as Partial<Graphics>;
}
