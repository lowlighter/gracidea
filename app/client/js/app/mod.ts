/**
 * Copyright Simon Lecoq (@lowlighter)
 * @license https://github.com/lowlighter/gracidea/blob/main/LICENSE
 */

//Imports
import { global } from "./types.ts";
import { App } from "./app.ts";

//Start app
global.gracidea.app = await App.setup();
