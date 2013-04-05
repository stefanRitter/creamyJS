/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 *  
 *  GameEngineClass based on Udacity game dev course: 
 *  https://www.udacity.com/course/cs255
 *
 *  shared under the Creative Commons CC BY-NC-SA license:
 *  http://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 */


(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

(function() { //"use strict";
  var GameEngineClass = Class.extend({

    startTime: 0,
    stateTime: 0,

    move_dir: new Vec2(0,0),
    dirVec: new Vec2(0,0),

    entities: [],
    factory: {},
    _deferredKill: [],

    // ******************************************************************************* setup
    setup: function () {

      var assets = [
          'images/blend.png',
          'images/glowy.png',
          'images/glowy.json',
          'javascripts/AnimatedEntity.js',
          'javascripts/EnemyEntity.js',
          'javascripts/Player.js' ];

      loadAssets(assets, function() {

        // setup the rest of the game's engine
        gSM.setup();
        gInputEngine.setup();
        gPhysicsEngine.setup();

        // gGameEngine.setupSounds();
        gGameEngine.setupSpritesAndEntities();

        // lastly load & parse the map and start game once it's loaded
        gMap.load('images/map/desert.json', function() {

          gMap.centerAt(gPlayer.pos.x, gPlayer.pos.y, 600, 1000);
          gMap.preDrawCache(); // divide map into pre-rendered tiles

          // let user know we are ready
          gLoading.innerHTML = "click to start";

          function startGame() {
            gLoading.style.visibility = 'hidden';

            gGameEngine.startTime = Date.now();
            requestAnimationFrame(gGameEngine.gameLoop);
            gCanvas.removeEventListener('click', startGame, false);
          }

          gCanvas.addEventListener('click', startGame, false);
        }, 1000, 600);
      });
    },

    // ******************************************************************************* game loop
    gameLoop: function() {
      requestAnimationFrame(gGameEngine.gameLoop);

      var deltaTime = Date.now() - gGameEngine.startTime;
      gGameEngine.startTime = Date.now();


      gGameEngine.update(deltaTime);
      // gGameEngine.draw();
    },

    // ******************************************************************************* update
    update: function (deltaTime) {

      gPlayer.update(deltaTime);


      // update entity or move to kill array if killed
      var ent = null;
      for (var i = 0; i < gGameEngine.entities.length; i++) {
        ent = gGameEngine.entities[i];
        if(!ent._killed) {
          ent.update(deltaTime);
        } else {
          gGameEngine._deferredKill.push(ent);
        }
      }

      // erase killed entities
      for (var j = 0; j < gGameEngine._deferredKill.length; j++) {
        gGameEngine.entities.erase(gGameEngine._deferredKill[j]);
      }
      gGameEngine._deferredKill = [];


      gPhysicsEngine.update();
    },

    // ******************************************************************************* draw
    draw: function () {

      gMap.draw(gContext);


      // Bucket entities by zIndex
      var fudgeVariance = 128,
          zIndex_array = [],
          entities_bucketed_by_zIndex = {};

      gGameEngine.entities.forEach(function(entity) {
        //don't draw entities that are off screen
        if(entity.pos.x >= gMap.viewRect.x - fudgeVariance &&
           entity.pos.x < gMap.viewRect.x + gMap.viewRect.w + fudgeVariance &&
           entity.pos.y >= gMap.viewRect.y - fudgeVariance &&
           entity.pos.y < gMap.viewRect.y + gMap.viewRect.h + fudgeVariance) {

            // Bucket the entities in the entities list by their zindex property.
            if (zIndex_array.indexOf(entity.zindex) === -1) {
                zIndex_array.push(entity.zindex);
                entities_bucketed_by_zIndex[entity.zindex] = [];
            }

            entities_bucketed_by_zIndex[entity.zindex].push(entity);
        }
      });

      // Draw entities sorted by zIndex
      zIndex_array.sort(function(a,b) { return a - b;});
      zIndex_array.forEach(function(zindex) {
        entities_bucketed_by_zIndex[zindex].forEach(function(entity) {
          entity.draw();
        });
      });


      gPlayer.draw();

      // draw frame
      // gContext.drawImage(gCachedAssets['images/blend.png'],-1,-1, 1002, 601);
    },

    // ******************************************************************************* utils
    spawnEntity: function (typename) {
      var ent = new (gGameEngine.factory[typename])();

      gGameEngine.entities.push(ent);

      return ent;
    },

    //----------------------------
    // Parameters:
    //  1) soundURL: a string representing the path to the sound
    //               file.
    //  2, 3) x, y:  The position within the game world where the
    //               sound should be playing from.
    //----------------------------
    playWorldSound: function (soundURL, x, y) {

      // We set a shorthand for gGameEngine.gMap for ease of use.
      var gMap = gGameEngine.gMap;

      // Grab the maximum of half the width and height of the viewRect
      // for calculating screen distance from player.
      var viewSize = Math.max(gMap.viewRect.w, gMap.viewRect.h) * 0.5;

      // Grab the player's position.
      var oCenter = gGameEngine.gPlayer.pos;

      // Calculate the distance from the player's position to the
      // sound's position. Note that we don't want negative distances,
      // so you'll need to use the Math.abs function to get the
      // absolute value of the calculated difference.
      var dx = Math.abs(oCenter.x - x);
      var dy = Math.abs(oCenter.y - y);
      var dist = Math.sqrt(dx*dx + dy*dy);

      // Normalize the distance from the player to the sound based
      // on the viewSize we calculated earlier.
      // 
      // If the distance from the player to the sound is more than
      // one viewSize away, the sound shouldn't play. If the sound
      // is half of a viewSize away, then the sound should play at
      // half volume, etc.
      var normDist = dist / viewSize;
      if (normDist > 1) normDist = 1;
      if (normDist < 0) return;

      var vol = 1.0 - normDist;

      // Play the sound 
      var sound = gSM.loadAsync(soundURL, function(sObj) {
          gSM.playSound(sObj.path, {volume: vol, looping: false});
      });
    },

    // ******************************************************************************* load sounds and entities
    setupSpritesAndEntities: function() {
      var spriteTest = new SpriteSheetClass();
      spriteTest.setAsset('images/glowy.png', gCachedAssets['images/glowy.png']);
      spriteTest.parseAtlasDefinition(gCachedAssets['images/glowy.json']);

      var entityTest = gGameEngine.spawnEntity('EnemyEntity');
      entityTest.create(500, 300, ['001.png', '002.png', '003.png', '004.png', '005.png'], 400);
    },

    setupSounds: function() {
      gSM.loadAsync('sound/coin.ogg', function()  {
        gSM.loadAsync('sound/music.mp3', function() {
          gSM.playSound('sound/music.mp3', { looping: true });
          gSM.playSound('sound/coin.ogg');
        });
      });
    }
  });

  window.gGameEngine = new GameEngineClass();
}).call(this);


