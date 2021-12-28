/** Imports */
import { Server } from "https://deno.land/std@0.119.0/http/server.ts";
import { parse } from "https://deno.land/std@0.119.0/path/mod.ts";
import { api } from "./api/mod.ts";
import { mime } from "./utils.ts";

/** Deployment id */
let deploy = ""
try {
  deploy = Deno.env.get("DENO_DEPLOYMENT_ID") ?? ""
}
catch {
  //No-op
}

/** Server entrypoint */
export async function serve({ port = 4000 }: { port?: number } = {}) {
  const listener = Deno.listen({ port });
  const server = new Server({
    async handler(request) {
      try {
        //Extract request
        const { pathname: path, search } = new URL(request.url);
        const { dir, base: file, ext } = parse(path);
        const query = Object.fromEntries(new URLSearchParams(search).entries());
        console.debug(`serving ${path}`);

        //Prepare header
        const headers = new Headers();
        headers.set("content-type", `${mime(ext)}; charset=utf-8`);
        headers.set("cache-control", "public, max-age=86400, immutable")

        //API endpoints
        if (dir.startsWith("/api")) {
          return api({ endpoint: path.replace("/api", ""), headers, query });
        }

        //Index
        if ((dir === "/") && ((!file) || (file === "index.html"))) {
          headers.set("content-type", `${mime(".html")}; charset=utf-8`);
          const index = await fetch(new URL(`../client/index.html`, import.meta.url)).then((response) => response.text());
          const body = index.replace("{{deploy}}", deploy);
          return new Response(body, { headers });
        }

        //Client app (debug mode auto-bundling)
        if ((query.debug) && (dir === "/js") && (["app.js", "app.js.map"].includes(file))) {
          headers.set("content-type", `${mime(".js")}; charset=utf-8`);
          const { files } = await Deno.emit(new URL("../client/js/app/mod.ts", import.meta.url).href, { bundle: "module" });
          return new Response(files[`deno:///bundle${{ "app.js": ".js", "app.js.map": ".js.map" }[file]}`], { headers });
        }

        //Static assets
        for (const assets of ["../client", "../../copyrighted"]) {
          try {
            const { body, status } = await fetch(new URL(`${assets}/${path}`, import.meta.url));
            if (status !== 200) {
              continue;
            }
            return new Response(body, { headers });
          } catch {
            continue;
          }
        }
        return new Response(null, { status: 404 });
      } catch (error) {
        console.error(error);
        return new Response(null, { status: 500 });
      }
    },
  });
  console.debug(`listening on port ${port}`);
  await server.serve(listener);
}
