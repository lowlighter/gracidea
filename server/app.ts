//Imports
import { route } from "./router.ts"

//Start server
const port = 4000
console.debug(`listening on port: ${port}`)
for await (const connection of Deno.listen({ port })) {
  void (async () => {
    for await (const { request, respondWith } of Deno.serveHttp(connection))
      respondWith(route(request))
  })()
}
