//Imports
import { route } from "./router.ts"

//Start server
for await (const connection of Deno.listen({ port: 4000 })) {
  ;(async () => {
    for await (const { request, respondWith } of Deno.serveHttp(connection))
      respondWith(route(request))
  })()
}
