//Imports
import { build } from "./build.ts";

//Entry point
if (import.meta.main) {
  await build();
}
