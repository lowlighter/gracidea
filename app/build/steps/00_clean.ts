//Imports
import { clean, log } from "../util.ts";

/** Clean environment */
export default async function ({ perform = false }) {
  log.step("cleaning environment");

  //Remove previous directories
  if (perform) {
    for (const path of ["app/public", "app/build/cache"]) {
      await clean({ path });
    }
  } else {
    log.debug("(nothing to do)");
  }

  log.success();
}
