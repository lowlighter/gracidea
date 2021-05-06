import { parse } from "https://deno.land/x/xml@v1.0.0/mod.ts"

type MapData = {
  map:{
    editorsettings:{
      chunksize:{
        "@width":number
        "@height":number
      }
    }
    layer:Array<{
      "@name":string,
      data:{
        chunk:Array<{
          "@x":number
          "@y":number
          $:string
        }>
      }
    }>
    objectgroup:[]
  }
}

type ExportedMapData = {
  chunks:{
    [key:string]:{
      layers:{
        [key:string]:number[]
      }
    }
  }
}


const exported = {
  pins:{
    regions:{}
  },
  areas:[],
  chunks:{

  },
} as ExportedMapData


const {map:{editorsettings:settings, layer:layers, objectgroup}} = parse(await Deno.readTextFile("maps/overworld/map.tmx")) as MapData
const TILE_SIZE = 16
const CHUNK_SIZE = settings.chunksize["@width"]

//Extract layers
for (const layer of layers) {
  const {"@name":name, data:{chunk:chunks}} = layer
  console.debug(`processing: ${name}`)
  //Extract chunks
  for (const chunk of chunks) {
    const {"@x":x, "@y":y, $} = chunk
    const X = Math.floor(x/CHUNK_SIZE), Y = Math.floor(y/CHUNK_SIZE), ID = `${X};${Y}`
    console.debug(`processing: chunk ${ID}`)
    //Extract data
    const data = $.match(/-?\d+/g)?.map(Number)
    if (!data)
      throw new Error(`Invalid chunk data for ${ID}`)
    exported.chunks[ID] ??= {layers:{}}
    exported.chunks[ID].layers[name] = data.some(tile => tile >= 0) ? data : []
  }
}

console.log(Deno.inspect(exported, {depth:1/0}))


/*
 //Setup
 const TILE_SIZE = 16
 const CHUNK_SIZE = 32
 const exported = {
   pins:{
     regions:{}
   },
   areas:[],
   chunks:{},
 }
//Iterate through layers
 for (let i = 0; i < map.layerCount; i++) {
   const layer = map.layerAt(i)
   tiled.log(`Processing layer ${layer.name}`)
   //Handle tile layers
     if (layer.isTileLayer) {
       //Iterate through chunks
         const bounds = layer.region().boundingRect
         for (let X = Math.floor(bounds.left/CHUNK_SIZE); X <= Math.floor(bounds.right/CHUNK_SIZE); X++) {
           for (let Y = Math.floor(bounds.top/CHUNK_SIZE); Y <= Math.floor(bounds.bottom/CHUNK_SIZE); Y++) {
             //Prepare chunk
               tiled.log(`Processing chunk ${X};${Y}`)
               if (!exported.chunks[`${X};${Y}`])
                 exported.chunks[`${X};${Y}`] = {layers:{}}
               const chunk = exported.chunks[`${X};${Y}`].layers[layer.name] = []
             //Iterate through cells
               for (let x = 0; x < CHUNK_SIZE; x++)
                 for (let y = 0; y < CHUNK_SIZE; y++)
                   chunk.push(layer.cellAt(X*CHUNK_SIZE+x, Y*CHUNK_SIZE+y).tileId)
               if (chunk.every(n => n < 0))
                 chunk.splice(0, chunk.length)
           }
         }
     }
   //Handle object layers
     if (layer.isObjectLayer) {
       //Iterate through objects
         for (let i = 0; i < layer.objectCount; i++) {
           //Points
             const object = layer.objectAt(i)
             const points = []
             const bounds = {x:Infinity, y:Infinity, mx:-Infinity, my:-Infinity}
             ;(object.polygon.length ? object.polygon : [{x:0, y:0}, {x:object.width, y:0}, {x:object.width, y:object.height}, {x:0, y:object.height}])
               .forEach(point => {
                 const x = Math.floor((object.x+point.x)/TILE_SIZE)
                 const y = Math.floor((object.y+point.y)/TILE_SIZE)
                 bounds.x = Math.min(bounds.x, x)
                 bounds.y = Math.min(bounds.y, y)
                 bounds.mx = Math.max(bounds.mx, x)
                 bounds.my = Math.max(bounds.my, y)
                 points.push(x, y)
               })
           //Export
             switch (layer.name) {
               case "regions":{
                 const properties = object.properties()
                 exported.pins.regions[object.name] = {
                   id:object.id,
                   mx:properties.mx,
                   my:properties.my,
                   pins:[]
                 }
                 continue
               }
               case "pins":{
                 const properties = object.properties()
                 exported.pins.regions[properties.region].pins.push({
                   id:object.id,
                   name:object.name,
                   x:points[0],
                   y:points[1],
                   mx:properties.mx,
                   my:properties.my
                 })
                 continue
               }
               default:{
                 exported.areas.push({
                   id:object.id,
                   name:object.name,
                   points:points,
                   type:layer.name,
                   bounds:{
                     x:bounds.x,
                     y:bounds.y,
                     width:bounds.mx-bounds.x,
                     height:bounds.my-bounds.y,
                   },
                   properties:object.properties()
                 })
                 continue
               }
             }
         }
     }
     */