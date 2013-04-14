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
  startPos: {x: 0, y: 0},
  newPos: {x:0,y:0},
  dynamic: false,
  startAnim: 0,
  currentTime: 0,
  currVel: null,

  create: function(x, y, w, h, images, animLength, type) {
    var correctionValue = 2; // -7; // how far to move the static entity into the ground

    this.dynamic = false;
    this.startPos.x = x;
    this.startPos.y = y;

    if (type === 'dynamic') {
      this.dynamic = true;
      this.parent(x, y, w, h, images, animLength, true);
      this.startAnim = Math.random() * 100;

      this.physBody = gPhysicsEngine.addBody( {
        x: x,
        y: y,
        type: 'dynamic',
        density: 1.0,
        friction: 0.0,
        restitution: 1,
        radius: 50,
        userData: {
          "id": "enemy",
          "ent": this
        }
      });

    } else if (type === 'static') {
      this.parent(x, (y + correctionValue), w, h, images, animLength, true);
      this.startAnim = Math.random() * 300;

      this.physBody = gPhysicsEngine.addBody( {
        x: x,
        y: (y + correctionValue),
        halfWidth: w/2 - 34,
        halfHeight: h/2 - 38,
        type: 'static',
        density: 1.0,
        friction: 0.5,
        restitution: 0.7,
        userData: {
          "id": "enemy",
          "ent": this
        }
      });

    } else { // round static
      this.dynamic = true;
      this.parent(x, y, w, h, images, animLength, true);
      this.startAnim = Math.random() * 100;

      this.physBody = gPhysicsEngine.addBody( {
        x: x,
        y: y,
        type: 'static',
        density: 1.0,
        friction: 0.5,
        restitution: 0.7,
        radius: 50,
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

      if (this.currVel.y < 0.8) {
        // this.physBody.ApplyImpulse({ x: 0, y: -0.8}, this.newPos);
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
  },

  // reset when player has to start over
  reset: function() {
    if (this.dynamic) {
      this.physBody.SetPosition(new Vec2(this.startPos.x/gPhysicsEngine.scale, this.startPos.y/gPhysicsEngine.scale));
      this.physBody.SetLinearVelocity(new Vec2(0,0));
    }
  }
});

gGameEngine.factory['EnemyEntity'] = EnemyEntity;