//Imports
import type { Renderable } from "app/client/rendering/renderable.ts";
import type { event } from "app/client/types.ts";
import { global } from "app/client/types.ts";
import { App } from "app/client/app.ts";

/**
 * Controller
 */
export class Controller {
  static instance = null as unknown as Controller;

  /** Constructor */
  constructor({ target }: { target: Renderable }) {
    this.#scrollers();
    this.target = target;
    this.focus(target);
    Controller.instance = this;
    this.init();
  }

  /** Init */
  async init() {
    //World map
    {
      //Toggle world map
      {
        const label = dom.element("label", { text: "Display world map" });
        label.append(dom.element("input", {
          attributes: { id: "control-worldmap", type: "checkbox" },
          listeners: {
            click: ({ target: { checked: value } }) => {
              App.world.map.visible = value;
              this.focus(value ? { sprite: App.world.map.getChildByName("worldmap") } as Renderable : this.target);
            },
          },
        }));
        global.document.querySelector(".worldmap")?.append(label);
      }

      //Search location
      {
        const label = dom.element("label", { text: "Search location" });
        label.append(dom.element("input", {
          attributes: { list: "control-worldmap-search" },
          listeners: {
            change({ target: { value } }) {
              const location = App.world.locations.filter(({ name }) => name === value)[0] ?? null;
              if (location) {
                App.world.camera.place(location);
                global.document.querySelector("[list='control-worldmap-search']").value = "";
              }
            },
          },
        }));
        const datalist = label.appendChild(dom.element("datalist", { attributes: { id: "control-worldmap-search" } }));
        for (const value of App.world.locations.map(({ name }) => name)) {
          datalist.append(dom.element("option", { attributes: { value } }));
        }
        global.document.querySelector(".worldmap")?.append(label);
      }
    }

    //Patches
    if (App.config.patch) {
      const patches = await fetch("/data/maps/patches.json").then((response) => response.json());
      for (const { id, x, y, tiles = [], areas = {} } of patches) {
        //Sections
        const patch = dom.element("div", { class: "patch" });
        patch.append(dom.element("div", {
          text: `@@ ${id} @@`,
          class: "id",
          listeners: {
            click() {
              App.world.camera.place({ x, y });
            },
          },
        }));

        //Tiles
        for (const { chunk, added = 0, deleted = 0, changed = 0 } of tiles) {
          const record = patch.appendChild(dom.element("div", { class: "record" }));
          const diff = record.appendChild(dom.element("div", { class: "diff" }));
          if (added) {
            diff.append(dom.element("div", { text: `+${added}`, class: "added" }));
          }
          if (changed) {
            diff.append(dom.element("div", { text: `~${changed}`, class: "changed" }));
          }
          if (deleted) {
            diff.append(dom.element("div", { text: `-${deleted}`, class: "deleted" }));
          }
          record.append(dom.element("div", { text: chunk, class: "name" }));
        }

        //Areas
        for (const [action, values] of Object.entries(areas)) {
          for (const { id, type } of values as Array<{ id: string; type: string }>) {
            const record = patch.appendChild(dom.element("div", { class: "record" }));
            const diff = record.appendChild(dom.element("div", { class: "diff" }));
            diff.append(dom.element("div", { text: { added: "+", changed: "~", deleted: "-" }[action]?.repeat(2), class: action }));
            record.append(dom.element("div", { text: `${id} (${type})`, class: "name" }));
          }
        }

        global.document.querySelector(".patches")?.append(patch);
      }
    } else {
      global.document.querySelector(".patches")?.parentNode?.remove();
    }

    //Debug options
    {
      //Patch mode
      if (App.config.patch) {
        const label = dom.element("label", { text: "patch" });
        label.append(dom.element("input", { attributes: { type: "checkbox", checked: App.config.patch, disabled: true } }));
        global.document.querySelector(".debug")?.append(label);
      }

      //Debug logs
      {
        const label = dom.element("label", { text: "debug.logs" });
        label.append(dom.element("input", {
          listeners: {
            click({ target: { checked: value } }) {
              App.config.debug.logs = value;
            },
          },
          attributes: { type: "checkbox", checked: App.config.debug.logs },
        }));
        global.document.querySelector(".debug")?.append(label);
      }

      //Debug bounds
      {
        const label = dom.element("label", { text: "debug.bounds" });
        label.append(dom.element("input", {
          listeners: {
            click({ target: { checked: value } }) {
              App.config.debug.bounds = value;
            },
          },
          attributes: { type: "checkbox", checked: App.config.debug.bounds },
        }));
        global.document.querySelector(".debug")?.append(label);
      }

      //Textures styles
      {
        const label = dom.element("label", { text: "textures.style" });
        const select = label.appendChild(dom.element("select", {
          listeners: {
            change({ target: { value } }) {
              App.config.textures.style = value;
            },
          },
          attributes: { value: App.config.textures.style },
        }));
        for (const style of ["rse"]) {
          select.append(dom.element("option", { text: style, attributes: { value: style } }));
        }
        global.document.querySelector(".debug")?.append(label);
      }

      //Textures sea
      {
        const label = dom.element("label", { text: "textures.sea" });
        label.append(dom.element("input", {
          listeners: {
            click({ target: { checked: value } }) {
              App.config.textures.sea = value;
            },
          },
          attributes: { type: "checkbox", checked: App.config.textures.sea },
        }));
        global.document.querySelector(".debug")?.append(label);
      }

      //People display
      {
        const label = dom.element("label", { text: "people.display" });
        label.append(dom.element("input", {
          listeners: {
            click({ target: { checked: value } }) {
              App.config.people.display = value;
            },
          },
          attributes: { type: "checkbox", checked: App.config.people.display },
        }));
        global.document.querySelector(".debug")?.append(label);
      }

      //Creatures display
      {
        const label = dom.element("label", { text: "creatures.display" });
        label.append(dom.element("input", {
          listeners: {
            click({ target: { checked: value } }) {
              App.config.creatures.display = value;
            },
          },
          attributes: { type: "checkbox", checked: App.config.creatures.display },
        }));
        global.document.querySelector(".debug")?.append(label);
      }

      //Creatures shiny rate
      {
        const label = dom.element("label", { text: "creatures.shiny" });
        label.append(dom.element("input", {
          listeners: {
            change({ target: { value } }) {
              App.config.creatures.shiny = Number(value);
            },
          },
          attributes: { type: "number", min: 0, max: 1, step: 0.125, value: App.config.creatures.shiny },
        }));
        global.document.querySelector(".debug")?.append(label);
      }
    }

    //Menu
    global.document.querySelector("nav .app-name").addEventListener("click", () => global.document.querySelector("nav").classList.toggle("collapsed"));
  }

  /** Focused element */
  focus(element: Renderable | null) {
    this.#focus = element;
  }

  /** Focused element */
  #focus = null as Renderable | null;

  /** Target element */
  target: Renderable;

  /** Scroll handlers */
  #scrollers() {
    let click = { x: 0, y: 0, active: false };
    let touch = { x: 0, y: 0 };
    App.rendering.view.addEventListener("touchstart", (event: event) => {
      touch = { x: event.touches[0].pageX, y: event.touches[0].pageY };
    });
    App.rendering.view.addEventListener("mousedown", (event: event) => {
      click = { x: event.pageX, y: event.pageY, active: true };
    });
    App.rendering.view.addEventListener("touchmove", (event: event) => {
      const delta = { x: touch.x - event.touches[0].pageX, y: touch.y - event.touches[0].pageY };
      touch = { x: event.touches[0].pageX, y: event.touches[0].pageY };
      this.#update({ delta });
    });
    global.document.addEventListener("mousemove", (event: event) => {
      if (click.active) {
        if (event.buttons === 0) {
          click.active = false;
          return;
        }
        const delta = { x: click.x - event.pageX, y: click.y - event.pageY };
        click = { x: event.pageX, y: event.pageY, active: true };
        this.#update({ delta });
      }
      this.#cursor = { x: event.clientX, y: event.clientY };
    });
    App.rendering.view.addEventListener("wheel", (event: event) => {
      event.preventDefault();
      this.#update({ delta: { x: event.deltaX, y: event.deltaY } });
    });
  }

  /** Update focused element position */
  #update({ delta }: { delta?: { x: number; y: number } }) {
    if (this.#focus) {
      if (delta) {
        this.#focus.sprite.position.set(
          Math.round(this.#focus.sprite.position.x - delta.x),
          Math.round(this.#focus.sprite.position.y - delta.y),
        );
      }
    }
  }

  /** Camera position */
  get camera() {
    return {
      x: Math.floor((-this.target.sprite.position.x + global.document.body.clientWidth / 2) / 16),
      y: Math.floor((-this.target.sprite.position.y + global.document.body.clientHeight / 2) / 16),
    };
  }

  /** Cursor position (internal) */
  #cursor = { x: 0, y: 0 };

  /** Cursor position */
  get cursor() {
    return {
      x: Math.floor((-this.target.sprite.position.x + this.#cursor.x) / 16),
      y: Math.floor((-this.target.sprite.position.y + this.#cursor.y) / 16),
    };
  }

  /** Query selector */
  qs(selector: string) {
    return global.document.querySelector(selector);
  }
}

/** Dom utilities */
const dom = {
  /** Dom element helper */
  element(tag: string, { class: classes = [] as string | string[], attributes = {} as { [key: string]: unknown }, listeners = {} as { [key: string]: (event: event) => void }, text = "" } = {}) {
    const element = global.document.createElement(tag);
    for (const [name, value] of Object.entries(attributes)) {
      if ((tag === "input") && (name === "checked") && (!value)) {
        continue;
      }
      element.setAttribute(name, value);
    }
    for (const [event, listener] of Object.entries(listeners)) {
      element.addEventListener(event, listener);
    }
    for (const classname of [classes].flat()) {
      element.classList.add(classname);
    }
    if (text) {
      element.innerText = text;
    }
    return element;
  },
};
