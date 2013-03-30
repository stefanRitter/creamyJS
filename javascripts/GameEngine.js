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
 

GameEngineClass = Class.extend({

    entities: [],
    factory: {},
    _deferredKill: [],

    //-----------------------------
    init: function () {},

    //-----------------------------
    setup: function () {

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

    },

    spawnEntity: function (typename) {
        var ent = new (gGameEngine.factory[typename])();

        gGameEngine.entities.push(ent);

        return ent;
    },

    update: function () {

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
        gPhysicsEngine.update();
    }

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
        if (gGameEngine.gPlayer0 === null) return;

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

gGameEngine = new GameEngineClass();

