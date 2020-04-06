function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}(async function(){var d,e,f,g,a=Math.ceil,b=Math.max,c=Math.min;//Animated textures
const h={animated:{2561:{frames:[32512,32513,32514,32515,32516,32517,32518,32519].map(a=>`${a}`),speed:.075}}};//Pixi Settings
PIXI.SCALE_MODES.DEFAULT=PIXI.SCALE_MODES.NEAREST;//Get params
const i=new URLSearchParams(window.location.search),j={//Basename
basename({path:a,extension:b}){return a.substring(1+a.lastIndexOf("/")).replace(/(\..+?)$/,b?"$1":"")},//Map get or set
mget({map:a,key:b,create:c}){return!a.has(b)&&a.set(b,c(b)),a.get(b)},//Render coordinates
rc(a){return a*l.Chunk.tile.size},//Compute distance between two points
dist(c,a){return Math.sqrt((a.x-c.x)**2+(a.y-c.y)**2)}};//Utilitaries
//Application
class k{//App is ready
//Data
//Methods
//Renderer
//Viewport
//Controller
//View
//Loaders
//Constructor
constructor({world:a}){//Load world
//Configure viewport
//Deffered constructor
_defineProperty(this,"ready",new Promise(()=>null)),_defineProperty(this,"data",{user:{position:{x:0,y:0}},maps:[],show:{map:!1},lang:{},ready:!1}),_defineProperty(this,"methods",{//Move camera
camera:({x:a,y:b,offset:c})=>this.world.camera({x:a,y:b,offset:c}),//Update user position
update:()=>this.data.user.position={x:~~(this.view.center.x/l.Chunk.tile.size),y:~~(this.view.center.y/l.Chunk.tile.size)},//Render world
render:()=>this.world.render(),//Redirect
redirect:a=>window.location.replace(a)}),_defineProperty(this,"renderer",new PIXI.Application({width:document.body.clientWidth,height:document.body.clientHeight,transparent:!0,resizeTo:window,antialias:!0})),_defineProperty(this,"viewport",new Viewport.Viewport({screenWidth:window.innerWidth,screenHeight:window.innerHeight,interaction:this.renderer.renderer.plugins.interaction})),_defineProperty(this,"controller",new Vue({//Selector
el:"#app",//Data and methods
data:this.data,methods:this.methods,//Mounted callback
mounted:()=>document.querySelector("#app .view").appendChild(this.renderer.view)})),_defineProperty(this,"view",this.renderer.stage.addChild(this.viewport)),_defineProperty(this,"tween",{//Quad in out
quadInOut:a=>a*a,//Fade
fade:({target:a,change:b,from:d,to:e,duration:f})=>{//Prepare tween
let g=0,h=a.cacheAsBitmap;a.cacheAsBitmap=!1;//Tween
const i=j=>{1<=(g+=j)/f?(a[b]=e,a.cacheAsBitmap=h,this.renderer.ticker.remove(i))://Pending
a[b]=c(e,d+(e-d)*this.tween.quadInOut(g/f))};this.renderer.ticker.add(i)}}),this.world=new l({app:this,name:a}),this.view.on("moved",()=>this.methods.update()),this.view.on("moved-end",()=>this.methods.render()),this.view.on("zoomed-end",()=>this.methods.render()),this.view.drag().pinch().wheel().decelerate().clamp({direction:"all"}).clampZoom({minScale:.5,maxScale:1}),this.view.scale.set(1),this.ready=new Promise(async a=>{await this.world.load.world(),k.loader.renderer.load(async()=>{await this.world.load.sea(),await this.world.render({delay:0}),this.methods.camera(i.has("x")&&i.has("y")?{x:+i.get("x")||0,y:+i.get("y")||0,offset:{x:0,y:0}}:{x:-14,y:65}),this.methods.update(),this.data.ready=!0,this.data.lang=(await axios.get(`/lang/${i.get("lang")||"en"}.json`)).data,a()})})}//Tweening
}//World map
_defineProperty(k,"loader",{renderer:PIXI.Loader.shared});class l{//Origin point
//Boundary point
//Chunks
//Constructor
constructor({app:a,name:b}){_defineProperty(this,"origin",{x:1/0,y:1/0}),_defineProperty(this,"boundary",{x:-Infinity,y:-Infinity}),_defineProperty(this,"chunks",new Map),_defineProperty(this,"load",{//Load world
world:async()=>{var a=Math.abs;//Load data
const{layers:b,tilesets:c}=(await axios.get(`/maps/${this.name}/map.json`)).data;//Load tilesets
for(let a of c)k.loader.renderer.add(`/maps/${this.name}/${j.basename({path:a.source,extension:!1})}.textures.json`);//Load layers
for(let a of b)for(let b of a.chunks)await j.mget({map:this.chunks,key:l.Chunk.key(b),create:a=>new l.Chunk({world:this,key:a})}).load({layer:a,chunk:b});//Update world boundaries
//Update sprite position
//Update maps locations
this.app.viewport.left=this.origin.x*l.Chunk.tile.size,this.app.viewport.top=this.origin.y*l.Chunk.tile.size,this.app.viewport.worldWidth=a(this.boundary.x-this.origin.x)*l.Chunk.tile.size,this.app.viewport.worldHeight=a(this.boundary.y-this.origin.y)*l.Chunk.tile.size,this.sprite.position.set(-this.origin.x*l.Chunk.tile.size,-this.origin.y*l.Chunk.tile.size),this.app.data.maps=(await axios.get(`/maps/${this.name}/locations.json`)).data},//Load sea
sea:async()=>{//Create sea
this.sea=new l.Sea({world:this}),this.sprite.addChildAt(this.sea.sprite,0)}}),this.name=b,this.sprite=new PIXI.Container,this.sprite.name=this.name,this.app=a,this.app.viewport.addChild(this.sprite)}//Loader
//Render chunks
async render({center:c=this.app.data.user.position,delay:d=100,radius:e="auto",offset:f=this.origin,force:g=!1}={}){//Delay rendering
clearTimeout(this._render),this._render=setTimeout(async()=>{"auto"===e&&(e=a(1.5*b(this.app.renderer.view.height/l.Chunk.tile.size,this.app.renderer.view.width/l.Chunk.tile.size))),f&&(c={x:c.x+f.x,y:c.y+f.y});//Render
const d=new Set,h=[];for(let a of this.chunks.values())h.push(a.render({center:c,radius:e,force:g,animated:d}));//Play animated tiles after rendering
//Update parameters
await Promise.all(h),d.forEach(a=>(a.play(),a.parent.cacheAsBitmap=!1)),i.set("x",this.app.data.user.position.x),i.set("y",this.app.data.user.position.y),window.history.pushState("","",`/?${i.toString()}`)},d),this.sea.refresh(this.app.data.user.position)}//Set camera position
camera({x:a,y:b,offset:c=this.origin}){this.app.viewport.moveCenter({x:(a-c.x)*l.Chunk.tile.size,y:(b-c.y)*l.Chunk.tile.size}),this.app.methods.update(),this.render()}//Layers options
}//World chunk
_defineProperty(l,"layers",{ignored:new Set(["00-boundaries"])}),l.Chunk=(e=d=class{//Layers data
//Constructor
constructor({world:a,key:b}){_defineProperty(this,"layers",new Map),this.key=b,this.world=a,this.sprite=new PIXI.Container,this.sprite.name=this.key,this.world.sprite.addChild(this.sprite)}//Loader
async load({layer:{name:a},chunk:{x:d,y:e,width:f,height:g,data:h}}){this.layers.set(a,{x:d,y:e,width:f,height:g,data:h});//Update origin and boundary
const{origin:i,boundary:j}=this.world;i.x=c(d,i.x),i.y=c(e,i.y),j.x=b(d,j.x),j.y=b(e,j.y)}//Render
async render({center:a,radius:b,force:c,animated:d,cache:e}){//Render layers
for(let[f,{x:g,y:i,width:k,height:m,data:n}]of this.layers.entries()){//Skip if ignored
if(l.layers.ignored.has(f))continue;//Retrieve chunk
const m=this.sprite.getChildByName(f)||this.sprite.addChild(new PIXI.Container);//Skip rendering if too far
if(m.name=f,m.position.set(j.rc(g),j.rc(i)),j.dist(a,{x:g,y:i})>b){m.removeChildren();continue}//Skip rendering if already rendered
if(!m.children.length||c){m.cacheAsBitmap=!1,m.alpha=0,m.removeChildren();for(let[a,b]of n.entries()){let c=null;b--,b in h.animated?(c=m.addChild(new PIXI.AnimatedSprite(h.animated[b].frames.map(PIXI.Texture.from))),c.animationSpeed=h.animated[b].speed,d&&d.add(c)):c=m.addChild(new PIXI.Sprite.from(`${b}`)),c.position.set(j.rc(a%k),j.rc(~~(a/k))),c.width=c.height=l.Chunk.tile.size}//Cache if needed
e&&(m.cacheAsBitmap=!0),this.world.app.tween.fade({target:m,change:"alpha",from:0,to:1,duration:15})}//Render tiles
}}//Key
static key({x:a,y:b}){return`${a};${b}`}//Tile variables
},_defineProperty(d,"tile",{size:16}),e),l.Sea=(g=f=class{//Constructor
constructor({world:a}){this.world=a,this.sprite=new PIXI.Sprite,this.render({delay:0})}//Render
async render({delay:b=250}={}){//Delay rendering
clearTimeout(this._render),this._render=setTimeout(async()=>{this.sprite.removeChildren(),this.sprite.anchor.set(.5);//Compute size
const b=a(this.world.app.renderer.view.width/l.Chunk.tile.size),c=a(this.world.app.renderer.view.height/l.Chunk.tile.size),d=h.animated[`${l.Sea.texture}`];for(let a=-b;a<=b;a++)for(let b=-c;b<=c;b++){const c=this.sprite.addChild(new PIXI.AnimatedSprite(d.frames.map(PIXI.Texture.from)));c.animationSpeed=d.speed,c.position.set(a*l.Chunk.tile.size,b*l.Chunk.tile.size),c.width=c.height=l.Chunk.tile.size,c.play()}},b)}//Refresh sea
refresh({x:a,y:b}){const{origin:c}=this.world;this.sprite.alpha=0,this.sprite.position.set((c.x+a)*l.Chunk.tile.size,(c.y+b)*l.Chunk.tile.size),this.world.app.tween.fade({target:this.sprite,change:"alpha",from:0,to:1,duration:15})}//Texture
},_defineProperty(f,"texture",2561),g);//Instantiate app
const m=new k({world:"overworld"});await m.ready})();