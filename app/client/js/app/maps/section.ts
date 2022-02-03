//Imports
import { Render } from "app/client/rendering/render.ts";
import type { Region } from "app/client/maps/region.ts";
import { Renderable } from "app/client/rendering/renderable.ts";
import { Area } from "app/client/maps/area.ts";
import { App } from "app/client/app.ts";

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
    this.region = region;
    this.sprite.position.set(x * 16, y * 16);
    this.sprite.sortableChildren = true;
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

    //Load chunks
    for (const { id, layer, x: X, y: Y, tiles } of chunks) {
      this.debug.addChild(
        Render.Graphics({
          text: id,
          textStyle: { fontSize: 10, fontFamily: "monospace", fill: "white" },
          textPosition: { x: X + .25, y: Y + .75 * (1 + layer) },
          textAnchor: [0, 0],
          stroke: [1, 0x2ECC40, .5],
          rect: [X, Y, 16, 16],
        }),
      );
      for (let i = 0; i < tiles.length; i++) {
        const frames = [];
        if (App.config.patch) {
          const { d, a, b } = this.data.diff?.tiles?.[id]?.[i] ?? {};
          switch (d) {
            case "+":
              frames.push({ frame: b, alpha: 0.8 }, { frame: 6327, alpha: 0.4 });
              break;
            case "~":
              frames.push({ frame: b, alpha: 0.8 }, { frame: 6325, alpha: 0.4 });
              break;
            case "-":
              frames.push({ frame: a, alpha: 0.8 }, { frame: 6326, alpha: 0.4 });
              break;
            default:
              if (tiles[i]) {
                frames.push({ frame: tiles[i], alpha: 0.2 });
              }
              break;
          }
        } else if ((tiles[i])&&(tiles[i] < 6215)) {
          frames.push({ frame: tiles[i] });
        }
        if (frames.length) {
          const x = X + i % 16, y = Y + Math.floor(i / 16);
          for (const { frame, alpha = 1 } of frames) {
            this.sprite.addChild(Render.Sprite({ frame, x, y, z: Render.tileset.zindex[`${frame}`] ?? 0, alpha }));
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

    if (App.config.debug.logs) {
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
