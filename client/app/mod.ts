/**
 * Copyright Simon Lecoq (@lowlighter)
 * @license https://github.com/lowlighter/gracidea/blob/main/README.md
 */
//Imports
import { App } from "./app.ts"

//Start app
//deno-lint-ignore no-explicit-any
;(globalThis as any).app = new App()
