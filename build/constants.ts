/** Tile size in pixels */
export const TILE_SIZE = 16

/** Tile padding in pixels */
export const TILE_PADDING = 2

/** Chunk size in tiles */
export const CHUNK_SIZE = 32

/** Window */
//deno-lint-ignore no-explicit-any
export const global = globalThis as any

/** Event */
//deno-lint-ignore no-explicit-any
export type event = any

/** Read-write */
//deno-lint-ignore no-explicit-any
export type rw = any

/** Async definition */
//deno-lint-ignore no-explicit-any
export type asyncdef = any

/** Loose type */
//deno-lint-ignore no-explicit-any
export type loose = { [key: string]: any }

/** Animated tiles */
export const ANIMATED = {
  2266: {
    frames: [2266, 2267, 2268, 2269].map(frame => `${frame}`),
    speed: 0.025,
  },
  2374: {
    frames: [2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381].map(frame => `${frame}`),
    speed: 0.075,
  },
  658: {
    frames: [658, 659, 660, 659].map(frame => `${frame}`),
    speed: 0.05,
  },
  661: {
    frames: [661, 662, 663, 664, 663, 664, 663, 664, 663, 664, 662, 661, 661, 661].map(frame => `${frame}`),
    speed: 0.05,
  },
  774: {
    frames: [774, 775, 776, 777, 776, 777, 776, 777, 776, 777, 775, 774, 774, 774].map(frame => `${frame}`),
    speed: 0.05,
  },
}

/** Flying creatures */
export const CREATURES_FLYING = ["wingull", "pelipper"]
