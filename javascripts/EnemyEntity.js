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
  dynamic: false,
  startAnim: 0,
  currentTime: 0,
  currVel: null,

  create: function(x, y, w, h, images, animLength, dynamic) {
    var correctionValue = 53; // how far to move the static entity into the ground

    this.dynamic = dynamic;

    if (dynamic) {
      this.parent(x, y, w, h, images, animLength, true);
      this.startAnim = Math.random() * 200;

      this.physBody = gPhysicsEngine.addBody( {
        x: x,
        y: y,
        type: 'dynamic',
        density: 1.0,
        friction: 0.5,
        restitution: 0.7,
        radius: 50,
        userData: {
          "id": "enemy",
          "ent": this
        }
      });

    } else { // static
      this.parent(x, (y + correctionValue), w, h, images, animLength, true);
      this.startAnim = Math.random() * 1000;

      this.physBody = gPhysicsEngine.addBody( {
        x: x,
        y: (y + correctionValue),
        halfWidth: w/2,
        halfHeight: h/2,
        type: 'static',
        density: 1.0,
        friction: 0.5,
        restitution: 0.7,
        userData: {
          "id": "enemy",
          "ent": this
        }
      });
    }
  },

  update: function(deltaTime) {
    if (this.dynamic) {
      this.newPos = this.physBody.GetPosition();
      this.currVel = this.physBody.GetLinearVelocity();

      this.position(this.newPos.x * gPhysicsEngine.scale, this.newPos.y * gPhysicsEngine.scale);

      if (this.currVel.y < 0.4) {
        this.physBody.ApplyImpulse({ x: 0, y:-0.8}, this.newPos);
      }
    }
    this.currentTime += deltaTime;
    if (this.currentTime >= this.startAnim) {
      this.parent(deltaTime); // animate all enemies at random 
      if (this.currentFrame === 0) this.currentTime = 0;
    }
  },

  kill: function() {
    gPhysicsEngine.removeBody(this.physBody);
  }
});

gGameEngine.factory['EnemyEntity'] = EnemyEntity;