/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 *
 *  shared under the Creative Commons CC BY-NC-SA license:
 *  http://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 */

(function() { "use strict";

  var PlayerClass = Class.extend({
    pos: { x: 500, y: 300 },
    stateTime: 0,
    walkSpeed: 1,
    physBody: null,
    readyToJump: false,
    jumpStrength: -40,
    speed: 10/2,
    maxSpeed: 10/2,
    currVel: null,

    setup: function() {

      this.physBody = gPhysicsEngine.addBody( {
        x: this.pos.x/gPhysicsEngine.scale,
        y: this.pos.y/gPhysicsEngine.scale,
        type: 'dynamic',
        density: 1.0,
        friction: 1.0,
        restitution: 0.2,
        radius: 32/gPhysicsEngine.scale,
        userData: {
          "id": 'player',
          "ent": this
        }
      });
    },

    draw: function() { },

    update: function(deltaTime) {

      this.pos = this.physBody.GetPosition();
      this.currVel = this.physBody.GetLinearVelocity();

      this.stateTime += deltaTime;
      //if (this.stateTime > 50) {
        this.stateTime = 0;

        // slow down running
        //this.physBody.ApplyImpulse({ x: -(this.currVel.x/10), y:0}, this.pos);

        if (gInputEngine.actions['jump']) {
          // apply vertical impulse only if ready to jump
          if (this.readyToJump) {
            this.physBody.ApplyImpulse({ x:0, y: this.jumpStrength}, this.pos);
            this.readyToJump = false;
          }
        }

        if (gInputEngine.actions['move-right']) {

          if (this.currVel.x < this.maxSpeed) {
            this.physBody.ApplyImpulse({ x: this.speed, y:0}, this.pos);
          }
        }
        if (gInputEngine.actions['move-left']) {
          if (this.currVel.x > -this.maxSpeed) {
            this.physBody.ApplyImpulse({ x: -this.speed, y:0}, this.pos);
          }
        }
      //}

      // convert back to pixels for renderer
      this.pos.x *= gPhysicsEngine.scale;
      this.pos.y *= gPhysicsEngine.scale;

      gMap.centerAt(this.pos.x, this.pos.y, 600, 1000);
    },

    onTouch: function (otherBody, impulse) {
      this.readyToJump = true;

      if(!this.physBody) return false;
      if(!otherBody.GetUserData()) return false;

      var physOwner = otherBody.GetUserData().ent;

      if(physOwner) {
        if(physOwner._killed) return false;

        // what did the player hit?
        // if wall or floor then this.readyToJump = true;

        return true;
      }

      return false;
    },

    onEndContact: function () {
      this.readyToJump = false;
    }
  });

  window.gPlayer = new PlayerClass();
}).call(this);