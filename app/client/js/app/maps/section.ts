//Imports
import { Render } from "./../rendering/render.ts";
import type { Region } from "./region.ts";
import { Renderable } from "../rendering/renderable.ts";
import { Area } from "./area.ts";
import { App } from "../app.ts";

/**
 * Section.
 */
export class Section extends Renderable {
  /** Region */
  readonly region: Region;

  /** Bounds */
  readonly bounds = Render.Rectangle();

  /** Loaded areas */
  readonly areas = new Set<Area>();

  /** Constructor */
  constructor({ region, id, bounds }: { region: Region; id: string; bounds: { x: number; y: number; width: number; height: number } }) {
    super({ id, visible: false });
    const { x, y } = bounds;
    this.sprite.position.set(x * 16, y * 16);
    this.sprite.sortableChildren = true;
    this.region = region;
    Object.assign(this.bounds, bounds);
    this.init();
  }

  /** Destructor */
  destructor() {
    this.region.sections.delete(this.id);
    this.areas.forEach((area) => area.destructor());
    return super.destructor();
  }

  /** Section data */
  readonly data: data;

  /** Initialize renderable */
  protected async init() {
    this.#placeholder = this.sprite.addChild(Render.Graphics({
      stroke: [1, 0x284088, 1],
      fill: [0x182850, 1],
      rect: [0, 0, this.bounds.width, this.bounds.height],
      text: `${this.id}\n(loading)`,
      textStyle: { align: "center", fontSize: 16, fill: "white", fontFamily: "monospace" },
      textPosition: { x: this.bounds.width / 2, y: this.bounds.height / 2 },
    }));
    return super.init({ parent: this.region });
  }

  /** Is loaded */
  #loaded = false;

  /** Placeholder */
  #placeholder = null as null | ReturnType<typeof Render.Graphics>;

  /** Load section */
  async load() {
    //Ensure this is not loaded multiple times and that initialization is complete
    if (this.#loaded) {
      return;
    }
    this.#loaded = true;
    await this.ready;

    Object.assign(this, { data: await fetch(`/data/maps/${this.id}.json`).then((res) => res.json()) });
    const { chunks, areas } = this.data;

    this.debug.addChild(Render.Graphics({
      rect: [0, 0, this.bounds.width, this.bounds.height],
      stroke: [1, 0x3D9970, .5],
      fill: [0x3D9970, .125],
    }));

    //Load chunks
    for (const { /*id,*/ x: X, y: Y, tiles } of chunks) {
      //this.debug.addChild(Render.Graphics({ text:id, textStyle: { fontSize: 10, fill: "white" }, textPosition:{x:X+.25, y:Y+.25}, textAnchor:[0, 0], stroke: [1, 0x2ECC40, .5], fill: [0x2ECC40, .125], rect: [X, Y, 16, 16] }))
      for (let i = 0; i < tiles.length; i++) {
        const frame = tiles[i];
        if (frame) {
          const x = X + i % 16, y = Y + Math.floor(i / 16);
          if (frame) {
            this.sprite.addChild(Render.Sprite({ frame, x, y, z: Render.tileset.zindex[`${frame}`] ?? 0 }));
          }
        }
      }
    }
    //Load areas
    for (const area of areas) {
      this.areas.add(new Area({ section: this, data: area }));
    }

    //Remove placeholder
    if (this.#placeholder) {
      this.sprite.removeChild(this.#placeholder)?.destroy({ children: true });
      this.#placeholder = null;
    }

    if (App.config.debug) {
      console.debug(`loaded: ${this.constructor.name}#${this.id}`);
    }
  }

  /** Show renderable */
  show() {
    this.load();
    this.sprite.visible = true;
  }
}

//deno-lint-ignore no-explicit-any
type data = any;
