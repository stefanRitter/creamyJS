/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 *
 *  shared under the Creative Commons CC BY-NC-SA license:
 *  http://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 */


var EnemyEntity = AnimatedEntity.extend({
  zindex: 1,
  physBody: null,

  init: function() {},

  create: function(x, y, images, animLength) {
    this.pos.x = x;
    this.pos.y = y;

    this.physBody = gPhysicsEngine.addBody( {
      x: x/gPhysicsEngine.scale,
      y: y/gPhysicsEngine.scale,
      halfWidth: 30/gPhysicsEngine.scale,
      halfHeight: 50/gPhysicsEngine.scale,
      type: 'dynamic',
      density: 1.0,
      friction: 0.5,
      restitution: 0.7,
      radius: 32/gPhysicsEngine.scale
    });

    this.setAnimation(images, animLength, true);
  },

  onTouch: function (otherBody, impulse) {
    if(!this.physBody) return false;
    if(!otherBody.GetUserData()) return false;

    var physOwner = otherBody.GetUserData().ent;

    if(physOwner) {
      if(physOwner._killed) return false;

      // if other body is a wall reverse direction
      // if other body is player ignore because the player just died

      return true;
    }

    return false;
  },

  update: function(deltaTime) {
    // TODO: get position form physics engine

    this.parent(deltaTime);
  }
});

gGameEngine.factory['EnemyEntity'] = EnemyEntity;