//Imports
import { serve } from "./server/serve.ts";

//Entry point
if (import.meta.main) {
  await serve();
}
