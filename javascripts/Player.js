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
    // positions for physics, movement, rendering, beaming
    startPos: { x: 0, y: 0},
    pos: { x: 0, y: 0 },
    forcePos: null,
    newpos: { x: 0, y: 0},
    canvaspos: { x: 0, y: 0},

    stateTime: 0,
    physBody: null,

    // jump logic
    readyToJump: false,
    jumpStrength: 40,
    jumpVec: { x: 0, y: 0},

    // move logic
    speed: 5,
    maxSpeed: 7,
    currVel: null,

    // ******************************************************************************************** setup
    setup: function(x, y) {
      this.startPos.x = x;
      this.startPos.y = y;

      this.physBody = gPhysicsEngine.addBody( {
        x: x,
        y: y,
        type: 'dynamic',
        density: 1.0,
        friction: 1,
        restitution: -2, // sticky
        radius: 32,
        userData: {
          "id": 'player',
          "ent": this
        }
      });
    },

    // ******************************************************************************************** draw
    draw: function() {
      this.convertPosToScreen();

      gContext.beginPath();
      gContext.arc(this.canvaspos.x, this.canvaspos.y, 32, 0 , 2 * Math.PI, false);
      gContext.fillStyle = 'blue';
      gContext.fill();
      gContext.closePath();
    },

    // ******************************************************************************************** update
    update: function(deltaTime) {

      if (this.newpos.y > gMap.pixelSize.y) {
        // we are off the map we get sent back to the start
        this.forcePos = { x: this.startPos.x , y: this.startPos.y };
      }
      if (this.forcePos) { // set by onTouch when we hit an enemy entity
        this.physBody.SetPosition(new Vec2(this.forcePos.x/gPhysicsEngine.scale, this.forcePos.y/gPhysicsEngine.scale));
        this.forcePos = null;
      }



      this.pos = this.physBody.GetPosition();
      this.currVel = this.physBody.GetLinearVelocity();

      // attach to surface by applying negative gravity
      if (this.jumpVec.y > 0) {
        this.physBody.ApplyImpulse({ x: 0, y:-(gPhysicsEngine.gravity.y)}, this.pos);
      }

      this.stateTime += deltaTime;
      if (this.stateTime > 50) {
        this.stateTime = 0;

        // slow down
        this.physBody.ApplyImpulse({ x: -(this.currVel.x/10), y:-(this.currVel.x/10)}, this.pos);

        if (gInputEngine.actions['jump']) {
          // apply vertical impulse only if ready to jump
          if (this.readyToJump) {
            this.physBody.ApplyImpulse(this.jumpVec, this.pos);

            // detach from surface
            this.jumpVec.x = 0;
            this.jumpVec.y = 0;
            this.readyToJump = false;
          }
        }

        if (this.readyToJump === true) { // only move left or right when not jumping

          if (gInputEngine.actions['move-right']) {

            if (this.currVel.x < this.maxSpeed) { // limit max velocity

              if (this.jumpVec.x === 0) { // move normal to jump vector
                this.physBody.ApplyImpulse({ x: this.speed, y:0}, this.pos);
              } else {
                this.physBody.ApplyImpulse({ x:0, y: this.speed}, this.pos);
              }
            }
          }

          if (gInputEngine.actions['move-left']) {

            if (this.currVel.x > -this.maxSpeed) {

              if (this.jumpVec.x === 0) {
                this.physBody.ApplyImpulse({ x: -this.speed, y:0}, this.pos);
              } else {
                this.physBody.ApplyImpulse({ x:0, y: -this.speed}, this.pos);
              }
            }
          }
        }
      }

      // convert back to pixels for renderer
      this.newpos.x = this.pos.x * gPhysicsEngine.scale;
      this.newpos.y = this.pos.y * gPhysicsEngine.scale;

      gMap.centerAt(this.newpos.x, this.newpos.y, 600, 1000);
    },

    // ******************************************************************************************** collisions
    onTouch: function (otherBody, impulse, contact) {
      if(!this.physBody) return;
      if(!otherBody.GetUserData()) return;

      var physOwner = otherBody.GetUserData();

      if(physOwner.ent) {
        if(physOwner.ent._killed) return;

        if (physOwner.id === 'platform') {
          this.readyToJump = true;

          var manifold = contact.GetManifold();
          var normal = manifold.m_localPlaneNormal;

          // jump normal to current surface
          this.jumpVec = { x: normal.x * this.jumpStrength, y: normal.y * this.jumpStrength};

        } else if (physOwner.id === 'enemy') {
          // if we hit an enemy we have to start over
          this.forcePos = { x: this.startPos.x , y: this.startPos.y };

        } else if (physOwner.id === 'goal') {
          gGameEngine.gameState = gGameEngine.STATE.WIN;
        }
      }
    },

    onEndContact: function () {
      // detach from surface
      this.jumpVec.x = 0;
      this.jumpVec.y = 0;
      this.readyToJump = false;
    },

    // ******************************************************************************************** utils
    convertPosToScreen: function() {
      this.canvaspos.x = this.newpos.x - gMap.viewRect.x;
      this.canvaspos.y = this.newpos.y - gMap.viewRect.y;
    }
  });

  window.gPlayer = new PlayerClass();
}).call(this);