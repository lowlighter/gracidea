//Imports
import { dirname, join } from "https://deno.land/std@0.119.0/path/mod.ts";

/** Maps data */
const effectsData = await fetch(join(dirname(import.meta.url), "data.json")).then((response) => response.json());

/** Texture effects */
export async function effects() {
  return effectsData
}