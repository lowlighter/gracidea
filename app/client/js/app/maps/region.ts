//Imports
import type { World } from "app/client/maps/world.ts";
import { Section } from "app/client/maps/section.ts";
import { Renderable } from "app/client/rendering/renderable.ts";
import { Render } from "app/client/rendering/render.ts";

/**
 * Region.
 */
export class Region extends Renderable {
  /** World */
  readonly world: World;

  /** Loaded sections */
  readonly sections = new Map<string, Section>();

  /** Constructor */
  constructor({ world, id, x, y }: { world: World; id: string; x: number; y: number }) {
    super({ id });
    this.sprite.position.set(x, y);
    this.world = world;
    this.init();
  }

  /** Destructor */
  destructor() {
    this.world.regions.delete(this.id);
    return super.destructor();
  }

  /** Initialize renderable */
  protected async init() {
    const { sections } = await fetch(`/data/maps/${this.id}.json`).then((res) => res.json());
    for (const { id = "", x = 0, y = 0, width = 0, height = 0 } of sections) {
      this.loadable.set(id, Render.Rectangle([x / 16, y / 16, width / 16, height / 16]));
    }
    return super.init({ parent: this.world });
  }

  /** Loadable sections */
  readonly loadable = new Map<string, ReturnType<typeof Render.Rectangle>>();

  /** Load section */
  async load(id: string) {
    if (!this.sections.has(id)) {
      this.sections.set(id, new Section({ region: this, id, bounds: this.loadable.get(id)! }));
    }
  }

  /** Update */
  async update({ t, dt }: { t: number; dt: number; debug?: boolean }) {
    return super.update({ debug: false, t, dt });
  }
}
