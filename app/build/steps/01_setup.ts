//Imports
import { clone, log, pack } from "../util.ts";

/** Setup environment */
export default async function () {
  log.step("setup environment");

  //Clone dependencies repositories
  await clone({ repo: "PokeAPI/api-data", dir: "app/build/cache/data" });
  await clone({ repo: "msikma/pokesprite", dir: "app/build/cache/creatures" });
  await clone({ repo: "lowlighter/gracidea", dir: "app/build/cache/previous" });

  //Pack package dependencies
  await pack({ pkg: "pixi.js", dir: "app/build/cache/pixi.js" });

  log.success();
}
