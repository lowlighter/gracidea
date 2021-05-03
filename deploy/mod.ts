//Imports
  import {route} from "../server/router.ts"

//Event listener
  addEventListener("fetch", (event:any) => event.respondWith(route(event.request, {deploy:true})))