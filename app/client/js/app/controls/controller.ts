//Imports
import type { Renderable } from "../rendering/renderable.ts";
import type { event } from "../types.ts";
import { global } from "../types.ts";
import { App } from "./../app.ts";
import { debounce } from "https://deno.land/std@0.119.0/async/debounce.ts";

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
    const sync = debounce(() => this.#sync(), 50);
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
      sync();
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

  /** Sync controller data */
  #sync() {
    const { x, y } = this.cursor;
    global.document.querySelector("#cursor-x").innerText = x;
    global.document.querySelector("#cursor-y").innerText = y;
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
}
