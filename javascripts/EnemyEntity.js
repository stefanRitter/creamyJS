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
  zindex: 2,
  physBody: null,
  newPos: {x:0,y:0},

  create: function(x, y, w, h, images, animLength) {
    this.parent(x, y, w, h, images, animLength, true);

    this.physBody = gPhysicsEngine.addBody( {
      x: x,
      y: y,
      type: 'dynamic',
      density: 1.0,
      friction: 0.5,
      restitution: 0.7,
      radius: 32,
      userData: {
        "id": "enemy",
        "ent": this
      }
    });
  },

  onTouch: function (otherBody, impulse) {
    if(!this.physBody) return;
    if(!otherBody.GetUserData()) return;

    var physOwner = otherBody.GetUserData().ent;

    if(physOwner) {
      if(physOwner._killed) return;

      if (physOwner.id === 'platform') {
        //reverse direction

      } else if (physOwner.id === 'player') {
        gGameEngine.gameState = gGameEngine.STATE.GAMEOVER;

      }
    }
  },

  update: function(deltaTime) {
    this.newPos = this.physBody.GetPosition();

    this.position(this.newPos.x * gPhysicsEngine.scale, this.newPos.y * gPhysicsEngine.scale);

    this.parent(deltaTime);
  },

  kill: function() {
    gPhysicsEngine.removeBody(this.physBody);
  }
});

gGameEngine.factory['EnemyEntity'] = EnemyEntity;