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

  var STATE_JUMP = 2,
      STATE_RUN = 1,
      STATE_IDLE = 0;

  var PlayerClass = Class.extend({
    pos: { x: 500, y: 300 },
    newpos: { x: 0, y: 0},
    canvaspos: { x: 0, y: 0},
    stateTime: 0,
    walkSpeed: 1,
    physBody: null,
    readyToJump: false,
    jumpStrength: -40,
    speed: 10/2,
    maxSpeed: 10/2,
    currVel: null,

    // ******************************************************************************* setup
    setup: function() {

      this.physBody = gPhysicsEngine.addBody( {
        x: this.pos.x,
        y: this.pos.y,
        type: 'dynamic',
        density: 1.0,
        friction: 1.0,
        restitution: 0.1,
        radius: 32,
        userData: {
          "id": 'player',
          "ent": this
        }
      });
    },

    // ******************************************************************************* draw
    draw: function() {
      this.convertPosToScreen();

      gContext.beginPath();
      gContext.arc(this.canvaspos.x, this.canvaspos.y, 32, 0 , 2 * Math.PI, false);
      gContext.fillStyle = 'green';
      gContext.fill();
      gContext.lineWidth = 5;
      gContext.strokeStyle = '#003300';
      gContext.stroke();
    },

    // ******************************************************************************* update
    update: function(deltaTime) {

      this.pos = this.physBody.GetPosition();
      this.currVel = this.physBody.GetLinearVelocity();

      this.stateTime += deltaTime;
      if (this.stateTime > 50) {
        this.stateTime = 0;

        // slow down running
        this.physBody.ApplyImpulse({ x: -(this.currVel.x/10), y:0}, this.pos);

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
      }

      // convert back to pixels for renderer
      this.newpos.x = this.pos.x * gPhysicsEngine.scale;
      this.newpos.y = this.pos.y * gPhysicsEngine.scale;

      gMap.centerAt(this.newpos.x, this.newpos.y, 600, 1000);
    },

    // ******************************************************************************* collisions
    onTouch: function (otherBody, impulse) {
      if(!this.physBody) return;
      if(!otherBody.GetUserData()) return;

      var physOwner = otherBody.GetUserData();
      console.log(physOwner.id);

      if(physOwner.ent) {
        if(physOwner.ent._killed) return;

        if (physOwner.id === 'platform') {
          this.readyToJump = true;

        } else if (physOwner.id === 'enemy') {
          gGameEngine.gameState = gGameEngine.STATE.GAMEOVER;

        } else if (physOwner.id === 'goal') {
          gGameEngine.gameState = gGameEngine.STATE.WIN;
        }
      }
    },

    onEndContact: function () {
      this.readyToJump = false;
    },

    // ******************************************************************************* utils
    convertPosToScreen: function() {
      this.canvaspos.x = this.newpos.x - gMap.viewRect.x;
      this.canvaspos.y = this.newpos.y - gMap.viewRect.y;
    }
  });

  window.gPlayer = new PlayerClass();
}).call(this);