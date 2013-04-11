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

  var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame ||
                             window.webkitCancelAnimationFrame;
  window.cancelAnimationFrame = cancelAnimationFrame;
})();

(function() { "use strict";

  var GameEngineClass = Class.extend({

    // for game state and animation frame request handling
    request: null,
    startTime: 0,
    gameState: 3, // set to WIN initially to load first level
    STATE: {
      PLAY: 1,
      GAMEOVER: 2,
      WIN: 3
    },

    // levels
    numLevels: 3,
    currentLevel: -1,

    // for handling all game entities
    entities: [],
    factory: {},
    _deferredKill: [],

    // loading
    loadingHTML: '',

    // ******************************************************************************************** setup
    setup: function () {

      gContext.drawImage(gCachedAssets['images/controls.png'], 0, 0);

      // save initial loading gif
      gGameEngine.loadingHTML += gLoading.innerHTML;

      var assets = [
          'images/background.png',
          'images/gamesprite.png',
          'images/gamesprite.json',
          'javascripts/EnemyEntity.js',
          'javascripts/Background.js',
          'javascripts/GoalEntity.js',
          'javascripts/PlatformEntity.js',
          'javascripts/Player.js' ];

      loadAssets(assets, function() {

        // setup the rest of the game's engine
        gInputEngine.setup();
        gBackground.setup('images/background.png');

        gGameEngine.setupSounds();
        gGameEngine.setupSpritesAndEntities();

        // load first level and start game
        gGameEngine.loadNextLevel();
      });
    },

    // ******************************************************************************************** game loop
    gameLoop: function() {

      if (gGameEngine.gameState === gGameEngine.STATE.PLAY) {
        gGameEngine.request = requestAnimationFrame(gGameEngine.gameLoop);

        var deltaTime = Date.now() - gGameEngine.startTime;
        gGameEngine.startTime = Date.now();

        gGameEngine.update(deltaTime);
        gGameEngine.draw();
        // gContext.fillText('FPS: ' + 1000/deltaTime, gCanvas.width/2, gCanvas.height/2);

      } else if (gGameEngine.gameState === gGameEngine.STATE.GAMEOVER) {
        alert('game over');
        cancelAnimationFrame(gGameEngine.request);
      } else if (gGameEngine.gameState === gGameEngine.STATE.WIN) {
        cancelAnimationFrame(gGameEngine.request);
        gGameEngine.loadNextLevel();
      }
    },

    // ******************************************************************************************** update
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
        if (gGameEngine._deferredKill[j].kill) { gGameEngine._deferredKill[j].kill(); }
        gGameEngine.entities.erase(gGameEngine._deferredKill[j]);
      }
      gGameEngine._deferredKill = [];


      gPhysicsEngine.update(deltaTime);
    },

    // ******************************************************************************************** draw
    draw: function () {
      gBackground.draw();

      gMap.draw(gContext);


      // Bucket entities by zIndex
      var zIndex_array = [],
          entities_bucketed_by_zIndex = {};

      gGameEngine.entities.forEach(function(entity) {
        //don't draw entities that are off screen
        if( entity.isVisible ) {

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

      gGameEngine.drawFrame();
    },

    // ******************************************************************************************** next level
    loadNextLevel: function() {

      // prevent requestAnimationFrame to call more than once
      if (gGameEngine.gameState !== gGameEngine.STATE.WIN) return;
      gGameEngine.gameState = 0;

      gGameEngine.currentLevel += 1;

      if (gGameEngine.currentLevel >= gGameEngine.numLevels) {
        gContext.drawImage(gCachedAssets['images/winner.png'], 0, 0);

      } else {

        if (gGameEngine.currentLevel !== 0) {
          gContext.fillStyle = 'white';
          gContext.fillRect(0,0,gCanvas.width, gCanvas.height);

          var gif = document.getElementById('levelup');
          gif.onload = function() {

            setTimeout(function() {
              gLoading.style.visibility = 'visible';
              gif.style.display = 'none';

            }, 3000);
          };

          gif.src = 'images/levelup.gif'  + '?' + (new Date().valueOf());
          gif.style.display = 'block';

        } else {
          // while player plays level 0 & 1 cache the big tileset for later levels
          setTimeout( function() {
            loadAssets(['images/map_tileset.png'], function() {} );
          }, 8000);
        }

        // let user know we are loading
        gLoading.innerHTML = gGameEngine.loadingHTML;

        // reset game
        gPhysicsEngine.setup();
        gGameEngine.entities = [];
        gGameEngine._deferredKill = [];


        // load & parse the map and start game once it's loaded
        var level = 'images/level' + gGameEngine.currentLevel + '.json';
        gMap = new TILEDMapClass();
        gMap.load(level, function() {

          gMap.preDrawCache(); // pre-render canvas tiles

          gContext.drawImage(gCachedAssets['images/doneloading.png'], 0, 0);
          document.getElementById('logo').style.visibility = 'hidden';
          gGameEngine.drawFrame();

          gMap.createEntities();
          gMap.centerAt(gPlayer.pos.x, gPlayer.pos.y, 600, 1000);

          // let user know we are ready
          gLoading.innerHTML = "... hit any key to start ...";

          function startGame() {
            gLoading.style.visibility = 'hidden';

            gGameEngine.startTime = Date.now();
            gGameEngine.gameState = gGameEngine.STATE.PLAY;
            gGameEngine.request = requestAnimationFrame(gGameEngine.gameLoop);
            document.addEventListener('keyup', startGame, false);
          }

          document.addEventListener('keyup', startGame, false);
        }, 1000, 600);
      }
    },

    // ******************************************************************************************** utils
    spawnEntity: function (typename) {
      var ent = new (gGameEngine.factory[typename])();

      gGameEngine.entities.push(ent);

      return ent;
    },

    drawFrame: function() {
      drawSprite('blendL.png', -1, -1, 30, 601);
      drawSprite('blendR.png', 971, -1, 30, 601);
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

    // ******************************************************************************************** load sounds and entities
    setupSounds: function() {
      gSM.loadAsync('sound/coin.ogg', function()  {
        gSM.loadAsync('sound/hit.ogg', function()  {
          gSM.playSound('sound/coin.ogg');
        });
      });
    },

    setupSpritesAndEntities: function() {
      var sprite = new SpriteSheetClass();
      sprite.setAsset('images/gamesprite.png', gCachedAssets['images/gamesprite.png']);
      sprite.parseAtlasDefinition(gCachedAssets['images/gamesprite.json']);

      /*
      // main walls around the perimeter of the map
      var top = gGameEngine.spawnEntity('PlatformEntity');
      top.create(0, 0,
                  gMap.pixelSize.x, gPhysicsEngine.scale,
                  'platform.png', null);

      var right = gGameEngine.spawnEntity('PlatformEntity');
      right.create(gMap.pixelSize.x - gPhysicsEngine.scale, 0,
                  gPhysicsEngine.scale, gMap.pixelSize.y,
                  'platform.png', null);

      var bottom = gGameEngine.spawnEntity('PlatformEntity');
      bottom.create(0, gMap.pixelSize.y - gPhysicsEngine.scale,
                  gMap.pixelSize.x, gPhysicsEngine.scale,
                  'platform.png', null);

      var left = gGameEngine.spawnEntity('PlatformEntity');
      left.create(0, 0,
                  gPhysicsEngine.scale, gMap.pixelSize.y,
                  'platform.png', null);
      */
    },

    // these helpers are used by gMap to populate the level
    createPlatform: function(x, y, w, h) {
      var entity = gGameEngine.spawnEntity('PlatformEntity');
      entity.create(x, y, w, h, 'platform.png', null);
    },
    createGoal: function(x, y) {
      var entity = gGameEngine.spawnEntity('GoalEntity');
      entity.create(x, y, 380, 380, ['goal01.png', 'goal02.png', 'goal03.png', 'goal04.png', 'goal05.png',
        'goal06.png', 'goal07.png', 'goal08.png', 'goal09.png', 'goal10.png'], 700);
    },
    createDynamicEnemy: function(x, y) {
      var entity = gGameEngine.spawnEntity('EnemyEntity');
      entity.create(x, y, 139, 120, ['enemydynamic01.png', 'enemydynamic02.png', 'enemydynamic03.png', 'enemydynamic04.png',
        'enemydynamic05.png', 'enemydynamic06.png', 'enemydynamic07.png'], 500, true);
    },
    createStaticEnemy: function(x, y) {
      var entity = gGameEngine.spawnEntity('EnemyEntity');
      entity.create(x, y, 300, 104, ['enemystatic01.png', 'enemystatic02.png', 'enemystatic03.png', 'enemystatic04.png',
        'enemystatic05.png', 'enemystatic06.png', 'enemystatic06.png'], 800, false);
    }
  });

  window.gGameEngine = new GameEngineClass();
}).call(this);


