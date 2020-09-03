/**
 * Application settings.
 */
  export default function () {
    //Pixi Settings
      PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
      PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.OFF
      PIXI.settings.GC_MODE = PIXI.GC_MODES.MANUAL
      PIXI.settings.PRECISION_VERTEX = PIXI.PRECISION.LOW
      PIXI.settings.ROUND_PIXELS = true
      PIXI.Ticker.shared.maxFPS = 30
  }