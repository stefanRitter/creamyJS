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

  create: function(x, y, w, h, image, behaviour) {
    var hlfWidth = w/2,
        hlfHeight = h/2;

    this.parent(x+hlfWidth, y+hlfHeight, w, h, image);

    this.physBody = gPhysicsEngine.addBody( {
      halfWidth: hlfWidth,
      halfHeight: hlfHeight,
      x: (x+hlfWidth),
      y: (y+hlfHeight),
      type: 'static',
      userData: {
        "id": "platform",
        "ent": this
      }
    });

    // TODO: implement different behaviours ?
  },

  draw: function() {
    // don't draw anything
  },

  onTouch: function (otherBody, impulse) {
    return;
    // TODO: implement different behaviours ?
  },

  update: function(deltaTime) {
    // TODO: implement different behaviours ?
  },

  kill: function() {
    gPhysicsEngine.removeBody(this.physBody);
  }
});

gGameEngine.factory['PlatformEntity'] = PlatformEntity;