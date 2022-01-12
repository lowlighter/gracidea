//Imports
import type { friend } from "app/client/types.ts";
import { global } from "app/client/types.ts";
import { deferred } from "std/async/deferred.ts";
import { Render } from "app/client/rendering/render.ts";
import { World } from "app/client/maps/world.ts";
import { Controller } from "app/client/controls/controller.ts";

/** App */
export class App {
  /** World */
  static readonly world: World;

  /** App setup */
  static async setup() {
    this.loaded("loaded /js/app.js", null, { update: true });
    const { x = 5, y = -55 } = Object.fromEntries(new URLSearchParams(window.location.search).entries());

    await (Render as friend).setup({ app: this });
    const world = new World();
    Object.assign(this, { world });
    new Controller({ target: world });

    Object.assign(this, { world });

    this.ready.resolve();

    world.camera.place({ x: Number(x) || 0, y: Number(y) || 0 });

    this.loaded("waiting for first rendering");
    global.document.querySelector(".loader").remove();
    return App;
  }

  /** App ready state */
  static readonly ready = deferred();

  /** Rendering instance */
  static get rendering() {
    return (Render as friend).instance;
  }

  /** Print a message to loading console */
  static get loaded() {
    return global.gracidea.loaded as (text: string, type?: string | null, options?: { update?: boolean }) => void;
  }

  /** Current commit sha */
  static get sha() {
    return global.gracidea.sha as string;
  }

  /** Config */
  static config = {
    patch: false,
    debug: false,
    textures: {
      style: "rse",
    },
    pins: {
      display: true,
    },
    people: {
      display: true,
    },
    creatures: {
      display: true,
      shiny: 1 / 8,
    },
  };
}
