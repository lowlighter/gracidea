/**
 * Copyright 2017, Lecoq Simon (@lowlighter)
 * @license https://github.com/lowlighter/gracidea/blob/master/LICENSE
 */

//Imports
  import App from "./app/app.js"

//Instantiate app
  ;(async function () {
    const app = new App({world:"overworld"})
    await app.ready
  })() 