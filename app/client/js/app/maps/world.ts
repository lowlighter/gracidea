//Imports
import { App } from "app/client/app.ts";
import { Renderable } from "app/client/rendering/renderable.ts";
import { Region } from "app/client/maps/region.ts";
import { Camera } from "app/client/maps/camera.ts";
import type { Graphics } from "app/client/rendering/render.ts";
import { Render } from "app/client/rendering/render.ts";

/**
 * World.
 */
export class World extends Renderable {
  /** Loaded regions */
  readonly regions = new Map<string, Region>();

  /** Camera */
  readonly camera: Camera;

  /** World map */
  readonly map: ReturnType<typeof Render.Container>;

  /** World locations */
  readonly locations = [] as Array<{ name: string; x: number; y: number; spawn: { x: number; y: number } | null; bounds: ReturnType<typeof Render.engine.Rectangle> }>;

  /** Constructor */
  constructor() {
    super({ id: "gracidea" });
    this.camera = new Camera({ world: this });
    this.init();
  }

  /** Initialize renderable */
  protected async init() {
    await Promise.all([this.#regions(), this.#map(), this.#coordinates()]);
    return super.init({ parent: App.rendering.stage });
  }

  /** Setup world regions */
  async #regions() {
    const { regions } = await fetch("/data/maps.json").then((res) => res.json());
    for (const { id = "", ...bounds } of regions) {
      this.regions.set(id, new Region({ world: this, id, bounds }));
    }
    this.#sea.sprite = this.sprite.addChild(Render.TilingSprite());
    if (App.config.patch) {
      this.#sea.sprite.alpha = 0.1;
    }
  }

  /** Setup world map */
  async #map() {
    //Setup
    const { width, height, layers, images, links } = await fetch("/data/maps.world.json").then((res) => res.json());
    const container = App.rendering.stage.addChild(Render.Container({ z: 1 }));
    container.addChild(Render.Graphics({ fill: [0x51BADA, 0.75], rect: [0, 0, 128, 128] }));
    container.visible = false;
    Object.assign(this, { map: container });

    //Create world map
    const map = container.addChild(Render.Container());
    map.name = "worldmap";
    map.scale.set(2);
    for (const { layer, tiles } of layers) {
      //Cities, roads and interests points
      for (let i = 0; i < width * height; i++) {
        const tile = tiles[i] - 1;
        if (tile) {
          const x = (i % width) / 2, y = Math.floor(i / width) / 2;
          map.addChild(Render.Sprite({ frame: `worldmap/${tile}`, x, y }));
        }
      }
      //After sea roads, display region background
      if (layer === "roads.sea") {
        for (const { name, x, y, width, height } of images) {
          const sprite = map.addChild(Render.Sprite({ frame: `regions/${name}` }));
          Object.assign(sprite, { x, y, width, height });
        }
      }
    }

    //Create links
    for (const { name, points, location } of links) {
      const sprite = map.addChild(Render.Graphics({ fill: [0xFFFFFF, 1], polygon: points.map((point: number) => point / 2) }));
      sprite.interactive = true;
      sprite.cursor = "pointer";
      sprite.alpha = 0;
      sprite.mouseover = () => sprite.alpha = 0.8;
      sprite.mouseout = () => sprite.alpha = 0;
      sprite.click = () => (this.camera.place(location.spawn ?? location), App.controller.qs("#control-worldmap").click());
      sprite.tap = sprite.click;
      this.locations.push({ name, ...location, bounds: new Render.engine.Rectangle(location.x, location.y, location.width, location.height) });
    }
  }

  /** Setup coordinates handle */
  async #coordinates() {
    const handle = App.rendering.stage.addChild(Render.Sprite({ z: 2 }));
    handle.name = "coordinates";
    handle.position.set(4, App.rendering.view.height - 20);
    handle.addChild(new Render.engine.Text("", { fontSize: 16, fill: "white", strokeThickness: 2, fontFamily: "monospace" }));
  }

  /** Sea texture */
  readonly #sea = {
    sprite: null as ReturnType<typeof Render.TilingSprite> | null,
    frame: 0,
    dt: 0,
    resize: true,
  };

  /** Update renderable */
  async update({ t, dt }: { t: number; dt: number; debug?: boolean }) {
    //Sea update
    if (this.#sea.sprite) {
      this.#sea.sprite.visible = App.config.textures.sea;
      if (this.#sea.sprite.visible) {
        const { frames, speed } = Render.tileset.animated[2374];
        this.#sea.dt += speed * dt;
        if (this.#sea.dt > 2) {
          this.#sea.frame = (this.#sea.frame + 1) % frames.length;
          this.#sea.sprite.texture = Render.Texture(frames[this.#sea.frame]);
          this.#sea.dt = 0;
        }
        if (this.#sea.resize) {
          this.#sea.sprite.width = Math.round(2 + App.rendering.screen.width / 16) * 16;
          this.#sea.sprite.height = Math.round(2 + App.rendering.screen.height / 16) * 16;
          this.#sea.resize = false;
        }
        this.#sea.sprite.position.set(-Math.floor(1 + this.sprite.position.x / 16) * 16, -Math.floor(1 + this.sprite.position.y / 16) * 16);
      }
    }
    //Coordinates update
    if (App.controller) {
      const { x, y } = App.controller.camera;
      const { children: [coordinates] } = App.rendering.stage.getChildByName("coordinates");
      coordinates.text = `${x};${y}`;
      const location = this.locations.find(({ bounds }) => bounds.contains(x, y));
      if (location) {
        coordinates.text += ` — ${location.name}`;
      }
    }
    return super.update({ t, dt, debug: true });
  }

  /** Debug graphics properties */
  protected static debug = { text: "" } as Partial<Graphics>;
}
