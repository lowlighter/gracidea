/**
 * Copyright Simon Lecoq (@lowlighter)
 * @license https://github.com/lowlighter/gracidea/blob/main/README.md
 */

//Imports
import { global } from "./types.ts"
import { App } from "./app.ts"

//Start app
global.gracidea.app = await App.setup()
