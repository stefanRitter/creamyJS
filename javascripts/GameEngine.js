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
        x: 300,
        y: 500
      },

      walkSpeed: 1

      // mpPhysBody: new BodyDef()
    },

    //-----------------------------
    setup: function () {

      var assets = [ 'images/blend.png' ];

      loadAssets(assets, function() {});

      gSM.create();
      gInputEngine.setup();

      var currX = 300;
      var currY = 500;

      /*
      gSM.loadAsync('sound/coin.ogg', function()  {
        gSM.loadAsync('sound/music.mp3', function()  {
          gSM.playSound('sound/music.mp3', { looping: true });
          gSM.playSound('sound/coin.ogg');
        });
      }); */


      // test TILED map loading and drawing
      gMap.load('images/map/desert.json', function() {
        gMap.centerAt(currX, currY, 600, 1000);
        gMap.preDrawCache(); // divide map into rendered tiles

        gLoading.style.visibility = 'hidden';

        gGameEngine.startTime = Date.now();
        requestAnimationFrame(gGameEngine.gameLoop);
      });

      /* 

      // Create physics engine
      gPhysicsEngine.create();

      // Add contact listener
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

      */
    },

    spawnEntity: function (typename) {
        var ent = new (gGameEngine.factory[typename])();

        gGameEngine.entities.push(ent);

        return ent;
    },

    removeEntity: function(removeEnt) {
    // We don't do anything with this right now.
    // We'll fill it in later this unit.
    },

    gameLoop: function() {
      requestAnimationFrame(gGameEngine.gameLoop);

      var deltaTime = Date.now() - gGameEngine.startTime;
      gGameEngine.startTime = Date.now();

      gGameEngine.update(deltaTime);

      gMap.draw(gContext);

      gContext.drawImage(gCachedAssets['images/blend.png'],-1,-1, 1002, 601);
    },

    update: function (deltaTime) {
      // Update player position from previous unit.
      gGameEngine.updatePlayer(deltaTime);

      /*
      // Loop through the entities and call that entity's
      // 'update' method, but only do it if that entity's
      // '_killed' flag is set to true.
      //
      // Otherwise, push that entity onto the '_deferredKill'
      // list defined above.
      for (var i = 0; i < gGameEngine.entities.length; i++) {
        var ent = gGameEngine.entities[i];
        if(!ent._killed) {
          ent.update();
        } else {
          gGameEngine._deferredKill.push(ent);
        }
      }

      // Loop through the '_deferredKill' list and remove each
      // entity in it from the 'entities' list.
      //
      // Once you're done looping through '_deferredKill', set
      // it back to the empty array, indicating all entities
      // in it have been removed from the 'entities' list.
      for (var j = 0; j < gGameEngine._deferredKill.length; j++) {
        gGameEngine.entities.erase(gGameEngine._deferredKill[j]);
      }

      gGameEngine._deferredKill = [];

      // Update physics engine
      // gPhysicsEngine.update();
      */
    },

    //-----------------------------
    draw: function () {
      // Draw map. Note that we're passing a canvas context
      // of 'null' in. This would normally be our game context,
      // but we don't need to grade this here.
      gMap.draw(null);

      // Bucket entities by zIndex
      var fudgeVariance = 128;
      var zIndex_array = [];
      var entities_bucketed_by_zIndex = {};

      gGameEngine.entities.forEach(function(entity) {
        //don't draw entities that are off screen
        if(entity.pos.x >= gMap.viewRect.x - fudgeVariance &&
           entity.pos.x < gMap.viewRect.x + gMap.viewRect.w + fudgeVariance &&
           entity.pos.y >= gMap.viewRect.y - fudgeVariance &&
           entity.pos.y < gMap.viewRect.y + gMap.viewRect.h + fudgeVariance) {
            // Bucket the entities in the entities list by their zindex
            // property.

            if (zIndex_array.indexOf(entity.zindex) === -1) {
                zIndex_array.push(entity.zindex);
                entities_bucketed_by_zIndex[entity.zindex] = [];
            }

            entities_bucketed_by_zIndex[entity.zindex].push(entity);
        }
      });

      // Draw entities sorted by zIndex

    },

    updatePlayer: function (deltaTime) {

      gGameEngine.stateTime += deltaTime;
      if (gGameEngine.stateTime > 100) {
        gGameEngine.stateTime = 0;

        if (gInputEngine.actions['move-up']) {
          this.gPlayer.pos.y -= 20;
          gMap.centerAt(this.gPlayer.pos.x, this.gPlayer.pos.y, 600, 1000);
        }
        if (gInputEngine.actions['move-right']) {
          this.gPlayer.pos.x += 20;
          gMap.centerAt(this.gPlayer.pos.x, this.gPlayer.pos.y, 600, 1000);
        }
        if (gInputEngine.actions['move-left']) {
          this.gPlayer.pos.x -= 20;
          gMap.centerAt(this.gPlayer.pos.x, this.gPlayer.pos.y, 600, 1000);
        }
        if (gInputEngine.actions['move-down']) {
          this.gPlayer.pos.y += 20;
          gMap.centerAt(this.gPlayer.pos.x, this.gPlayer.pos.y, 600, 1000);
        }
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

      // First we check if the player exists. If not, then we
      // don't need to bother playing sounds.
      if (gGameEngine.gPlayer0 === null) {
        return;
      }

      // We set a shorthand for gGameEngine.gMap for ease of use.
      var gMap = gGameEngine.gMap;

      // Grab the maximum of half the width and height of the viewRect
      // for calculating screen distance from player.
      var viewSize = Math.max(gMap.viewRect.w, gMap.viewRect.h) * 0.5;

      // Grab the player's position.
      var oCenter = gGameEngine.gPlayer0.pos;

      // Task #1
      // Calculate the distance from the player's position to the
      // sound's position. Note that we don't want negative distances,
      // so you'll need to use the Math.abs function to get the
      // absolute value of the calculated difference.
      var dx = Math.abs(oCenter.x - x);
      var dy = Math.abs(oCenter.y - y);
      var dist = Math.sqrt(dx*dx + dy*dy);


      // Task #2
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

      // Task #3
      // Play the sound found at soundURL at the specified volume.
      // You can use the loadAsync and playSound methods to
      // accomplish this.
      var sound = gSM.loadAsync(soundURL, function(sObj) {
          gSM.playSound(sObj.path, {volume: vol, looping: false});
      });
    }
  });

  window.gGameEngine = new GameEngineClass();
}).call(this);


