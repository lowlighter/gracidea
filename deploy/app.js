(function() {
    const global = globalThis;
    const TILE_SIZE = 16;
    const CHUNK_SIZE = 32;
    const ANIMATED = {
        2266: {
            frames: [
                2266,
                2267,
                2268,
                2269
            ].map((frame)=>`${frame}`
            ),
            speed: 0.025
        },
        2374: {
            frames: [
                2374,
                2375,
                2376,
                2377,
                2378,
                2379,
                2380,
                2381
            ].map((frame)=>`${frame}`
            ),
            speed: 0.075
        },
        658: {
            frames: [
                658,
                659,
                660,
                659
            ].map((frame)=>`${frame}`
            ),
            speed: 0.05
        },
        661: {
            frames: [
                661,
                662,
                663,
                664,
                663,
                664,
                663,
                664,
                663,
                664,
                662,
                661,
                661,
                661
            ].map((frame)=>`${frame}`
            ),
            speed: 0.05
        },
        774: {
            frames: [
                774,
                775,
                776,
                777,
                776,
                777,
                776,
                777,
                776,
                777,
                775,
                774,
                774,
                774
            ].map((frame)=>`${frame}`
            ),
            speed: 0.05
        }
    };
    const imports = [
        "https://cdn.skypack.dev/pin/pixi.js@v6.0.2-2cUO8JQP1lUQiq9yVX7X/mode=imports,min/optimized/pixijs.js",
        "https://cdn.skypack.dev/pin/stats.js@v0.17.0-O9IR9DX2BVp2a58SBe0w/mode=imports,min/optimized/statsjs.js", 
    ];
    class Render {
        static engine;
        static app;
        static async setup() {
            const [PIXI, { default: StatsJS  }] = await Promise.all(imports.map((dep)=>import(dep)
            ));
            this.engine = PIXI;
            this.engine.settings.SCALE_MODE = this.engine.SCALE_MODES.NEAREST;
            this.engine.settings.ROUND_PIXELS = true;
            const loader = Render.engine.Loader.shared;
            loader.add("/textures/tileset3.json", {
                crossOrigin: "anonymous"
            });
            loader.add("/textures/creatures.json", {
                crossOrigin: "anonymous"
            });
            this.app = new Render.engine.Application({
                width: global.document.body.clientWidth,
                height: global.document.body.clientHeight,
                resizeTo: global.window,
                autoDensity: true,
                resolution: global.devicePixelRatio,
                backgroundAlpha: 0
            });
            global.document.querySelector("body").appendChild(this.app.view);
            for (const i of [
                0,
                1
            ]){
                const stats = new StatsJS();
                stats.showPanel(i);
                global.document.querySelector("body").appendChild(stats.dom);
                stats.dom.style.left = `${i * 80}px`;
                this.app.ticker.add(()=>stats.update()
                );
            }
            await new Promise((solve)=>loader.load(()=>solve(null)
                )
            );
        }
        static Polygon(points) {
            return new Render.engine.Polygon(...points.map((n)=>n * 16
            ));
        }
        static Graphics({ z =NaN , stroke , fill , text , textStyle , textPosition , rect , circle , ellipse , polygon  }) {
            const graphics = new Render.engine.Graphics();
            if (stroke) graphics.lineStyle(...stroke);
            if (fill) graphics.beginFill(...fill);
            if (rect) graphics.drawRect(...rect.map((n)=>n * 16
            ));
            if (circle) graphics.drawCircle(...circle.map((n)=>n * 16
            ));
            if (ellipse) graphics.drawEllipse(...ellipse.map((n)=>n * 16
            ));
            if (polygon) {
                if (polygon instanceof Render.engine.Polygon) graphics.drawPolygon(polygon);
                else graphics.drawPolygon(...polygon.map((n)=>n * 16
                ));
            }
            graphics.endFill();
            if (text) {
                const textSprite = graphics.addChild(new Render.engine.Text(text, textStyle));
                textSprite.anchor.set(0.5);
                if (textPosition) textSprite.position.set(textPosition.x, textPosition.y);
            }
            if (!Number.isNaN(z)) graphics.zIndex = z;
            return graphics;
        }
        static ParticleContainer({ x =0 , y =0  } = {
        }) {
            const container = new Render.engine.ParticleContainer();
            container.position.set(x * 16, y * 16);
            return container;
        }
        static Container({ x =0 , y =0 , z =NaN , sorted =false  } = {
        }) {
            const container = new Render.engine.ParticleContainer.__proto__();
            container.position.set(x * 16, y * 16);
            if (!Number.isNaN(z)) container.zIndex = z;
            if (sorted) container.sortableChildren = true;
            return container;
        }
        static Texture({ frame =Render.engine.Texture.EMPTY  }) {
            return Render.engine.Texture.from(`${frame}`);
        }
        static TilingSprite({ frame =Render.engine.Texture.EMPTY , x =0 , y =0 , z =NaN , width =0 , height =0  }) {
            const sprite = Render.engine.TilingSprite.from(`${frame}`, {
                width: width * 16,
                height: height * 16
            });
            sprite.position.set(x * 16, y * 16);
            if (!Number.isNaN(z)) sprite.zIndex = z;
            return sprite;
        }
        static Sprite({ frame =Render.engine.Texture.EMPTY , x =0 , y =0 , z =NaN , anchor , scale  } = {
        }) {
            let sprite;
            if (frame instanceof Render.engine.Texture) sprite = new Render.engine.Sprite.from(frame);
            else if (`${frame}` in ANIMATED) {
                sprite = new Render.engine.AnimatedSprite.fromFrames(ANIMATED[frame].frames);
                sprite.animationSpeed = ANIMATED[frame].speed;
                sprite.play();
            } else sprite = new Render.engine.Sprite.from(`${frame}`);
            sprite.position.set(x * 16, y * 16);
            if (anchor) sprite.anchor.set(...anchor);
            if (scale) sprite.scale.set(...scale);
            if (!Number.isNaN(z)) sprite.zIndex = z;
            return sprite;
        }
        static get filters() {
            return Render.engine.filters;
        }
    }
    class Positionable {
        world;
        x;
        y;
        width;
        height;
        constructor({ world: world3 , x: x1 = 0 , y: y1 = 0 , width =0 , height =0  }){
            this.world = world3;
            this.x = x1;
            this.y = y1;
            this.width = width;
            this.height = height;
        }
    }
    class Renderable extends Positionable {
        sprite;
        rendered = false;
        destroyed = false;
        _debug;
        hide() {
            this.sprite.visible = false;
        }
        show() {
            if (this.destroyed) return;
            if (!this.rendered) {
                this.rendered = true;
                this.render();
            }
            this.sprite.visible = true;
            this.debug();
        }
        toggle() {
            return this.sprite.visible ? this.hide() : this.show();
        }
        debug(visible = false) {
            if (this._debug) {
                this._debug.visible = visible;
                this._debug.position.set(this.x * 16, this.y * 16);
            }
        }
        destructor() {
            this.destroyed = true;
            this.rendered = false;
            this.sprite.visible = false;
            this.sprite.removeChildren().forEach((child)=>child.destroy({
                    children: true
                })
            );
            this.debug(false);
        }
    }
    class Minimap extends Renderable {
        sprite;
        data = null;
        constructor({ world: world1  }){
            super({
                world: world1
            });
            this.sprite = this.world.sprites.minimap.addChild(Render.Container());
            this.hide();
        }
        hide() {
            this.world.sprites.world.filters = null;
            return super.hide();
        }
        show() {
            this.world.sprites.world.filters = [
                new Render.filters.BlurFilter(),
                new Render.filters.ColorMatrixFilter()
            ];
            this.world.sprites.world.filters[1].brightness(0.5);
            return super.show();
        }
        get open() {
            return this.sprite.visible;
        }
        async render() {
            this.sprite.scale.set(1.5);
            if (!this.data) this.data = await fetch(`/map/${this.world.name}/pins`).then((res)=>res.json()
            );
            for (const [name, { mx , my , pins  }] of Object.entries(this.data.regions)){
                const sprite = this.sprite.addChild(Render.Sprite({
                    frame: `imgs/regions/${name}.png`
                }));
                sprite.position.set(mx, my);
                for (const { x: x1 , y: y1 , mx: mx1 , my: my1  } of pins){
                    const pin = sprite.addChild(Render.Graphics({
                        fill: [
                            16711680,
                            0.5
                        ],
                        rect: [
                            0,
                            0,
                            0.5,
                            0.5
                        ]
                    }));
                    pin.interactive = true;
                    pin.position.set(mx1, my1);
                    pin.on("mouseover", ()=>pin.tint = 65280
                    );
                    pin.on("mouseout", ()=>pin.tint = 16777215
                    );
                    pin.on("click", ()=>this.moveTo({
                            x: x1,
                            y: y1
                        })
                    );
                    pin.on("tap", ()=>this.moveTo({
                            x: x1,
                            y: y1
                        })
                    );
                }
            }
            let mx1 = Infinity, my1 = Infinity, Mx = -Infinity, My = -Infinity;
            this.sprite.children.forEach((sprite)=>{
                mx1 = Math.min(mx1, sprite.x);
                my1 = Math.min(my1, sprite.y);
                Mx = Math.max(Mx, sprite.x + sprite.width);
                My = Math.max(My, sprite.y + sprite.height);
            });
            const width1 = (Mx - mx1) / 2, height1 = (My - my1) / 2;
            this.sprite.position.set(-mx1 + (width1 + global.document.body.clientWidth / 2) / 2, -my1 + (height1 - global.document.body.clientHeight / 2) / 2);
        }
        moveTo({ x , y  }) {
            this.world.camera.moveTo({
                x,
                y
            });
            this.hide();
        }
    }
    var Pattern;
    (function(Pattern1) {
        Pattern1["patrol"] = "patrol";
        Pattern1["loop"] = "loop";
        Pattern1["wander"] = "wander";
        Pattern1["fixed"] = "fixed";
    })(Pattern || (Pattern = {
    }));
    class NPC extends Renderable {
        sprite;
        sprites;
        offset = {
            x: 0,
            y: 0
        };
        area;
        track = [];
        _track_index = 0;
        pattern = "fixed";
        constructor({ world: world2 , area  }){
            super({
                world: world2
            });
            this.area = area;
            this.sprite = Render.Container();
            this.sprites = {
                main: this.sprite.addChild(Render.Sprite({
                    frame: "regular/mew",
                    anchor: [
                        0.5,
                        1
                    ]
                })),
                mask: null,
                shadow: null
            };
            console.debug(`loaded npc:`);
            this.x = this.area.polygon.points[0] / TILE_SIZE;
            this.y = this.area.polygon.points[1] / TILE_SIZE;
            this.area.npcs.add(this);
            if (this.pattern === "loop" || this.pattern === "patrol") {
                const points = this.area.polygon.points.map((n)=>n / 16
                );
                points.push(points[0], points[1]);
                this.track = [
                    points[0],
                    points[1]
                ];
                for(let i = 2; i < points.length; i += 2){
                    const [px, py, nx, ny] = [
                        points[i - 2],
                        points[i - 1],
                        points[i],
                        points[i + 1]
                    ];
                    const dx = nx - px;
                    const dy = ny - py;
                    let [x2, y2] = [
                        px,
                        py
                    ];
                    for(let j = 0; j < Math.abs(dx); j++)this.track.push(x2 += Math.sign(dx), y2);
                    for(let j1 = 0; j1 < Math.abs(dy); j1++)this.track.push(x2, y2 += Math.sign(dy));
                }
                if (this.pattern === "patrol") {
                    const points1 = this.track.slice();
                    for(let i1 = points1.length - 4; i1 > 0; i1 -= 2)this.track.push(points1[i1], points1[i1 + 1]);
                }
                if (this.pattern === "loop" && this.track[0] === this.track[this.track.length - 2] && this.track[1] === this.track[this.track.length - 1]) {
                    this.track.pop();
                    this.track.pop();
                }
            }
        }
        update(tick) {
            if (Number.isInteger(tick)) {
                this[this.pattern]();
                this.render();
            }
        }
        fixed() {
        }
        loop() {
            this._track_index = (this._track_index + 2) % this.track.length;
            this.x = this.track[this._track_index];
            this.y = this.track[this._track_index + 1];
        }
        patrol() {
            this.loop();
        }
        wander() {
            const { dx , dy  } = [
                {
                    dx: 0,
                    dy: 0
                },
                {
                    dx: -1,
                    dy: 0
                },
                {
                    dx: +1,
                    dy: 0
                },
                {
                    dx: 0,
                    dy: -1
                },
                {
                    dx: 0,
                    dy: +1
                }
            ][Math.floor(Math.random() / 0.2)];
            if (this.area.contains({
                x: this.x + dx,
                y: this.y + dy
            })) {
                this.x += dx;
                this.y += dy;
            }
        }
        lookaround() {
        }
        render() {
            const chunk = this.world.chunkAt(this);
            if (chunk) {
                const rx = this.x - chunk.x, ry = this.y - chunk.y;
                this.sprite.position.set((rx + 0.5) * 16 + this.offset.x, (ry + 1) * 16 + this.offset.y);
                chunk?.layers.get("2X")?.addChild(this.sprite);
                this.sprite.zIndex = ry * CHUNK_SIZE;
            }
        }
    }
    class App1 {
        world;
        controller;
        ready;
        constructor(){
            const that = this;
            this.world = null;
            this.controller = null;
            this.ready = new Promise(async (solve)=>{
                await Render.setup();
                that.world = new World({
                    app: this
                });
                that.controller = new Controller({
                    app: this,
                    world: this.world
                });
                that.world.camera.moveTo({
                    x: 329,
                    y: -924
                });
                solve();
            });
        }
        static debug = {
            logs: true,
            chunks: true,
            areas: true,
            camera: true
        };
    }
    class Controller {
        app;
        world;
        constructor({ app: app1 , world: world4  }){
            this.app = app1;
            this.world = world4;
            Render.app.view.addEventListener("wheel", (event)=>{
                event.preventDefault();
                if (!this.world.minimap.open) {
                    this.world.sprites.world.position.set(Math.round(this.world.sprites.world.position.x - event.deltaX), Math.round(this.world.sprites.world.position.y - event.deltaY));
                } else {
                    this.world.minimap.sprite.position.set(Math.round(this.world.minimap.sprite.position.x - event.deltaX), Math.round(this.world.minimap.sprite.position.y - event.deltaY));
                }
                this.world.camera.render();
            });
            global.document.addEventListener("keydown", ({ code  })=>{
                switch(code){
                    case "ArrowLeft":
                        this.world.camera.x--;
                        this.world.camera.render();
                        break;
                    case "ArrowRight":
                        this.world.camera.x++;
                        this.world.camera.render();
                        break;
                    case "ArrowUp":
                        this.world.camera.y--;
                        this.world.camera.render();
                        break;
                    case "ArrowDown":
                        this.world.camera.y++;
                        this.world.camera.render();
                        break;
                }
            });
            global.document.querySelector("[data-control-for='map']")?.addEventListener("click", ()=>this.world.minimap.toggle()
            );
            global.document.querySelector("[data-control-for='debug']")?.addEventListener("click", ()=>{
                global.document.querySelector("nav.debug").style.display = global.document.querySelector("nav.debug").style.display === "flex" ? "none" : "flex";
            });
            Object.keys(App1.debug).forEach((key)=>{
                const input = global.document.createElement("input");
                input.setAttribute("data-control-for", key);
                input.setAttribute("type", "checkbox");
                input.checked = App1.debug[key];
                input.addEventListener("change", ()=>App1.debug[key] = input.checked
                );
                const label = global.document.createElement("label");
                label.innerText = key;
                label.prepend(input);
                global.document.querySelector(".debug")?.append(label);
            });
            console.log(App1.debug);
        }
        updateDOM() {
            const location = global.document.querySelector("#location .name");
            if (location) location.innerHTML = this.world.camera.location[0] ?? "-  ";
            const position = global.document.querySelector("#location .position");
            if (position) position.innerHTML = `${this.world.camera.x};${this.world.camera.y}`;
        }
    }
    class Area extends Renderable {
        id;
        sprite;
        data;
        polygon;
        npcs = new Set();
        constructor({ id: id1 , data: data1 , world: world5  }){
            super({
                world: world5
            });
            this.id = id1;
            this.data = data1;
            this.polygon = Render.Polygon(this.data.points);
            this.sprite = Render.Container();
            if (App1.debug.logs) console.debug(`loaded area: ${this.id}`);
        }
        contains({ x , y  }) {
            return this.polygon.contains(x * 16, y * 16);
        }
        debug() {
            if (!this._debug) this._debug = this.world.sprites.debug.addChild(Render.Graphics({
                text: this.id,
                textStyle: {
                    fontSize: 12,
                    fill: "white"
                },
                stroke: [
                    1,
                    65280,
                    0.5
                ],
                fill: [
                    65280,
                    0.25
                ],
                polygon: this.polygon
            }));
            if (this._debug && App1.debug.areas) this._debug.tint = this.contains(this.world.camera) ? 16777215 : 16711935;
            return super.debug(App1.debug.areas);
        }
        render() {
            setTimeout(()=>this.spawn()
            , 1000);
        }
        destructor() {
            if (App1.debug.logs) console.debug(`unloaded loaded area: ${this.id}`);
            this.npcs.forEach((npc)=>npc.destructor()
            );
            this.npcs.clear();
            return super.destructor();
        }
        static from({ data , chunk  }) {
            const id1 = `${data.id}`;
            if (!chunk.world.loaded.areas.has(id1)) chunk.world.loaded.areas.set(id1, new Area({
                id: id1,
                data,
                world: chunk.world
            }));
            const area1 = chunk.world.loaded.areas.get(id1);
            chunk.areas.add(area1);
            return area1;
        }
        spawn() {
            console.log(this.data.properties);
            new NPC({
                world: this.world,
                area: this
            }).show();
        }
    }
    class Chunk extends Renderable {
        id;
        sprite;
        data = null;
        layers = new Map();
        areas = new Set();
        world;
        constructor({ id: id2 , world: world6  }){
            super({
                world: world6
            });
            this.id = id2;
            this.world = world6;
            [this.x, this.y] = this.id.split(";").map((n)=>Number(n) * CHUNK_SIZE
            );
            this.width = this.height = CHUNK_SIZE;
            this.sprite = this.world.sprites.chunks.addChild(Render.Container({
                x: this.x,
                y: this.y
            }));
            if (App1.debug.chunks) console.debug(`loaded chunk: ${this.id}`);
        }
        destructor() {
            if (App1.debug.chunks) console.debug(`unloaded loaded chunk: ${this.id}`);
            this.layers.clear();
            this.areas.clear();
            return super.destructor();
        }
        show() {
            super.show();
            this.data?.areas?.forEach((area1)=>Area.from({
                    data: area1,
                    chunk: this
                })?.show()
            );
        }
        debug() {
            if (!this._debug) this._debug = this.world.sprites.debug.addChild(Render.Graphics({
                text: this.id,
                textStyle: {
                    fontSize: 12,
                    fill: "white"
                },
                stroke: [
                    1,
                    255,
                    0.5
                ],
                fill: [
                    255,
                    0.25
                ],
                rect: [
                    0,
                    0,
                    this.width,
                    this.height
                ]
            }));
            return super.debug(App1.debug.chunks);
        }
        async render() {
            if (!this.data) this.data = await fetch(`/map/overworld/${this.id}`).then((res)=>res.json()
            );
            this.layers.set("0X", this.sprite.addChild(Render.TilingSprite({
                frame: 0,
                width: 32,
                height: 32
            })));
            for (const { name , sublayers , sorted =false  } of [
                {
                    name: "1X",
                    sublayers: [
                        "1A",
                        "1B",
                        "1C"
                    ]
                },
                {
                    name: "2X",
                    sublayers: [
                        "2A",
                        "2B",
                        "2C"
                    ],
                    sorted: true
                }, 
            ]){
                if (!this.layers.has(name)) this.layers.set(name, this.sprite.addChild(Render.Container({
                    z: 0,
                    sorted
                })));
                const layer = this.layers.get(name);
                for(let z = 0; z < sublayers.length; z++){
                    const tiles = this.data?.chunk?.layers?.[sublayers[z]];
                    if (!tiles) continue;
                    for(let i = 0; i < tiles.length; i++){
                        const tile = tiles[i];
                        if (tile >= 0) {
                            const y2 = i % 32, x2 = Math.floor(i / 32);
                            layer.addChild(Render.Sprite({
                                frame: tile,
                                x: x2,
                                y: y2,
                                z: y2 * 32 + z
                            }));
                        }
                    }
                }
            }
        }
    }
    class Camera extends Renderable {
        sprite;
        constructor({ world: world7  }){
            super({
                world: world7
            });
            this.sprite = this.world.sprites.world.addChild(Render.Container());
            Object.defineProperties(this, {
                x: {
                    get: ()=>Math.floor((-this.world.sprites.world.position.x + global.document.body.clientWidth / 2) / 16)
                    ,
                    set: (x2)=>this.moveTo({
                            x: x2,
                            y: this.y
                        })
                },
                y: {
                    get: ()=>Math.floor((-this.world.sprites.world.position.y + global.document.body.clientHeight / 2) / 16)
                    ,
                    set: (y2)=>this.moveTo({
                            x: this.x,
                            y: y2
                        })
                }
            });
            this.render();
        }
        throttle = false;
        debounce = false;
        debug() {
            if (!this._debug) this._debug = this.world.sprites.debug.addChild(Render.Graphics({
                fill: [
                    16711680,
                    0.5
                ],
                rect: [
                    0,
                    0,
                    1,
                    1
                ]
            }));
            return super.debug(App1.debug.camera);
        }
        render({ DX =1 , DY =1 , DM =3  } = {
        }) {
            if (this.throttle) {
                this.debounce = true;
                return;
            }
            this.throttle = true;
            this.debug();
            const { x: x2 , y: y2  } = this;
            const X = Math.floor(x2 / 32);
            const Y = Math.floor(y2 / 32);
            const visible = [];
            for(let x3 = X - DX; x3 <= X + DX; x3++)for(let y3 = Y - DY; y3 <= Y + DY; y3++)visible.push(`${x3};${y3}`);
            visible.forEach((id3)=>{
                if (!this.world.loaded.chunks.has(id3)) this.world.loaded.chunks.set(id3, new Chunk({
                    id: id3,
                    world: this.world
                }));
                this.world.loaded.chunks.get(id3)?.show();
            });
            this.world.loaded.chunks.forEach((chunk, id3)=>{
                if (!visible.includes(id3)) {
                    chunk.hide();
                    if (Math.sqrt((chunk.x - X) ** 2 + (chunk.y - Y) ** 2) > DM) {
                        this.world.loaded.chunks.delete(id3);
                        chunk.destructor();
                    }
                }
            });
            const areas = new Set();
            this.world.loaded.chunks.forEach((chunk)=>chunk.areas.forEach((area1)=>areas.add(area1)
                )
            );
            this.world.loaded.areas.forEach((area1, id3)=>{
                if (!areas.has(area1)) {
                    this.world.loaded.areas.delete(id3);
                    area1.destructor();
                }
            });
            this.world.app?.controller?.updateDOM();
            setTimeout(()=>{
                this.throttle = false;
                if (this.debounce) {
                    this.debounce = false;
                    this.render();
                }
            }, 200);
        }
        get location() {
            return [
                ...this.world.loaded.areas.values()
            ].filter((area1)=>(area1.data.type === "locations" || area1.data.type === "regions") && area1.contains(this)
            ).map(({ data: data2  })=>data2.name
            );
        }
        moveTo({ x , y  }) {
            this.world.sprites.world.position.set(-x * 16 + global.document.body.clientWidth / 2, -y * 16 + global.document.body.clientHeight / 2);
            this.render();
        }
    }
    class World {
        sprites;
        loaded = {
            chunks: new Map(),
            areas: new Map()
        };
        camera;
        minimap;
        name = "overworld";
        app;
        constructor({ app: app2  }){
            this.app = app2;
            const sprite = Render.app.stage.addChild(Render.Container());
            this.sprites = {
                world: sprite,
                chunks: sprite.addChild(Render.Container()),
                locations: sprite.addChild(Render.Container()),
                debug: sprite.addChild(Render.Container()),
                minimap: Render.app.stage.addChild(Render.Container())
            };
            this.camera = new Camera({
                world: this
            });
            this.minimap = new Minimap({
                world: this
            });
            const textures = [
                2374,
                2375,
                2376,
                2377,
                2378,
                2379,
                2380,
                2381
            ].map((frame)=>Render.Texture({
                    frame
                })
            );
            let tick = 0;
            Render.engine.Ticker.shared.add(()=>{
                tick += 0.0625;
                if (Number.isInteger(tick)) this.loaded.chunks.forEach((chunk)=>{
                    if (chunk.layers.has("0X")) chunk.layers.get("0X").texture = textures[tick % textures.length];
                });
                this.loaded.areas.forEach((area1)=>area1.npcs.forEach((npc)=>npc.update(tick)
                    )
                );
            });
        }
        chunkAt({ x , y  }) {
            return this.loaded.chunks.get(`${Math.floor(x / 32)};${Math.floor(y / 32)}`);
        }
    }
    globalThis.app = new App1();
    return {
        App: App1
    };
})();
