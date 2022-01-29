//Imports
import { ensureDir, expandGlob } from "std/fs/mod.ts";
import { copy } from "std/fs/copy.ts";
import { clone, log, read, save } from "app/build/util.ts";
import maps from "app/build/steps/20_maps.ts";

/** Compute diff */
export default async function () {
  log.step("computing diff with previous state");

  //Setup
  await clone({ repo: "lowlighter/gracidea", dir: "app/build/cache/previous" });

  //Generate previous maps data
  if (await Deno.lstat(`app/build/cache/previous/app/public/data/maps`).then(() => true).catch(() => false)) {
    log.debug(`built: previous maps data (already present)`);
  } else {
    log.progress(`building: previous maps data`);
    await ensureDir("app/build/cache/previous/app/public/data/maps/");
    await copy("app/public/data/maps/data.json", "app/build/cache/previous/app/public/data/maps/data.json", { overwrite: true });
    const cwd = Deno.cwd();
    Deno.chdir("app/build/cache/previous");
    await maps({ preload: false });
    Deno.chdir(cwd);
    log.debug(`built: previous maps data`);
  }
  //Compute maps data diff
  {
    //List maps data
    const ids = new Set();
    for (const glob of ["app/public/data/maps/*/**/*.json", "app/build/cache/previous/app/public/data/maps/*/**/*.json"]) {
      for await (const { path } of expandGlob(glob)) {
        const id = path.replaceAll("\\", "/").replace(/^[\s\S]*app\/public\/data\/maps\//, "").replace(/\.json$/, "");
        ids.add(id);
      }
    }

    //Compute diff
    const patches = [];
    for (const id of ids) {
      log.progress(`processing: ${id}`);
      const A = await read(`app/build/cache/previous/app/public/data/maps/${id}.json`).catch(() => ({ chunks: [], areas: [] }));
      const B = await read(`app/public/data/maps/${id}.json`).catch(() => ({ chunks: [], areas: [] }));
      const diff = { tiles: {}, areas: {} } as {
        tiles: { [chunk: string]: { [tile: number]: { d: "+" | "-" | "~"; a: number | null; b: number | null } } };
        areas: { [area: number | string]: { d: "+" | "-" | "~"; a: unknown | null; b: unknown | null } };
      };

      //Chunks diff
      {
        const a = Object.fromEntries(A.chunks.map((chunk: { layer: number; x: number; y: number }) => [`${chunk.layer}/${chunk.x};${chunk.y}`, chunk]));
        const b = Object.fromEntries(B.chunks.map((chunk: { layer: number; x: number; y: number }) => [`${chunk.layer}/${chunk.x};${chunk.y}`, chunk]));
        for (const id of Object.keys(a).filter((id) => !Object.keys(b).includes(id))) {
          b[id] = { ...a[id], tiles: new Array(a[id].tiles.length).fill(0) };
          B.chunks.push(a[id]);
        }

        //Tiles diff
        for (const id of Object.keys(b)) {
          const d = diff.tiles[b[id]?.id] ??= {};
          const tiles = Math.max(a[id]?.tiles.length ?? 0, b[id]?.tiles.length ?? 0);
          for (let i = 0; i < tiles; i++) {
            const t = { a: a[id]?.tiles[i] ?? 0, b: b[id]?.tiles[i] ?? 0 };
            if ((!t.a) && (t.b)) {
              d[i] = { d: "+", a: null, b: t.b };
            } else if ((t.a) && (!t.b)) {
              d[i] = { d: "-", a: t.a, b: null };
            } else if (t.a !== t.b) {
              d[i] = { d: "~", a: t.a, b: t.b };
            }
          }
          if (!Object.keys(d).length) {
            delete diff.tiles[b[id]?.id];
          }
        }
        if (!Object.keys(diff.tiles).length) {
          delete (diff as { tiles?: unknown }).tiles;
        }
      }

      //Areas diff
      {
        const a = Object.fromEntries(A.areas.map((area: { id: string }) => [area.id, area]));
        const b = Object.fromEntries(B.areas.map((area: { id: string }) => [area.id, area]));
        for (const id of Object.keys(a).filter((id) => !Object.keys(b).includes(id))) {
          b[id] = null;
          B.areas.push(a[id]);
        }

        //Areas diff
        const d = diff.areas ??= {};
        for (const id of Object.keys(b)) {
          const r = { a: a[id] ?? null, b: b[id] ?? null };
          const i = id;
          if ((!r.a) && (r.b)) {
            d[i] = { d: "+", a: null, b: r.b };
          } else if ((r.a) && (!r.b)) {
            d[i] = { d: "-", a: r.a, b: null };
          } else if ((r.a) && (r.b) && (JSON.stringify(r.a) !== JSON.stringify(r.b))) {
            d[i] = { d: "~", a: r.a, b: r.b };
          }
        }
        if (!Object.keys(diff.areas).length) {
          delete (diff as { areas?: unknown }).areas;
        }
      }

      //Report
      if (Object.keys(diff).length) {
        patches.push({
          id,
          x: B.x,
          y: B.y,
          tiles: Object.entries(diff.tiles ?? []).map(([chunk, tiles]) => ({
            chunk,
            added: Object.values(tiles).filter(({ d }) => d === "+").length,
            deleted: Object.values(tiles).filter(({ d }) => d === "-").length,
            changed: Object.values(tiles).filter(({ d }) => d === "~").length,
            editions: tiles,
          })),
          areas: {
            added: Object.entries(diff.areas ?? []).filter(([_, { d }]) => d === "+").flatMap(([k]) => B.areas.filter(({ id }: { id: string }) => `${k}` === `${id}`)),
            deleted: Object.entries(diff.areas ?? []).filter(([_, { d }]) => d === "-").flatMap(([k]) => B.areas.filter(({ id }: { id: string }) => `${k}` === `${id}`)),
            changed: Object.entries(diff.areas ?? []).filter(([_, { d }]) => d === "~").flatMap(([k]) => B.areas.filter(({ id }: { id: string }) => `${k}` === `${id}`)),
          },
        });
        Object.assign(B, { diff });
      }
      await save(`maps/${id}.json`, B);
    }
    await save(`maps/patches.json`, patches);
    log.debug(`processed: ${ids.size} files`);
  }

  log.success();
}
