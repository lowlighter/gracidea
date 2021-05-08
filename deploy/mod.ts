//Imports
import {event} from "../build/constants.ts"
import { route } from "../server/router.ts"

//Event listener
addEventListener("fetch", (event: event) => event.respondWith(route(event.request, { deploy: true })))
