/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 *
 *  shared under the Creative Commons CC BY-NC-SA license:
 *  http://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 */


var PlatformEntity = EntityClass.extend({
  zindex: 1,
  physBody: null,
  newPos: {x:0, y:0},

  create: function(x, y, w, h, image) {
    this.parent(x, y, w, h, image);

    // TODO: implement different behaviours ?

    this.physBody = gPhysicsEngine.addBody( {
      x: x/gPhysicsEngine.scale,
      y: y/gPhysicsEngine.scale,
      halfWidth: w/gPhysicsEngine.scale,
      halfHeight: h/gPhysicsEngine.scale,
      type: 'static',
      userData: {
        "id": "platform",
        "ent": this
      }
    });
  },

  onTouch: function (otherBody, impulse) {
    return; 
    // TODO: implement different behaviours ?
  },

  update: function(deltaTime) {
    // TODO: implement different behaviours ?
  }
});

gGameEngine.factory['PlatformEntity'] = PlatformEntity;