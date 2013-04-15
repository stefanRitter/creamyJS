/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 *
 *  shared under the Creative Commons CC BY-NC-SA license:
 *  http://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 */

function xhrGet(c,a,d){var b=new XMLHttpRequest;b.open("GET",c,!0);d&&(b.responseType=d);b.onload=a;b.send()}Array.prototype.erase=function(c){for(var a=this.length;a--;a)this[a]===c&&this.splice(a,1);return this};Function.prototype.bind=function(c){var a=this;return function(){var d=Array.prototype.slice.call(arguments);return a.apply(c||null,d)}};
merge=function(c,a){for(var d in a){var b=a[d];if("object"!=typeof b||b instanceof Class)c[d]=b;else{if(!c[d]||"object"!=typeof c[d])c[d]={};merge(c[d],b)}}return c};function copy(c){if(!c||"object"!=typeof c||c instanceof Class)return c;if(c instanceof Array)for(var a=[],d=0,b=c.length;d<b;d++)a[d]=copy(c[d]);else for(d in a={},c)a[d]=copy(c[d]);return a}
function ksort(c){if(!c||"object"!=typeof c)return[];var a=[],d=[],b;for(b in c)a.push(b);a.sort();for(b=0;b<a.length;b++)d.push(c[a[b]]);return d}
(function(){var c=!1,a=/xyz/.test(function(){xyz})?/\bparent\b/:/.*/;this.Class=function(){};var d=function(b){var d=this.prototype,c={},f;for(f in b)"function"==typeof b[f]&&"function"==typeof d[f]&&a.test(b[f])?(c[f]=d[f],d[f]=function(a,b){return function(){var d=this.parent;this.parent=c[a];var g=b.apply(this,arguments);this.parent=d;return g}}(f,b[f])):d[f]=b[f]};this.Class.extend=function(b){function g(){if(!c){if(this.staticInstantiate){var a=this.staticInstantiate.apply(this,arguments);if(a)return a}for(var b in this)"object"==
typeof this[b]&&(this[b]=copy(this[b]));this.init&&this.init.apply(this,arguments)}return this}var e=this.prototype;c=!0;var f=new this;c=!1;for(var h in b)"function"==typeof b[h]&&"function"==typeof e[h]&&a.test(b[h])?f[h]=function(a,b){return function(){var d=this.parent;this.parent=e[a];var c=b.apply(this,arguments);this.parent=d;return c}}(h,b[h]):f[h]=b[h];g.prototype=f;g.constructor=g;g.extend=arguments.callee;g.inject=d;return g}})();
newGuid_short=function(){return(65536*(1+Math.random())|0).toString(16).substring(1).toString()};(function(){window.Vec2=Box2D.Common.Math.b2Vec2;window.BodyDef=Box2D.Dynamics.b2BodyDef;window.Body=Box2D.Dynamics.b2Body;window.FixtureDef=Box2D.Dynamics.b2FixtureDef;window.Fixture=Box2D.Dynamics.b2Fixture;window.World=Box2D.Dynamics.b2World;window.MassData=Box2D.Collision.Shapes.b2MassData;window.PolygonShape=Box2D.Collision.Shapes.b2PolygonShape;window.CircleShape=Box2D.Collision.Shapes.b2CircleShape;window.DebugDraw=Box2D.Dynamics.b2DebugDraw;window.RevoluteJointDef=Box2D.Dynamics.Joints.b2RevoluteJointDef;
var c=Class.extend({gravity:new Vec2(0,9.8),stateTime:0,world:null,scale:32,setup:function(){gPhysicsEngine.world=new World(gPhysicsEngine.gravity,!0);gPhysicsEngine.addContactListener({PostSolve:function(a,d,b,c){var e=a?a.GetUserData():null,f=d?d.GetUserData():null;if(e&&e.ent&&e.ent.onTouch)e.ent.onTouch(d,b,c);if(f&&f.ent&&f.ent.onTouch)f.ent.onTouch(a,b,c)},EndContact:function(a,d){var b=a?a.GetUserData():null,c=d?d.GetUserData():null;if(b&&b.ent&&b.ent.onEndContact)b.ent.onEndContact();if(c&&
c.ent&&c.ent.onEndContact)c.ent.onEndContact()}})},update:function(a){this.stateTime+=a;this.stateTime>=1E3/60&&(this.stateTime=0,gPhysicsEngine.world.Step(1/60,8,3),gPhysicsEngine.world.ClearForces())},addContactListener:function(a){var d=new Box2D.Dynamics.b2ContactListener;a.PostSolve&&(d.PostSolve=function(b,d){a.PostSolve(b.GetFixtureA().GetBody(),b.GetFixtureB().GetBody(),d,b)});a.BeginContact&&(d.BeginContact=function(b){a.BeginContact(b.GetFixtureA().GetBody(),b.GetFixtureB().GetBody())});
a.EndContact&&(d.EndContact=function(b){a.EndContact(b.GetFixtureA().GetBody(),b.GetFixtureB().GetBody())});gPhysicsEngine.world.SetContactListener(d)},addBody:function(a){var d=new BodyDef,b=new FixtureDef,c=null;d.type="static"===a.type?Body.b2_staticBody:Body.b2_dynamicBody;d.position.x=a.x/gPhysicsEngine.scale;d.position.y=a.y/gPhysicsEngine.scale;d.userData=a.userData||null;b.density=a.density||b.density;b.friction=a.friction||b.friction;b.restitution=a.restitution||b.restitution;a.shape?b.shape=
a.shape:a.radius?b.shape=new CircleShape(a.radius/gPhysicsEngine.scale):(b.shape=new PolygonShape,b.shape.SetAsBox(a.halfWidth/gPhysicsEngine.scale,a.halfHeight/gPhysicsEngine.scale));c=gPhysicsEngine.world.CreateBody(d);c.CreateFixture(b);return c},removeBody:function(a){gPhysicsEngine.world.DestroyBody(a)},testEngine:function(){var a=new DebugDraw;a.SetSprite(gContext);a.SetDrawScale(gPhysicsEngine.scale);a.SetFillAlpha(0.3);a.SetLineThickness(1);a.SetFlags(DebugDraw.e_shapeBit|DebugDraw.e_jointBit);
gPhysicsEngine.world.SetDebugDraw(a)}});window.gPhysicsEngine=new c}).call(this);var gCachedAssets={};function loadImage(c,a){if(gCachedAssets[c])a(gCachedAssets[c]);else{var d=new Image;d.onload=function(){gCachedAssets[c]=d;a(d)};d.src=c}}
function loadAssets(c,a){for(var d={count:0,total:c.length,cb:a},b=0;b<c.length;b++)if(gCachedAssets[c[b]])onLoadedCallback(gCachedAssets[c[b]],d);else{var g=getAssetTypeFromExtension(c[b]);if(0===g){var e=new Image;e.onload=function(){onLoadedCallback(e,d)};e.src=c[b];gCachedAssets[c[b]]=e}else if(1===g){var f=document.createElement("script");f.setAttribute("type","text/javascript");f.onload=function(a){onLoadedCallback(f,d)};f.setAttribute("src",c[b]);document.getElementsByTagName("head")[0].appendChild(f);
gCachedAssets[c[b]]=f}else if(2===g){var h=c[b];xhrGet(c[b],function(){gCachedAssets[h]=this.responseText;onLoadedCallback(h,d)})}}}function onLoadedCallback(c,a){a.count++;a.count==a.total&&a.cb(c)}function getAssetTypeFromExtension(c){return-1!=c.indexOf(".jpg")||-1!=c.indexOf(".jpeg")||-1!=c.indexOf(".png")||-1!=c.indexOf(".gif")||-1!=c.indexOf(".wp")?0:-1!=c.indexOf(".json")?2:-1!=c.indexOf(".js")?1:-1};(function(){window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;window.cancelAnimationFrame=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame})();
(function(){var c=Class.extend({request:null,startTime:0,gameState:3,STATE:{PLAY:1,GAMEOVER:2,WIN:3},numLevels:8,currentLevel:-1,entities:[],factory:{},_deferredKill:[],loadingHTML:"",fullyLoaded:!1,loadInterval:0,setup:function(){var a=getCookie("lastlevel");gGameEngine.currentLevel=null!==a?parseInt(a,10):-1;loadAssets(["images/background.png","images/gamesprite.png","images/gamesprite.json"],function(){gInputEngine.setup();gBackground.setup("images/background.png");gGameEngine.setupSounds();gGameEngine.setupSprites();
gGameEngine.loadNextLevel()})},gameLoop:function(){if(gGameEngine.gameState===gGameEngine.STATE.PLAY){gGameEngine.request=requestAnimationFrame(gGameEngine.gameLoop);var a=Date.now()-gGameEngine.startTime;gGameEngine.startTime=Date.now();gGameEngine.update(a);gGameEngine.draw()}else gGameEngine.gameState===gGameEngine.STATE.GAMEOVER?(cancelAnimationFrame(gGameEngine.request),gContext.fadeToColor("rgba(200,100,100, 0.1)",1500,function(){gGameEngine.gameState=gGameEngine.STATE.PLAY;gContext.fadeGlobalAlpha(400);
for(var a=0;a<gGameEngine.entities.length;a++)gGameEngine.entities[a].reset&&gGameEngine.entities[a].reset();gGameEngine.request=requestAnimationFrame(gGameEngine.gameLoop)})):gGameEngine.gameState===gGameEngine.STATE.WIN&&(cancelAnimationFrame(gGameEngine.request),gContext.fadeToColor("rgba(255,255,255, 0.3)",600),setCookie("lastlevel",gGameEngine.currentLevel,10),gGameEngine.loadNextLevel())},update:function(a){gPlayer.update(a);for(var d=null,b=0;b<gGameEngine.entities.length;b++)d=gGameEngine.entities[b],
d._killed?gGameEngine._deferredKill.push(d):d.update(a);for(d=0;d<gGameEngine._deferredKill.length;d++)gGameEngine._deferredKill[d].kill&&gGameEngine._deferredKill[d].kill(),gGameEngine.entities.erase(gGameEngine._deferredKill[d]);gGameEngine._deferredKill=[];gPhysicsEngine.update(a)},draw:function(){gBackground.draw();gMap.draw(gContext);var a=[],d={};gGameEngine.entities.forEach(function(b){b.isVisible&&(-1===a.indexOf(b.zindex)&&(a.push(b.zindex),d[b.zindex]=[]),d[b.zindex].push(b))});a.sort(function(a,
d){return a-d});a.forEach(function(a){d[a].forEach(function(a){a.draw()})});gPlayer.draw();gGameEngine.drawFrame()},loadNextLevel:function(){if(gGameEngine.gameState===gGameEngine.STATE.WIN){gGameEngine.gameState=0;gGameEngine.currentLevel+=1;if(gGameEngine.fullyLoaded&&0!==gGameEngine.currentLevel){var a=document.getElementById("levelup");a.onload=function(){fadein(this,400);a.style.display="block";if(gGameEngine.currentLevel<gGameEngine.numLevels)setTimeout(function(){fadeout(a,400,function(){a.style.display=
"none"});gGameEngine.startGame()},3E3);else{var b=document.getElementById("winnerbackground");b.style.opacity=0;b.innerHTML='<img src="images/gold.png" class="won"></img>';fadein(b)}};if(gGameEngine.currentLevel>=gGameEngine.numLevels){fadeout(gCanvas,500,function(){gCanvas.style.display="none"});a.src="images/winner.png";document.addEventListener("click",function(){window.location="mailto:stefan@stefanritter.com"});fadein(document.getElementsByClassName("mainfooter")[0]);setCookie("lastlevel",-1,
10);return}a.src="images/levelup.gif?"+(new Date).valueOf()}else setTimeout(function(){loadAssets(["images/map_tileset.png","images/winner.png"],function(){})},8E3);gLoading.innerHTML=gGameEngine.loadingHTML;gPhysicsEngine.setup();gGameEngine.entities=[];gGameEngine._deferredKill=[];var d="images/level"+gGameEngine.currentLevel+".json";gMap=new TILEDMapClass;gMap.load(d,function(){gMap.preDrawCache();gMap.createEntities();gMap.centerAt(gPlayer.pos.x,gPlayer.pos.y,600,1E3);gGameEngine.fullyLoaded=
!0},1E3,600)}},startGame:function(){gLoading.style.visibility="hidden";document.removeEventListener("keyup",gGameEngine.startGame,!1);gGameEngine.startTime=Date.now();gGameEngine.gameState=gGameEngine.STATE.PLAY;gContext.fadeGlobalAlpha(400);gGameEngine.request=requestAnimationFrame(gGameEngine.gameLoop)},spawnEntity:function(a){a=new gGameEngine.factory[a];gGameEngine.entities.push(a);return a},drawFrame:function(){drawSprite("blendL.png",-1,-1,30,601);drawSprite("blendR.png",971,-1,30,601)},playWorldSound:function(a,
d,b){var c=gGameEngine.gMap,c=0.5*Math.max(c.viewRect.w,c.viewRect.h),e=gGameEngine.gPlayer.pos;d=Math.abs(e.x-d);b=Math.abs(e.y-b);b=Math.sqrt(d*d+b*b)/c;1<b&&(b=1);if(!(0>b)){var f=1-b;gSM.loadAsync(a,function(a){gSM.playSound(a.path,{volume:f,looping:!1})})}},setupSounds:function(){},setupSprites:function(){var a=new SpriteSheetClass;a.setAsset("images/gamesprite.png",gCachedAssets["images/gamesprite.png"]);a.parseAtlasDefinition(gCachedAssets["images/gamesprite.json"])},createPlatform:function(a,
d,b,c){gGameEngine.spawnEntity("PlatformEntity").create(a,d,b,c,"platform.png",null)},createGoal:function(a,d){gGameEngine.spawnEntity("GoalEntity").create(a,d,380,380,"goal01.png goal02.png goal03.png goal04.png goal05.png goal06.png goal07.png goal08.png goal09.png goal10.png".split(" "),700)},createDynamicEnemy:function(a,d){gGameEngine.spawnEntity("EnemyEntity").create(a,d,139,120,"enemydynamic01.png enemydynamic02.png enemydynamic03.png enemydynamic04.png enemydynamic05.png enemydynamic06.png enemydynamic07.png".split(" "),
500,"dynamic")},createStaticEnemy:function(a,d){gGameEngine.spawnEntity("EnemyEntity").create(a,d,300,104,"enemystatic01.png enemystatic02.png enemystatic03.png enemystatic04.png enemystatic05.png enemystatic06.png enemystatic06.png".split(" "),800,"static")},createStaticRoundEnemy:function(a,d){gGameEngine.spawnEntity("EnemyEntity").create(a,d,139,120,"enemydynamic01.png enemydynamic02.png enemydynamic03.png enemydynamic04.png enemydynamic05.png enemydynamic06.png enemydynamic07.png".split(" "),
500,"staticRound")}});window.gGameEngine=new c}).call(this);var fudgeVariance=128,EntityClass=Class.extend({pos:{x:0,y:0},canvaspos:{x:0,y:0},size:{x:0,y:0},halfsize:{x:0,y:0},_killed:!1,zindex:0,sprite:"",create:function(c,a,d,b,g){this.pos.x=c;this.pos.y=a;this.size.x=d;this.size.y=b;this.halfsize.x=d/2;this.halfsize.y=b/2;this.sprite=g;this.convertPosToScreen()},position:function(c,a){this.pos.x=c;this.pos.y=a},setSprite:function(c){this.sprite=c},update:function(){},convertPosToScreen:function(){this.canvaspos.x=this.pos.x-gMap.viewRect.x;this.canvaspos.y=
this.pos.y-gMap.viewRect.y},draw:function(){this.convertPosToScreen();drawSprite(this.sprite,this.canvaspos.x-this.halfsize.x,this.canvaspos.y-this.halfsize.y,this.size.x,this.size.y)},isVisible:function(){return entity.pos.x>=gMap.viewRect.x-fudgeVariance&&entity.pos.x<gMap.viewRect.x+gMap.viewRect.w+fudgeVariance&&entity.pos.y>=gMap.viewRect.y-fudgeVariance&&entity.pos.y<gMap.viewRect.y+gMap.viewRect.h+fudgeVariance?!0:!(gMap.viewRect.x>this.pos.x+this.halfsize.x||gMap.viewRect.x+gMap.viewRect.w<
this.pos.x-this.halfsize.x||gMap.viewRect.y>this.pos.y+this.halfsize.y||gMap.viewRect.y+gMap.viewRect.h<this.pos.y+this.halfsize.y)}});gGameEngine.factory.EntityClass=EntityClass;(function(){var c=Class.extend({clips:{},enabled:!0,_context:null,_mainNode:null,setup:function(){try{gSM._context=new webkitAudioContext}catch(a){console.log("Web Audio API is not supported in this browser");gSM._context=null;gSM.enabled=!1;return}gSM._mainNode=gSM._context.createGainNode(0);gSM._mainNode.connect(gSM._context.destination)},loadAsync:function(d,b){if(gSM.clips[d])return b(gSM.clips[d].s),gSM.clips[d].s;var c={s:new a,b:null,l:!1};gSM.clips[d]=c;c.s.path=d;var e=new XMLHttpRequest;
e.open("GET",d,!0);e.responseType="arraybuffer";e.onload=function(){gSM._context.decodeAudioData(e.response,function(a){gSM.clips[d].b=a;gSM.clips[d].l=!0;b(gSM.clips[d].s)},function(a){})};e.send();return c.s},togglemute:function(){if(!gSM.enabled)return!1;gSM._mainNode.gain.value=0<gSM._mainNode.gain.value?0:1},stopAll:function(){gSM._mainNode.disconnect();gSM._mainNode=gSM._context.createGainNode(0);gSM._mainNode.connect(gSM._context.destination)},playSound:function(a,b,c){if(!gSM.enabled)return!1;
var e=!1,f=0.2;b&&(b.looping&&(e=b.looping),b.volume&&(f=b.volume));a=this.clips[a];if(!a||!a.l)return!1;b=null;b=gSM._context.createBufferSource();b.buffer=a.b;b.gain.value=f;b.loop=e;b.connect(gSM._mainNode);b.noteOn(0);c&&c();return!0}}),a=Class.extend({play:function(a){gSM.playSound(this.path,{looping:a,volume:1})}});window.gSM=new c}).call(this);(function(){var c=Class.extend({bindings:{},actions:{},mouse:{x:0,y:0},setup:function(){gInputEngine.bind(32,"jump");gInputEngine.bind(37,"move-left");gInputEngine.bind(39,"move-right");gInputEngine.bind(40,"move-down");gInputEngine.bind(38,"move-up");document.addEventListener("keydown",gInputEngine.onKeyDown);document.addEventListener("keyup",gInputEngine.onKeyUp)},onMouseMove:function(a){gInputEngine.mouse.x=a.clientX;gInputEngine.mouse.y=a.clientY},onKeyDown:function(a){(a=gInputEngine.bindings[a.keyCode])&&
(gInputEngine.actions[a]=!0)},onKeyUp:function(a){(a=gInputEngine.bindings[a.keyCode])&&(gInputEngine.actions[a]=!1)},bind:function(a,d){gInputEngine.bindings[a]=d}});window.gInputEngine=new c}).call(this);var gSpriteSheets={},SpriteSheetClass=Class.extend({img:null,url:"",sprites:[],init:function(){},load:function(c){this.url=c;var a=new Image;a.src=c;this.img=a;gSpriteSheets[c]=this},setAsset:function(c,a){this.url=c;this.img=a;gSpriteSheets[c]=this},defSprite:function(c,a,d,b,g,e,f){this.sprites.push({id:c,x:a,y:d,w:b,h:g,cx:null===e?0:e,cy:null===f?0:f})},parseAtlasDefinition:function(c){c=JSON.parse(c);for(var a in c.frames){var d=c.frames[a],b=0.5*-d.frame.w,g=0.5*-d.frame.h;d.trimmed&&(g=0.5*
d.sourceSize.h,b=-(0.5*d.sourceSize.w-d.spriteSourceSize.x),g=-(g-d.spriteSourceSize.y));this.defSprite(a,d.frame.x,d.frame.y,d.frame.w,d.frame.h,b,g)}},getStats:function(c){for(var a=0;a<this.sprites.length;a++)if(this.sprites[a].id===c)return this.sprites[a];return null}});function drawSprite(c,a,d,b,g){for(var e in gSpriteSheets){var f=gSpriteSheets[e],h=f.getStats(c);if(null!==h){if(null===f)break;gContext.drawImage(f.img,h.x,h.y,h.w,h.h,a,d,b,g);break}}};var AnimatedEntity=EntityClass.extend({assets:[],numFrames:0,currentFrame:0,frameLength:0,stateTime:0,loop:!1,direction:1,create:function(c,a,d,b,g,e,f){this.parent(c,a,d,b,null);this.assets=g;this.numFrames=g.length;this.frameLength=e/this.numFrames;this.loop=f||!1},update:function(c){this.stateTime+=c;if(this.stateTime>this.frameLength&&(this.stateTime=0,this.currentFrame+=this.direction,this.currentFrame>=this.numFrames||0>this.currentFrame))this.currentFrame-=this.direction,this.direction*=-1,
this.loop||(this._killed=!0)},draw:function(){this.setSprite(this.assets[this.currentFrame]);this.parent()}});gGameEngine.factory.AnimatedEntity=AnimatedEntity;(function(){var c=Class.extend({x:0,y:0,w:100,h:100,cvsHdl:null,ctx:null,create:function(a,d){this.y=this.x=-1;this.w=a;this.h=d;var b=document.createElement("canvas");b.width=a;b.height=d;this.cvsHdl=b;this.ctx=b.getContext("2d")},isVisible:function(){var a=gMap.viewRect;return gMap.intersectRect({top:this.y,left:this.x,bottom:this.y+this.h,right:this.x+this.w},{top:a.y,left:a.x,bottom:a.y+a.h,right:a.x+a.w})}});window.TILEDMapClass=Class.extend({platformBuilder:{newPlatform:!0,size:0,start:{x:0,
y:0},vertical:[]},currMapData:null,tilesets:[],viewRect:{x:0,y:0,w:1E3,h:1E3},numXTiles:100,numYTiles:100,tileSize:{x:64,y:64},pixelSize:{x:64,y:64},imgLoadCount:0,fullyLoaded:!1,canvasTileSize:{x:1024,y:1024},canvasTileArray:[],canvas_width:0,canvas_height:0,load:function(a,d,b,c){gMap.canvas_width=b;gMap.canvas_height=c;xhrGet(a,function(){gMap.parseMapJSON(this.response,d)})},parseMapJSON:function(a,d){gMap.currMapData=JSON.parse(a);var b=gMap.currMapData;gMap.numXTiles=b.width;gMap.numYTiles=
b.height;gMap.tileSize.x=b.tilewidth;gMap.tileSize.y=b.tileheight;gMap.pixelSize.x=gMap.numXTiles*gMap.tileSize.x;gMap.pixelSize.y=gMap.numYTiles*gMap.tileSize.y;for(var c=0;c<b.tilesets.length;c++){var e=new Image;e.onload=function(){gMap.imgLoadCount++;gMap.imgLoadCount===b.tilesets.length&&(gMap.fullyLoaded=!0,d())};var f={firstgid:gMap.currMapData.tilesets[c].firstgid,image:e,imageheight:gMap.currMapData.tilesets[c].imageheight,imagewidth:gMap.currMapData.tilesets[c].imagewidth,name:gMap.currMapData.tilesets[c].name,
margin:gMap.currMapData.tilesets[c].margin,numXTiles:Math.floor(gMap.currMapData.tilesets[c].imagewidth/gMap.tileSize.x),numYTiles:Math.floor(gMap.currMapData.tilesets[c].imageheight/gMap.tileSize.y)};e.src="images/"+b.tilesets[c].image.replace(/^.*[\\\/]/,"");gMap.tilesets.push(f)}},getTilePacket:function(a){for(var d={img:null,px:0,py:0},b=0,b=gMap.tilesets.length-1;0<=b&&!(gMap.tilesets[b].firstgid<=a);b--);d.img=gMap.tilesets[b].image;var c=a-gMap.tilesets[b].firstgid;a=Math.floor(c%gMap.tilesets[b].numXTiles);
c=Math.floor(c/gMap.tilesets[b].numXTiles);d.px=a*gMap.tileSize.x;d.py=c*gMap.tileSize.y;gMap.tilesets[b].margin&&(b=gMap.tilesets[b].margin,d.px+=a*b+b,d.py+=c*b+b);return d},draw:function(a){if(gMap.fullyLoaded)for(var d=0;d<gMap.canvasTileArray.length;d++){var b=gMap.canvasTileArray[d];b.isVisible()&&a.drawImage(b.cvsHdl,b.x-gMap.viewRect.x,b.y-gMap.viewRect.y)}},preDrawCache:function(){for(var a=1+Math.floor(gMap.pixelSize.x/gMap.canvasTileSize.x),d=1+Math.floor(gMap.pixelSize.y/gMap.canvasTileSize.y),
b=0;b<d;b++)for(var g=0;g<a;g++){var e=new c;e.create(gMap.canvasTileSize.x,gMap.canvasTileSize.y);e.x=g*gMap.canvasTileSize.x;e.y=b*gMap.canvasTileSize.y;gMap.canvasTileArray.push(e);gMap.fillCanvasTile(e)}gMap.fullyLoaded=!0},fillCanvasTile:function(a){var d=a.ctx;d.clearRect(0,0,a.w,a.h);a={top:a.y,left:a.x,bottom:a.y+a.h,right:a.x+a.w};for(var b=0;b<gMap.currMapData.layers.length;b++)if("tilelayer"==gMap.currMapData.layers[b].type&&"borders"!==gMap.currMapData.layers[b].name)for(var c=gMap.currMapData.layers[b].data,
e=0;e<c.length;e++){var f=c[e];if(0!==f){var f=gMap.getTilePacket(f),h=Math.floor(e%gMap.numXTiles)*gMap.tileSize.x,k=Math.floor(e/gMap.numXTiles)*gMap.tileSize.y;gMap.intersectRect(a,{top:k,left:h,bottom:k+gMap.tileSize.y,right:h+gMap.tileSize.x})&&d.drawImage(f.img,f.px,f.py,this.tileSize.x,this.tileSize.y,h-a.left,k-a.top,this.tileSize.x,this.tileSize.y)}}},createEntities:function(){for(var a=0,d=0,b=0,c=0,e=0,f=[],b=0;b<gMap.currMapData.layers.length;b++)if("borders"===gMap.currMapData.layers[b].name){f=
gMap.currMapData.layers[b].data;for(c=0;c<f.length;c++)e=f[c],a=Math.floor(c%gMap.numXTiles)*gMap.tileSize.x,d=Math.floor(c/gMap.numXTiles)*gMap.tileSize.y,gMap.buildHorizontalPlatform(e,a,d),2===e?gGameEngine.createGoal(a,d):3===e?gGameEngine.createDynamicEnemy(a,d):4===e?gPlayer.setup(a,d,200,200):5===e?gGameEngine.createStaticEnemy(a,d):7===e?gGameEngine.createStaticRoundEnemy(a,d):8===e?(gInputEngine.bind(32,"no-jump"),gPlayer.setup(a,d,200,200,!0)):6===e&&gMap.platformBuilder.vertical.push({x:a,
y:d}),0===(c+1)%gMap.numXTiles&&gMap.buildHorizontalPlatform(-1)}gMap.buildVerticalPlatforms()},buildHorizontalPlatform:function(a,d,b){gMap.platformBuilder.newPlatform?1===a&&(gMap.platformBuilder.newPlatform=!1,gMap.platformBuilder.size=1,gMap.platformBuilder.start.x=d,gMap.platformBuilder.start.y=b):1!==a?(gGameEngine.createPlatform(gMap.platformBuilder.start.x,gMap.platformBuilder.start.y+6,gMap.tileSize.x*gMap.platformBuilder.size,gMap.tileSize.y-12),gMap.platformBuilder.newPlatform=!0):gMap.platformBuilder.size+=
1},buildVerticalPlatforms:function(){var a=[],d={};gMap.platformBuilder.vertical.forEach(function(b){-1===a.indexOf(b.x)&&(a.push(b.x),d[b.x]=[]);d[b.x].push(b)});a.forEach(function(a){d[a].sort(function(a,b){return a.y===b.y?0:a.y<b.y?-1:1});a=d[a];var c=a.length;gMap.platformBuilder.size=1;gMap.platformBuilder.start.x=a[0].x;gMap.platformBuilder.start.y=a[0].y;for(var e=1;e<c;e++)e+1===c?(gMap.platformBuilder.size+=1,gGameEngine.createPlatform(gMap.platformBuilder.start.x+5,gMap.platformBuilder.start.y+
12,gMap.tileSize.x-10,gMap.tileSize.y*gMap.platformBuilder.size)):a[e].y!==a[e-1].y+gMap.tileSize.y?(gGameEngine.createPlatform(gMap.platformBuilder.start.x+5,gMap.platformBuilder.start.y+12,gMap.tileSize.x-10,gMap.tileSize.y*gMap.platformBuilder.size),gMap.platformBuilder.size=1,gMap.platformBuilder.start.x=a[e].x,gMap.platformBuilder.start.y=a[e].y):gMap.platformBuilder.size+=1})},intersectRect:function(a,d){return!(d.left>a.right||d.right<a.left||d.top>a.bottom||d.bottom<a.top)},centerAt:function(a,
d){gMap.viewRect.x=a-gMap.canvas_width/2;0>gMap.viewRect.x?gMap.viewRect.x=0:gMap.viewRect.x+gMap.canvas_width>gMap.pixelSize.x&&(gMap.viewRect.x=gMap.pixelSize.x-gMap.canvas_width);gMap.viewRect.y=d-gMap.canvas_height/2;0>gMap.viewRect.y?gMap.viewRect.y=0:gMap.viewRect.y+gMap.canvas_height>gMap.pixelSize.y&&(gMap.viewRect.y=gMap.pixelSize.y-gMap.canvas_height)}});window.gMap=new TILEDMapClass}).call(this);var EnemyEntity=AnimatedEntity.extend({zindex:2,physBody:null,startPos:{x:0,y:0},newPos:{x:0,y:0},dynamic:!1,startAnim:0,currentTime:0,currVel:null,create:function(c,a,d,b,g,e,f){this.dynamic=!1;this.startPos.x=c;this.startPos.y=a;"dynamic"===f?(this.dynamic=!0,this.parent(c,a,d,b,g,e,!0),this.startAnim=100*Math.random(),this.physBody=gPhysicsEngine.addBody({x:c,y:a,type:"dynamic",density:1,friction:0,restitution:1,radius:50,userData:{id:"enemy",ent:this}})):"static"===f?(this.parent(c,a+2,d,b,g,
e,!0),this.startAnim=300*Math.random(),this.physBody=gPhysicsEngine.addBody({x:c,y:a+2,halfWidth:d/2-34,halfHeight:b/2-38,type:"static",density:1,friction:0.5,restitution:0.7,userData:{id:"enemy",ent:this}})):(this.dynamic=!0,this.parent(c,a,d,b,g,e,!0),this.startAnim=100*Math.random(),this.physBody=gPhysicsEngine.addBody({x:c,y:a,type:"static",density:1,friction:0.5,restitution:0.7,radius:50,userData:{id:"enemy",ent:this}}))},update:function(c){this.dynamic&&(this.newPos=this.physBody.GetPosition(),
this.currVel=this.physBody.GetLinearVelocity(),this.position(this.newPos.x*gPhysicsEngine.scale,this.newPos.y*gPhysicsEngine.scale));this.currentTime+=c;this.currentTime>=this.startAnim&&(this.parent(c),0===this.currentFrame&&(this.currentTime=0))},kill:function(){gPhysicsEngine.removeBody(this.physBody)},reset:function(){this.dynamic&&(this.physBody.SetPosition(new Vec2(this.startPos.x/gPhysicsEngine.scale,this.startPos.y/gPhysicsEngine.scale)),this.physBody.SetLinearVelocity(new Vec2(0,0)))}});
gGameEngine.factory.EnemyEntity=EnemyEntity;(function(){var c=Class.extend({image:"",setup:function(a){this.image=a},draw:function(){gContext.drawImage(gCachedAssets[this.image],0,0,gCanvas.width,gCanvas.height)}});window.gBackground=new c}).call(this);var GoalEntity=AnimatedEntity.extend({zindex:2,physBody:null,create:function(c,a,d,b,g,e){this.parent(c,a,d,b,g,e,!0);this.physBody=gPhysicsEngine.addBody({x:c,y:a,type:"static",radius:50,userData:{id:"goal",ent:this}})}});gGameEngine.factory.GoalEntity=GoalEntity;var PlatformEntity=EntityClass.extend({zindex:1,physBody:null,newPos:{x:0,y:0},create:function(c,a,d,b,g,e){e=d/2;var f=b/2;this.parent(c+e,a+f,d,b,g);this.physBody=gPhysicsEngine.addBody({halfWidth:e,halfHeight:f,x:c+e,y:a+f,type:"static",userData:{id:"platform",ent:this}})},draw:function(){},onTouch:function(c,a){},update:function(c){},kill:function(){gPhysicsEngine.removeBody(this.physBody)}});gGameEngine.factory.PlatformEntity=PlatformEntity;(function(){var c=!1,a=Class.extend({startPos:{x:0,y:0},pos:{x:0,y:0},forcePos:null,newpos:{x:0,y:0},canvaspos:{x:0,y:0},size:{x:0,y:0},halfsize:{x:0,y:0},stateTime:0,physBody:null,readyToJump:!1,jumpStrength:100,jumpVec:{x:0,y:-1},oldJumpVec:{x:0,y:0},speed:8,maxSpeed:16,currVel:null,antiForce:0,onWall:!1,onCeiling:!1,flying:!1,walkRight:["creamywalk01.png","creamywalk02.png"],walkLeft:["creamywalk01L.png","creamywalk02L.png"],walkJumpRight:["creamywalk04.png","creamywalk05.png"],walkJumpLeft:["creamywalk04L.png",
"creamywalk05L.png"],ceilingRight:["creamyhang05.png","creamyhang04.png"],ceilingLeft:["creamyhang05L.png","creamyhang04L.png"],ceilingJumpR:["creamywalk05.png","creamywalk05.png"],ceilingJumpL:["creamywalk05L.png","creamywalk05L.png"],stand:["creamyjump01.png","creamyjump01.png"],standJump:["creamyjump00.png","creamyjump03.png"],wallWalkRight:["creamywall01.png","creamywall03.png"],wallWalkLeft:["creamywall01L.png","creamywall03L.png"],currentFrame:0,updateTime:100,animTime:0,animDir:1,jumper:!1,
dirX:1,dirY:1,currentAnimation:null,setup:function(a,b,c,e,f){this.startPos.x=a;this.startPos.y=b;this.size.x=c;this.size.y=e;this.halfsize.x=c/2;this.halfsize.y=e/2;this.onWall=this.onCeiling=!1;this.jumpVec={x:0,y:-1};this.oldJumpVec={x:0,y:0};this.currentAnimation=this.stand;this.physBody=gPhysicsEngine.addBody({x:a,y:b,type:"dynamic",density:0.6,friction:1,restitution:-200,radius:c/2,userData:{id:"player",ent:this}});this.antiForce=gPhysicsEngine.gravity.y*this.physBody.GetMass()/20;f&&(this.currentAnimation=
this.ceilingRight,this.onCeiling=!0,this.jumpVec.y=1,this.jumpVec.x=0,this.flying=this.readyToJump=!0)},draw:function(){this.convertPosToScreen();drawSprite(this.currentAnimation[this.currentFrame],this.canvaspos.x-this.halfsize.x,this.canvaspos.y-this.halfsize.y,this.size.x,this.size.y)},update:function(a){if(0>this.newpos.y||this.newpos.y>gMap.pixelSize.y||0>this.newpos.x||this.newpos.x>gMap.pixelSize.x)this.forcePos={x:this.startPos.x,y:this.startPos.y};this.forcePos&&(this.physBody.SetPosition(new Vec2(this.forcePos.x/
gPhysicsEngine.scale,this.forcePos.y/gPhysicsEngine.scale)),this.physBody.SetLinearVelocity(new Vec2(0,0)),this.forcePos=null);this.pos=this.physBody.GetPosition();this.currVel=this.physBody.GetLinearVelocity();this.onCeiling&&!1===this.flying?this.physBody.ApplyForce({x:0,y:-(20*this.antiForce)},this.physBody.GetWorldCenter()):this.flying&&this.physBody.ApplyForce({x:0,y:-(15*this.antiForce)},this.physBody.GetWorldCenter());this.stateTime+=a;16<this.stateTime&&(this.stateTime=0,!0===this.readyToJump?
(this.onWall&&this.physBody.ApplyForce({x:0,y:-this.antiForce},this.physBody.GetWorldCenter()),this.setWalkAnimation()):0===this.jumpVec.x?this.onWall=!1:0>=this.jumpVec.x&&(this.onCeiling=!1),this.updatePlayerInput());this.newpos.x=this.pos.x*gPhysicsEngine.scale;this.newpos.y=this.pos.y*gPhysicsEngine.scale;gMap.centerAt(this.newpos.x,this.newpos.y,600,1E3);this.oldJumpVec.x=this.jumpVec.x;this.oldJumpVec.y=this.jumpVec.y;this.updateAnimations(a)},updatePlayerInput:function(){!0===this.readyToJump?
(gInputEngine.actions.jump&&(this.physBody.ApplyImpulse(this.jumpVec,this.pos),this.setJumpAnimation(),this.jumpVec.x=0,this.jumpVec.y=0,this.onCeiling=this.readyToJump=!1),gInputEngine.actions["move-right"]?0===this.jumpVec.x?this.currVel.x<this.maxSpeed&&this.physBody.ApplyImpulse({x:this.speed,y:0},this.pos):0<this.jumpVec.x?this.currVel.y<this.maxSpeed&&this.physBody.ApplyImpulse({x:0,y:this.speed},this.pos):this.currVel.y>-this.maxSpeed&&this.physBody.ApplyImpulse({x:0,y:-this.speed},this.pos):
gInputEngine.actions["move-up"]&&(0===this.jumpVec.x?this.currVel.x<this.maxSpeed&&this.physBody.ApplyImpulse({x:this.speed,y:0},this.pos):this.currVel.y>-this.maxSpeed&&this.physBody.ApplyImpulse({x:0,y:-this.speed},this.pos)),gInputEngine.actions["move-left"]?0===this.jumpVec.x?this.currVel.x>-this.maxSpeed&&this.physBody.ApplyImpulse({x:-this.speed,y:0},this.pos):0<this.jumpVec.x?this.currVel.y>-this.maxSpeed&&this.physBody.ApplyImpulse({x:0,y:-this.speed},this.pos):this.currVel.y<this.maxSpeed&&
this.physBody.ApplyImpulse({x:0,y:this.speed},this.pos):gInputEngine.actions["move-down"]&&(0===this.jumpVec.x?this.currVel.x>-this.maxSpeed&&this.physBody.ApplyImpulse({x:-this.speed,y:0},this.pos):this.currVel.y<this.maxSpeed&&this.physBody.ApplyImpulse({x:0,y:this.speed},this.pos))):gInputEngine.actions["move-right"]?this.currVel.x<this.maxSpeed&&this.physBody.ApplyImpulse({x:1.5,y:0},this.pos):gInputEngine.actions["move-left"]&&this.currVel.x>-this.maxSpeed&&this.physBody.ApplyImpulse({x:-1.5,
y:0},this.pos)},onTouch:function(a,b,c){this.physBody&&a.GetUserData()&&(a=a.GetUserData(),a.ent&&!a.ent._killed&&("platform"===a.id?(this.readyToJump=!0,c=c.GetManifold().m_localPlaneNormal,this.jumpVec={x:c.x*this.jumpStrength,y:c.y*this.jumpStrength},0!==this.jumpVec.x&&!1===this.onWall?(this.onWall=!0,this.physBody.SetLinearVelocity(new Vec2(0,0))):0<this.jumpVec.y&&!1===this.onCeiling&&(this.onCeiling=!0)):"enemy"===a.id?(this.forcePos={x:this.startPos.x,y:this.startPos.y},this.currentAnimation=
this.stand,gSM.playSound("sound/hit.ogg",{volume:2}),gGameEngine.gameState=gGameEngine.STATE.GAMEOVER):"goal"===a.id&&(gGameEngine.gameState=gGameEngine.STATE.WIN,gSM.playSound("sound/coin.ogg",{volume:1.5}))))},onEndContact:function(){!1===this.readyToJump&&!1===c&&(c=!0,gSM.playSound("sound/jump.ogg",{volume:0.3},function(){setTimeout(function(){c=!1},100)}));!0===this.readyToJump&&(this.currentAnimation=this.stand);this.flying||(this.jumpVec.x=0,this.jumpVec.y=0,this.onWall=this.onCeiling=this.readyToJump=
!1)},updateAnimations:function(a){if(0.8<this.currVel.x||-0.8>this.currVel.x||0.8<this.currVel.y||-0.8>this.currVel.y){this.animTime+=a;if(this.animTime>this.updateTime&&(this.animTime=0,this.currentFrame+=this.animDir,this.jumper&&(this.currentFrame=1),this.currentFrame>=this.currentAnimation.length||0>this.currentFrame))this.currentFrame-=this.animDir,this.animDir*=-1;this.oldJumpVec.x!==this.jumpVec.x&&this.oldJumpVec.y!==this.jumpVec.y&&this.setWalkAnimation()}else 0>this.jumpVec.y&&(this.currentAnimation=
this.stand)},setJumpAnimation:function(){this.currentAnimation=0>this.jumpVec.y&&0<this.currVel.x?this.walkJumpRight:0>this.jumpVec.y&&0>this.currVel.x?this.walkJumpLeft:0<this.jumpVec.y&&0<this.currVel.x?this.ceilingJumpR:0<this.jumpVec.y&&0>this.currVel.x?this.ceilingJumpL:0<this.jumpVec.x?this.ceilingJumpR:0>this.jumpVec.x?this.ceilingJumpL:this.standJump;this.jumper=!0},setWalkAnimation:function(){this.flying&&0<this.currVel.x?(this.currentAnimation=this.ceilingRight,this.jumper=!1):this.flying&&
0>this.currVel.x?(this.currentAnimation=this.ceilingLeft,this.jumper=!1):0>this.jumpVec.x?(this.currentAnimation=this.wallWalkRight,this.jumper=!1):0<this.jumpVec.x?(this.currentAnimation=this.wallWalkLeft,this.jumper=!1):0>this.jumpVec.y&&0<this.currVel.x?(this.currentAnimation=this.walkRight,this.jumper=!1):0>this.jumpVec.y&&0>this.currVel.x?(this.currentAnimation=this.walkLeft,this.jumper=!1):0<this.jumpVec.y&&0<this.currVel.x?(this.currentAnimation=this.ceilingRight,this.jumper=!1):0<this.jumpVec.y&&
0>this.currVel.x&&(this.currentAnimation=this.ceilingLeft,this.jumper=!1)},convertPosToScreen:function(){this.canvaspos.x=this.newpos.x-gMap.viewRect.x;this.canvaspos.y=this.newpos.y-gMap.viewRect.y}});window.gPlayer=new a}).call(this);(function(){function c(a,b,c){b=b||1E3;var d=setInterval(function(){gContext.fillStyle=a;gContext.fillRect(0,0,gCanvas.width,gCanvas.height)},b/20);setTimeout(function(){clearInterval(d);c&&c()},b+5)}function a(a,b,c){gContext.globalAlpha=0;b=b||1E3;var d=setInterval(function(){gContext.globalAlpha+=0.05;gContext.drawImage(a,0,0)},b/20);setTimeout(function(){clearInterval(d);gContext.globalAlpha=1;gContext.drawImage(a,0,0);c&&c()},b+5)}function d(a,b){gContext.globalAlpha=0;var c=a||1E3,d=setInterval(function(){gContext.globalAlpha+=
0.05},c/20);setTimeout(function(){clearInterval(d);gContext.globalAlpha=1;b&&b()},c+5)}function b(){gGameEngine.loadingHTML+=gLoading.innerHTML;g(function(){gContext.fadeToImage(gCachedAssets["images/controls.png"],1E3,function(){function a(){document.removeEventListener("keyup",a);gLoading.style.visibility="visible";gContext.fadeToImage(gCachedAssets["images/doneloading.png"],500);document.getElementById("logo").style.display="none";gGameEngine.loadInterval=setInterval(function(){gGameEngine.fullyLoaded&&
(clearInterval(gGameEngine.loadInterval),document.addEventListener("keyup",gGameEngine.startGame,!1),gLoading.innerHTML="... press any key to start ...",fadeout(document.getElementsByClassName("mainfooter")[0]))},200)}gLoading.style.visibility="hidden";document.addEventListener("keyup",a)})})}function g(a){gLoading.style.position="fixed";gLoading.style.top="45%";var b=setInterval(function(){gLoading.style.top=parseInt(gLoading.style.top,10)+1+"%";70<=parseInt(gLoading.style.top,10)&&(clearInterval(b),
a())},10)}window.gLoading=null;window.gCanvas=null;window.gContext=null;window.fadein=function(a,b,c){b=b||1E3;var d=setInterval(function(){a.style.opacity=parseFloat(a.style.opacity)+0.05},b/20);setTimeout(function(){clearInterval(d);a.style.opacity=1;c&&c()},b)};window.fadeout=function(a,b,c){b=b||1E3;var d=setInterval(function(){a.style.opacity=parseFloat(a.style.opacity)-0.05},b/20);setTimeout(function(){clearInterval(d);a.style.opacity=0;c&&c()},b)};window.onload=function(){loadAssets(["images/controls.png",
"images/doneloading.png"],function(){var e=document.getElementById("soundcontrol"),f=document.getElementById("screenshot");gLoading=document.getElementById("loading");gCanvas=document.getElementById("game");gContext=gCanvas.getContext("2d");gContext.fadeToColor=c;gContext.fadeToImage=a;gContext.fadeGlobalAlpha=d;b();gSM.setup();gSM.loadAsync("sound/music.mp3",function(){gSM.playSound("sound/music.mp3",{looping:!0})});gSM.loadAsync("sound/coin.ogg",function(){});gSM.loadAsync("sound/jump.ogg",function(){});
gSM.loadAsync("sound/hit.ogg",function(){});e.addEventListener("click",function(a){a.preventDefault();gSM.togglemute();e.style.textDecoration="line-through"===e.style.textDecoration?"none":"line-through"});f.addEventListener("click",function(a){a.preventDefault();window.open(gCanvas.toDataURL(),"screen shot")});document.getElementById("resetbutton").addEventListener("click",function(a){a.preventDefault();setCookie("lastlevel",-1,10);window.location.reload()});gGameEngine.setup()})};window.setCookie=
function(a,b,c){var d=new Date;d.setDate(d.getDate()+c);b=escape(b)+(null==c?"":"; expires="+d.toUTCString());document.cookie=a+"="+b};window.getCookie=function(a){var b=document.cookie,c=b.indexOf(" "+a+"=");-1==c&&(c=b.indexOf(a+"="));-1==c?b=null:(c=b.indexOf("=",c)+1,a=b.indexOf(";",c),-1==a&&(a=b.length),b=unescape(b.substring(c,a)));return b}}).call(this);
