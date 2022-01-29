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

  /** Controller */
  static readonly controller: Controller;

  /** App setup */
  static async setup() {
    //Setup
    this.loaded("loaded /js/app.js", null, { update: true });

    //Load patches
    const patches = await fetch(`/data/maps/patches.json?sha=${this.sha}`).then((response) => response.json());
    if (patches.length) {
      this.config.patch = true;
      this.loaded("loaded patches, switching in preview mode");
    }

    //Setup renderer, world and controller
    await (Render as friend).setup({ app: this });
    Object.assign(this, { world: new World() });
    await this.world.ready;
    Object.assign(this, { controller: new Controller({ target: this.world }) });
    this.ready.resolve();

    //User inputs
    const { x = 5, y = -55 } = Object.fromEntries(new URLSearchParams(window.location.search).entries());
    this.world.camera.place({ x: Number(x) || 0, y: Number(y) || 0 });

    //Finalize loading
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
    //Texture settings
    textures: {
      //(for future usage) Textures styles
      style: "rse",
      //Toggle sea display
      sea: true,
    },
    //People settings
    people: {
      //Toggle display
      display: true,
    },
    //Creatures settings
    creatures: {
      //Toggle display
      display: true,
      //Shiny rate
      shiny: 1 / 128,
    },
    //Debug settings
    debug: {
      //Toggle debug logs in console
      logs: false,
      //Toggle renderable bounds display
      bounds: false,
    },
    //Patch settings (auto-enabled when patches.json is not empty)
    patch: false,
  };
}
