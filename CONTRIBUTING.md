# 🌺 Gracidea contribution guide

![](/.github/README/gracidea.webp)

# 🗃️ Project structure
```
gracidea
├── build                  │ Scripts to build data and sprites
├── client                 │ Client source code
│   ├── app                │ App source code
│   └── static             │ Static assets
│       └── copyrighted    │ Copyrighted assets
├── deploy                 │ Deno deploy source code
├── maps                   │ Maps data
│   └── sprites            │ Texture packer projects
├── server                 │ Server source code
└── tests                  | Tests
```

# 🤙 Contributions workflow

## ℹ️ Prerequisites
* Changes must be discussed first through [discussions](https://github.com/lowlighter/gracidea/discussions) and [issues](https://github.com/lowlighter/gracidea/issues)
* Ensure that you do not duplicate another [active pull request](https://github.com/lowlighter/gracidea/pulls)

## 🤝 Contributing
* Fork this repository
* Create a [draft pull request](https://github.com/lowlighter/gracidea/compare) to let other contributors know that you are working on something
* Integrate new features
  * Branches are automatically deployed with [deno deploy](https://deno.com/deploy) so everyone can preview changes online
  * [GitHub actions](https://github.com/features/actions) will automatically perform code quality checks and tests
* Once all tests are passing and you are satisfied with your changes, mark your pull request as ready for review
* After being approved by a maintainer, your pull request will be merged to `main` branch

# 🗺️ Mapping additional content

## ℹ️ Prerequisites
* Setup [tiled map editor](https://github.com/mapeditor/tiled)

> ⚠️ **ALWAYS BACKUP YOUR CHANGES BEFORE PULLING!** Unlike code conflicts, maps and sprite conflicts cannot be easily solved

## 📝 Guidelines
* Changes should be located on a few chunks from the same area
  * Pull request will automatically fail tests when editing a large amount of chunks or tiles that are too far away one from another
* Changes must be backed up by (in the following order):
  * Core games
  * Side games
  * Official artworks
  * Anime and manga
* Fixes (e.g. missing tiles or wrong tiles) do not need to be documented
* Minor arrangements are accepted provided they are revelant (e.g. displaying indoor maps in overworld)

## ☢️ Solving conflicts
* For maps editions:
  * Rename changed map and git checkout it
  * Within [tiled map editor](https://github.com/mapeditor/tiled), copy back your changes to the up-to-date map
  * Commit and update your pull request
* For sprites editions:
  * Rename changed spritesheet and git checkout it
  * Re-apply your changes to up-to-date spritesheet
  * Commit and update your pull request
* For code editions:
  * Follow usual git conflicts resolution

## 🗾 Map new areas

![](https://user-images.githubusercontent.com/22963968/117547108-21fac980-b02e-11eb-8022-b01defbb3332.png)

* Layers `1A`, `1B` and `1C` are reserved for ground related tiles
  * `1A` is used for ground tiles (except sea tiles)
  * `1B` is used for ground paths tiles and ground limits
  * `1C` is used when you need an additional layer (avoid using it)
* Sea tiles are handled differently than other tiles, do not map them

![](https://user-images.githubusercontent.com/22963968/117547161-6e460980-b02e-11eb-8e32-a7eef7559944.png)

* Layers `2A`, `2B` and `2C` are reserved for elements related tiles
  * `2A` is used for lower elements tiles (e.g. grass, flowers, etc.)
  * `2B` is used for middle elements tiles (e.g. houses, trees, etc.)
  * `2C` is used for upper elements tiles (e.g. roofs, top of trees, etc.)

## 🌿 Define new wild areas

![](https://user-images.githubusercontent.com/22963968/117546732-23c38d80-b02c-11eb-8d54-d4d44ab46fdb.png)

* Create a new polygon on `creatures` layer
  * Polygon should be neither too big or complex, prefer splitting in smaller chunks large areas
* Set `name` to a valid location area (see [PokéAPI location areas](https://pokeapi.co/api/v2/location-area))
* Set `type` to a valid encounter method (see [PokéAPI encounter methods](https://pokeapi.co/api/v2/encounter-method))

## 🧑 Define new characters areas

![](https://user-images.githubusercontent.com/22963968/117546843-d09e0a80-b02c-11eb-8a22-62680138995c.png)

* Create a new polygon on `people` layer
  * Polygon should be neither too big or complex
* Set `name` to a valid character name (same name as sprite name, without animations suffixes)
* Set `type` to a valid pattern method:
  * `fixed` to make it static
  * `inplace` to make it static but with walk animation
  * `lookaround` to make it look around without moving
  * `wander` to make it wander inside defined area
  * `loop` to make it loop around area perimeter
  * `patrol` to make it run around area perimeter and go back in reverse direction
* When using `fixed`, `inplace` or `lookaround`, you can add custom boolean properties for `up`, `down`, `left` and `right` to set allowed directions

## 🏙️ Define new locations

![](https://user-images.githubusercontent.com/22963968/117547545-69825500-b030-11eb-9972-412242247b38.png)

* Create a new square on `locations` layer
  * It should cover the in-game defined map area when possible
* Set `name` to a valid location name

## 📌 Define new pins

![](https://user-images.githubusercontent.com/22963968/117547432-e234e180-b02f-11eb-8bae-8a46e09d03c8.png)

* Create a new square on `pins` layer
  * It should be located on a "fly tile" (e.g. *Pokémon center*, *Player's house*, etc.)
* Set `name` to same as current location
* Set `region` to a valid region name
* Set `mx` and `my` to correct position
  * These must be guessed through the mini-map

# 🎨 Provide new sprites
* *Pokémon* sprites are provided by [msikma/pokesprite](https://github.com/msikma/pokesprite) and are built automatically
  * In case of innaccuracies, contribute there instead
* *NPCs* sprites *(todo)*
* *Tilesets* sprites are located in [maps/sprites](https://github.com/lowlighter/gracidea/tree/main/maps/sprites)
  * Only edit `.png` files
  * Each *missingno tile* (purple tiles) is an available slot for a future tile
  * Do not remove tile padding
  * Custom sprites can be made, but should be consistent in style for given tileset
  * Sprites must be grouped by theme whenever possible

# 💻 Code additional features

## ℹ️ Prerequisites
* You'll need to be familiar with [TypeScript](https://github.com/microsoft/TypeScript)
* Setup [deno runtime](https://github.com/denoland/deno) and [velociraptor script manager](https://github.com/jurassiscripts/velociraptor) in your environment

## 📜 Coding rules
* Avoid "`pokemon`" (including names) and other copyrighted materials in code
* Avoid explicit type definitions and let TypeScript infers types
* Use single words when context allow it. If this is not possible, your code may be too complex and may be splitted in smaller contexts

Code is formatted with [dprint](https://github.com/dprint/dprint) for the remaining part so you do not need to worry about it.

# 🦖 Testing local changes

See [velociraptor.yml](/velociraptor.yml) for a list of available commands shortcuts.
Below are the most useful ones:
- `vr start` to start a local server and preview your changes
- `vr build --data` to rebuild map data
- `vr test` to perform local tests