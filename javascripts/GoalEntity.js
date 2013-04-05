/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 *
 *  shared under the Creative Commons CC BY-NC-SA license:
 *  http://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 */


var GoalEntity = AnimatedEntity.extend({
  zindex: 2,
  physBody: null,

  create: function(x, y, w, h, images, animLength) {
    this.parent(x, y, w, h, images, animLength, true);

    this.physBody = gPhysicsEngine.addBody( {
      x: x/gPhysicsEngine.scale,
      y: y/gPhysicsEngine.scale,
      type: 'static',
      radius: (w > h ? w : h)/gPhysicsEngine.scale,
      userData: {
        "id": "goal",
        "ent": this
      }
    });
  },

  onTouch: function (otherBody, impulse) {
    return; 
    // TODO: if touched by player do something amazing
  },

  update: function(deltaTime) {
    // TODO: if touched by player do something amazing
  }
});

gGameEngine.factory['GoalEntity'] = GoalEntity;