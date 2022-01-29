# 🌺 Contribution guide

> ⚠️ The guidelines of this project are voluntarily strict to avoid any drift, please read carefully to avoid any  disappointment

> ⚠️ Keep in mind that *Gracidea* is **NOT A GAME PROJECT**, only an artistic project. All suggestions related to introduction of game mechanics (player, battles, captures, etc.) will be **systematically rejected**.

- Perform a search on this repository to ensure that:
  - Nobody is working on it currently
  - It has not been already suggested or [ruled out](https://github.com/lowlighter/gracidea/labels/%E2%9B%94%20wontdo)
- Open a [`discussion`](https://github.com/lowlighter/gracidea/discussions/new?category=ideas) before starting any changes
  - Be respectful
  - Wait for feedback from other people
  - Wait for an approval by a maintainer (an associated issue will automatically be created)
- Perform editions and open [pull request](https://github.com/lowlighter/gracidea/pulls)
  - Ensure that all builds are passing
  - Preview you changes through the [Vercel](https://vercel.com) deployment link
  - Wait for reviews
- Pull request will be merged if approved, thanks for contributing 🥳 !

> ℹ️ For easier maintaining, inactive issues and pull requests will automatically be closed after a certain amount of time

## 🗺️ For mappers

### 🤝 Accepted contributions

> ⚠️ Any change **must** be motivated through official supporting references, such as games, anime, manga or promotional artworks (in this prefered order).
>
> Not following this instruction may result in a pull request closure without notice

> ℹ️ Apart from first generations core games, other mapping sources will require a bit of creativity and adaption. The aim is to be faithful while making these custom maps integrate nicely. Most of the time, it means:
> - Making important building or features present
> - Respect more or less the map scale
> - Not bloating a map section with too much tiles

- ✔️ Fix maps and/or textures errors
- ✔️ Add or create new maps (in the following preference order):
  - ✔️ From core games
  - ✔️ From spin-offs game
  - ✔️ From anime or manga
  - ✔️ From promotional artworks
  - ✔️ Custom fillers maps
- ✔️ Add or create new textures
  - *⚠️ New textures styles are allowed provided they respect a given core game style*

### 📦 Requirements

- Mapping knowledge
  - [Tiled map editor](https://doc.mapeditor.org/en/stable/) general knowledge
- Mapping environment
  - [Tiled map editor](https://www.mapeditor.org)
  - [TexturePacker](https://www.codeandweb.com/texturepacker)
    - *⚠️ A license may be required to regenerate textures*
  - Any image editing software

GitHub users having access to [GitHub codespaces](https://github.com/features/codespaces) may directly use the custom container with all dependencies installed (this also include [Tiled map editor](https://www.mapeditor.org) which is accessible through [NoVNC](https://novnc.com))

### 📚 How-to

#### Map editions

Open [Tiled map editor](https://www.mapeditor.org) and load [`maps/gracidea.world`](/maps/gracidea.world).
Start editing a new map file or an existing map file.

- Maps filenames **must** follow this convention:
  - `${region}/${location-area}.tmx` for official maps, where `location-area` is defined in [pokeapi.co/api/v2/location-area](https://pokeapi.co/api/v2/location-area)
  - `${region}/anime-${name}.tmx` for anime locations
  - `${region}/manga-${name}.tmx` for manga locations
  - `${region}/fill-${number}.tmx` for custom filler maps, where `number` is an unused number
- Maps layers **must** follow this convention and have:
  - `creatures` object layer for area with wild encounters
    - Create a new polygon having name set to an `encounter-method` defined in [pokeapi.co/api/v2/encounter-method](https://pokeapi.co/api/v2/encounter-method)
    - *ℹ️ Encounter rates are auto-generated and do not need any further editions*
  - `people` object layer for human NPCs
    - Create a new polygon having name set to a [supported NPC texture](/copyrighted/textures/rse/npcs.json), and type set to a [supported NPC pattern](https://github.com/lowlighter/gracidea/blob/74505b775d2a4eace0e61e05dc263bff28a9afa7/app/client/js/app/maps/npc.human.ts#L99-L106)
  - `${X}` tiles layer where `X` is a number between `1` and `4`
    - Use the tileset to fill this map, with these guidelines:
      - `1` Ground tiles
      - `2` Secondary ground tiles (road paths, flowers, grass, etc.)
      - `3` Objects (houses, trees, panels, etc.)
      - `4` High objects (roof, tree top, etc.)
    - Sea **must** not be mapped

> ℹ️ A world map must then be added to `gracidea.world` and saved

#### World map editions

Open [Tiled map editor](https://www.mapeditor.org) and load [`maps/all/worldmap.tmx`](/maps/all/worldmap.tmx).
Start editing file.

- World map layers **must** follow this convention:
  - `links` object layer for location link
    - Create a new polygon and set name to `${region}/${location-area}` where `location-area` is defined in [pokeapi.co/api/v2/location-area](https://pokeapi.co/api/v2/location-area)
  - `interests.*` tiles layer is used for interests points
  - `cities.*` tiles layer is used for cities and towns
  - `roads.*` tiles layer is used for roads
  - `${region}` image layer needs to reference a [supported region](/copyrighted/textures/all/regions)
  - `roads.sea` tiles layer is used for sea roads which needs to appear below regions render
  - `*.ext` layers are used to define locations from extended sources, such as spin-offs, anime, manga, etc.
  - `*.core` layers are used to define locations from core games

#### Textures editions (specific style)

Open `copyrighted/textures/${style}/tileset.png` where `style` is a supported style (any folder except `all`).
Start editing file.

Create new tiles on "MissingNo" placeholders and try to group related tiles together.

> ⛔ Do not resize `tileset.png`, its dimensions are used internally for other applications

> ⚠️ Other files such as `creatures.{json,tps,webp}`, `npcs.{json,webp}` and `tileset.{json,tps,tsx,webp}` should not be edited directly. They are either generated automatically or rebuilt with [TexturePacker](https://www.codeandweb.com/texturepacker)

#### Texture editions (all)

Textures located in `copyrighted/textures/all` are handled differently than style texture packs.

For regular tilesets, edit the associated `.png` file and create new tiles on "MissingNo" placeholders and try to group related tiles together.

For world regions, create a new `.png` file in `copyrighted/textures/all/regions`.

## 👨‍💻 For developpers

### 🤝 Accepted contributions

> ⚠️ Please open a [`discussion`](https://github.com/lowlighter/gracidea/discussions/new?category=ideas) first and wait for feedback and approval before starting to code.
>
> Not following this instruction may result in a pull request closure without notice

- ✔️ Performance improvements
- ✔️ Features additions
  - *⛔ All "gaming features" will systematically rejected*
  - *⚠️ Complex features may be rejected, this is why it is required to open a [`discussion`](https://github.com/lowlighter/gracidea/discussions/new?category=ideas) first*
- ✔️ Data externalisation
  - *⚠️ Any external source used must be trustworthy and be "established"*
- ✔️ Tests additions
- ❌ Build scripts refactoring
- ❌ Repository-level files editions (`LICENSE`, `CODE_OF_CONDUCT`, `.github`)

### 📦 Requirements

- Development knowledge
  - [TypeScript](https://www.typescriptlang.org) fluency
    - *⚠️ Including typing system, using `any` everywhere is not allowed!*
  - [Vanilla JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) general knowledge
    - *⚠️ Including ESNext features and syntax, future is now!*
    - *⛔ External libraries (except `pixi.js`) are not allowed to avoid bloating, as this app is already quite heavy*
  - [PixiJS rendering engine](https://pixijs.com) general knowledge
- Development environment
  - [Deno runtime](https://deno.land)
  - [Velociraptor script manager](https://velociraptor.run)
  - Basic tools (`git`, `npm`, `tar`, ...)
    - *⚠️ [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl) is required for Windows users*

GitHub users having access to [GitHub codespaces](https://github.com/features/codespaces) may directly use the custom container with all dependencies installed (this also include [Tiled map editor](https://www.mapeditor.org) which is accessible through [NoVNC](https://novnc.com))


### 📚 How-to

Use `vr build` and then `vr start` to start a local instance.

> ⚠️ Note that by default, already generated data are not rebuilt if files are already present. Pass `--clean` flag to ensure that cache is fully reloaded

Changes should pass `vr fmt` and `vr lint`.
