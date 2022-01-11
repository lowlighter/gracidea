/**
 * Copyright Simon Lecoq (@lowlighter)
 * @license https://github.com/lowlighter/gracidea/blob/main/LICENSE
 */

//Imports
import { global } from "app/client/types.ts";
import { App } from "app/client/app.ts";

//Start app
global.gracidea.app = await App.setup();
