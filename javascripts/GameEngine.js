

GameEngineClass = Class.extend({

  entities: [],
    factory: {},
    _deferredKill: [],

  //-----------------------------
  setup: function () {

    // Create physics engine
    gPhysicsEngine.create();
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

    }

});

gGameEngine = new GameEngineClass();

