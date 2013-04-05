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

    gPlayer: {
      pos: {
        x: 0,
        y: 0
      },

      walkSpeed: 1

      // mpPhysBody: new BodyDef()
    },

    // ******************************************************************************* setup
    setup: function () {

      var assets = [
          'images/blend.png',
          'images/glowy.png',
          'images/glowy.json',
          'javascripts/AnimatedEntity.js' ];

      loadAssets(assets, function() {

        gSM.create();
        gInputEngine.setup();

        gSM.loadAsync('sound/coin.ogg', function()  {
          gSM.loadAsync('sound/music.mp3', function()  {
            gSM.playSound('sound/music.mp3', { looping: true });
            gSM.playSound('sound/coin.ogg');
          });
        });

        var spriteTest = new SpriteSheetClass();
        spriteTest.setAsset('images/glowy.png', gCachedAssets['images/glowy.png']);
        spriteTest.parseAtlasDefinition(gCachedAssets['images/glowy.json']);

        var entityTest = gGameEngine.spawnEntity('AnimatedEntity');
        entityTest.pos.x = 300;
        entityTest.pos.y = 300;

        entityTest.setAnimation(['001.png', '002.png', '003.png', '004.png'], 400, true);


        // Create physics engine
        gPhysicsEngine.create();

        // Add collision listener
        gPhysicsEngine.addContactListener({

            PostSolve: function (bodyA, bodyB, impulse) {
                var uA = bodyA ? bodyA.GetUserData() : null;
                var uB = bodyB ? bodyB.GetUserData() : null;

                if (uA !== null) {
                    if (uA.ent !== null && uA.ent.onTouch) {
                        uA.ent.onTouch(bodyB, null, impulse);
                    }
                }

                if (uB !== null) {
                    if (uB.ent !== null && uB.ent.onTouch) {
                        uB.ent.onTouch(bodyA, null, impulse);
                    }
                }
            }
        });

        // load map and start game once loaded
        gMap.load('images/map/desert.json', function() {

          gMap.centerAt(gGameEngine.gPlayer.pos.x, gGameEngine.gPlayer.pos.y, 600, 1000);
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
      gGameEngine.draw(deltaTime);
    },

    // ******************************************************************************* update
    update: function (deltaTime) {

      gGameEngine.updatePlayer(deltaTime);


      // update entity or move to kill array if killed
      for (var i = 0; i < gGameEngine.entities.length; i++) {
        var ent = gGameEngine.entities[i];
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
    draw: function (deltaTime) {

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
          entity.draw(deltaTime);
        });
      });

      // draw frame
      // gContext.drawImage(gCachedAssets['images/blend.png'],-1,-1, 1002, 601);
    },

    // ******************************************************************************* utils
    spawnEntity: function (typename) {
      var ent = new (gGameEngine.factory[typename])();

      gGameEngine.entities.push(ent);

      return ent;
    },

    updatePlayer: function (deltaTime) {

      gGameEngine.stateTime += deltaTime;
      if (gGameEngine.stateTime > 50) {
        gGameEngine.stateTime = 0;

        if (gInputEngine.actions['move-up']) {
          this.gPlayer.pos.y -= 20;
        }
        if (gInputEngine.actions['move-right']) {
          this.gPlayer.pos.x += 20;
        }
        if (gInputEngine.actions['move-left']) {
          this.gPlayer.pos.x -= 20;
        }
        if (gInputEngine.actions['move-down']) {
          this.gPlayer.pos.y += 20;
        }

        gMap.centerAt(this.gPlayer.pos.x, this.gPlayer.pos.y, 600, 1000);
      }


      /*

      // move_dir is a Vec2 object from the Box2d
      // physics library, which is of the form
      // {
      //     x: 0,
      //     y: 0
      // }
      // 
      // We'll be going more into Box2D later in
      // the course. The Vec2 constructor takes
      // an initial x and y value to set the
      // vector to.

      if (gInputEngine.actions['move-up']) {
        // adjust the move_dir by 1 in the
        // y direction. Remember, in our
        // coordinate system, up is the
        // negative-y direction, and down
        // is the positive-y direction!
        gGameEngine.move_dir.y -= 1;
      }
      if (gInputEngine.actions['move-down']) {
        // adjust the move_dir by 1 in the
        // y direction. Remember, in our
        // coordinate system, up is the
        // negative-y direction, and down
        // is the positive-y direction!
        gGameEngine.move_dir.y += 1;
      }
      if (gInputEngine.actions['move-left']) {
        // adjust the move_dir by 1 in the
        // x direction.
        gGameEngine.move_dir.x -= 1;
      }
      if (gInputEngine.actions['move-right']) {
        // adjust the move_dir by 1 in the
        // x direction.
        gGameEngine.move_dir.x += 1;
      }

      // After modifying the move_dir above, we check
      // if the vector is non-zero. If it is, we adjust
      // the vector length based on the player's walk
      // speed.
      if (gGameEngine.move_dir.LengthSquared()) {
        // First set 'move_dir' to a unit vector in
        // the same direction it's currently pointing.
        gGameEngine.move_dir.Normalize();

        // Next, multiply 'move_dir' by the player's
        // set 'walkSpeed'. We do this in case we might
        // want to change the player's walk speed due
        // to a power-up, etc.
        gGameEngine.move_dir.Multiply(gGameEngine.gPlayer0.walkSpeed);
      }

      gGameEngine.gPlayer0.mpPhysBody.setLinearVelocity(gGameEngine.move_dir.x, gGameEngine.move_dir.y);

      // Keyboard based facing & firing direction
      if (gInputEngine.actions.fire0 || gInputEngine.actions.fire1) {

        // Grab the player's screen position in space.
        var playerInScreenSpace = {
          x: gRenderEngine.getScreenPosition(this.gPlayer0.pos).x,
          y: gRenderEngine.getScreenPosition(this.gPlayer0.pos).y
        };

        // Set the dirVec property to the difference between the
        // current mouse position and the player's position in
        // screen space.
        dirVec.x = gInputEngine.mouse.x - playerInScreenSpace.x;
        dirVec.y = gInputEngine.mouse.y - playerInScreenSpace.y;

        dirVec.normalize();
      }

      // Modify dirVec based on the current state of the 'fire-up',
      // 'fire-down', 'fire-left', 'fire-right'.
      if (gInputEngine.actions['fire-up']) {
        gGameEngine.dirVec.y--;
      } else if (gInputEngine.actions['fire-down']) {
        gGameEngine.dirVec.y++;
      }

      if (gInputEngine.actions['fire-left']) {
        gGameEngine.dirVec.x--;
      } else if (gInputEngine.actions['fire-right']) {
        gGameEngine.dirVec.x++;
      }
      */
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
    }
  });

  window.gGameEngine = new GameEngineClass();
}).call(this);


