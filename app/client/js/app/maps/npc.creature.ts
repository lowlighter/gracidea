//Imports
import type { Area } from "app/client/maps/area.ts";
import { App } from "app/client/app.ts";
import { NPC } from "app/client/maps/npc.ts";
import { Render } from "app/client/rendering/render.ts";

/**
 * NPC (Creature).
 */
export class Creature extends NPC {
  /** Name */
  protected readonly name = "" as string;

  /** Constructor */
  constructor({ area }: { area: Area }) {
    super({ area });
    let random = Math.random();
    for (const name in this.area.encounters) {
      const rate = this.area.encounters[name];
      if (random <= rate) {
        this.name = name;
        break;
      }
      random -= rate;
    }
    this.sprite.alpha = 0;
    this.#lifetime = Math.floor(100 + Math.random() * 200);
    this.init({
      frame: `${Math.random() < App.config.creatures.shiny ? "shiny" : "regular"}/${this.name}`,
      random: true,
    });
    const effects = [];
    if (this.area.data.name in Render.effects.creature.area) {
      effects.push(Render.effects.creature.area[this.area.data.name]);
    }
    if (this.name in Render.effects.creature.name) {
      effects.push(Render.effects.creature.name[this.name]);
    }
    if (effects.length) {
      this.effects(...effects);
    }
  }

  /** Lifetime */
  #lifetime = Infinity;

  /** Update tracker */
  protected get tracker() {
    return this.#lifetime;
  }

  /** Perform refresh */
  protected refresh() {
    this.#lifetime--;
    if (this.#lifetime <= 0) {
      if (this.sprite.alpha > 0.1) {
        this.sprite.alpha *= 0.9;
      } else {
        return this.destructor();
      }
    } else if (this.sprite.alpha < 1) {
      this.sprite.alpha = Math.min(1, this.sprite.alpha * 1.2);
      if (!this.sprite.alpha) {
        this.sprite.alpha = 0.1;
      }
    }
    return super.refresh();
  }

  /** Perform NPC action */
  protected action() {
    this.wander();
  }

  /** Update */
  async update({ debug = this.debug.visible, t, dt }: { t: number; dt: number; debug?: boolean }) {
    this.sprite.visible = App.config.creatures.display;
    super.update({ debug, t, dt });
  }
}
