//Imports
import { build } from "app/build/build.ts";

//Entry point
if (import.meta.main) {
  await build();
}
