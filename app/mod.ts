//Imports
import { serve } from "./server/serve.ts"

//Start server
if (import.meta.main)
  await serve()