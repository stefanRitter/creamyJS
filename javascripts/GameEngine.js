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
    numLevels: 5,
    currentLevel: -1,

    // for handling all game entities
    entities: [],
    factory: {},
    _deferredKill: [],

    // loading
    loadingHTML: '',
    fullyLoaded: false,
    loadInterval: 0,

    // ******************************************************************************************** setup
    setup: function () {

      gContext.fadeToImage(gCachedAssets['images/controls.png'], 500);
      document.addEventListener('keyup', continueIntro);
      gLoading.style.visibility = 'hidden';

      function continueIntro() {
        document.removeEventListener('keyup', continueIntro);
        gLoading.style.visibility = 'visible';

        gContext.fadeToImage(gCachedAssets['images/doneloading.png'], 500);
        document.getElementById('logo').style.visibility = 'hidden';

        gGameEngine.loadInterval = setInterval(function() {
          // check if game is loaded
          if (gGameEngine.fullyLoaded) {
            clearInterval(gGameEngine.loadInterval);
            document.addEventListener('keyup', gGameEngine.startGame, false);
            // let user know we are ready
            gLoading.innerHTML = "... press any key to start ...";
            fadeout(document.getElementsByClassName('mainfooter')[0]);
          }
        }, 200);
      }

      // save initial loading gif
      gGameEngine.loadingHTML += gLoading.innerHTML;

      var assets = [
          'images/background.png',
          'images/gamesprite.png',
          'images/gamesprite.json' ];

      loadAssets(assets, function() {

        // setup the rest of the game's engine
        gInputEngine.setup();
        gBackground.setup('images/background.png');

        gGameEngine.setupSounds();
        gGameEngine.setupSprites();

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
        cancelAnimationFrame(gGameEngine.request);

        gContext.fadeToColor('rgba(200,100,100, 0.1)', 1500, function() {
          gGameEngine.gameState = gGameEngine.STATE.PLAY;
          gContext.fadeGlobalAlpha(400);
          gGameEngine.request = requestAnimationFrame(gGameEngine.gameLoop);
        });

      } else if (gGameEngine.gameState === gGameEngine.STATE.WIN) {
        cancelAnimationFrame(gGameEngine.request);

        gContext.fadeToColor('rgba(255,255,255, 0.3)', 600);
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

      // prevent calling more than once
      if (gGameEngine.gameState !== gGameEngine.STATE.WIN) return;
      gGameEngine.gameState = 0;


      gGameEngine.currentLevel += 1;

      if (gGameEngine.currentLevel !== 0) {
        // this is not the first level so we can assume a completed engine setup
        gContext.fillStyle = 'white';
        gContext.fillRect(0,0,gCanvas.width, gCanvas.height);

        var gif = document.getElementById('levelup');
        gif.onload = function() {
          fadein(this, 400); // appear gradually
          gif.style.display = 'block';

          if (gGameEngine.currentLevel < gGameEngine.numLevels) {
            setTimeout(function() {
              // fade after animation
              fadeout(gif, 400, function() {
                gif.style.display = 'none';
              });
              gGameEngine.startGame(); // no loading necessary so we can just dive right in
            }, 3000);
          }
        };
        if (gGameEngine.currentLevel >= gGameEngine.numLevels) {
          // player final animation
          gif.src = 'images/winner.png';
          document.addEventListener('click', function() {
            window.location='mailto:stefan@stefanritter.com';
          });
          fadein(document.getElementsByClassName('mainfooter')[0]);
          return;
        } else {
          // replay next level animation
          gif.src = 'images/levelup.gif'  + '?' + (new Date().valueOf());
        }

      } else {
        // while player plays level 0 & 1 cache the big tileset for later levels
        setTimeout( function() {
          loadAssets(['images/map_tileset.png', 'images/winner.png'], function() {} );
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
        gMap.createEntities();
        gMap.centerAt(gPlayer.pos.x, gPlayer.pos.y, 600, 1000);

        if (gGameEngine.currentLevel === 0) gGameEngine.fullyLoaded = true;
      }, 1000, 600);
    },

    startGame: function() {
      gLoading.style.visibility = 'hidden';
      document.removeEventListener('keyup', gGameEngine.startGame, false);

      gGameEngine.startTime = Date.now();
      gGameEngine.gameState = gGameEngine.STATE.PLAY;
      gContext.fadeGlobalAlpha(400);
      gGameEngine.request = requestAnimationFrame(gGameEngine.gameLoop);
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

    },

    setupSprites: function() {
      var sprite = new SpriteSheetClass();
      sprite.setAsset('images/gamesprite.png', gCachedAssets['images/gamesprite.png']);
      sprite.parseAtlasDefinition(gCachedAssets['images/gamesprite.json']);
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



  // ******************************************************************************************** DOM fadein fadeout

  function fadein(element, ms, callback) {

    var time = ms || 1000,
      interv = setInterval(function() {
      element.style.opacity = parseFloat(element.style.opacity) + 0.05;
    }, time/20);

    setTimeout(function () {
      clearInterval(interv);
      element.style.opacity = 1;

      if(callback) {
        callback();
      }
    }, time);
  }

  function fadeout(element, ms, callback) {

    var time = ms || 1000,
      interv = setInterval(function() {
      element.style.opacity = parseFloat(element.style.opacity) - 0.05;
    }, time/20);

    setTimeout(function () {
      clearInterval(interv);
      element.style.opacity = 0;

      if(callback) {
        callback();
      }
    }, time);
  }
}).call(this);


