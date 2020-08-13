/**
 * Application settings.
 */
  export default function () {
    //Pixi Settings
      PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
      PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.OFF
      PIXI.Ticker.shared.maxFPS = 30
  }