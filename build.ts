const {files} = await Deno.emit("source/client/app.ts", {bundle:"iife"})
const script = Object.entries(files).filter(([key]) => /\.js$/.test(key)).map(([_, value]) => value).shift() as string
await Deno.writeTextFile("deploy/app.js", script)