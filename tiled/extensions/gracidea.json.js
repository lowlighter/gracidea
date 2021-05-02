tiled.registerMapFormat("gracidea", {
  name:"Gracidea Map",
  extension:"gracidea.json",
  write(map, fileName) {
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
      }
    //Export
      const file = new TextFile(fileName, TextFile.WriteOnly)
      file.write(JSON.stringify(exported))
      file.commit()
      tiled.log("Done!")
  },
})