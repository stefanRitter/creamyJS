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

  var velocityCheck = 0.8;

  var PlayerClass = Class.extend({
    // positions for physics, movement, rendering, beaming
    startPos: { x: 0, y: 0},
    pos: { x: 0, y: 0 },
    forcePos: null,
    newpos: { x: 0, y: 0},
    canvaspos: { x: 0, y: 0},

    size: {x: 0, y: 0},
    halfsize: {x: 0, y: 0},

    stateTime: 0,
    physBody: null,

    // jump logic
    readyToJump: false,
    jumpStrength: 230,
    jumpVec: { x: 0, y: 0},
    oldJumpVec: { x: 0, y: 0},

    // move logic
    speed: 8,
    maxSpeed: 24,
    currVel: null,

    // animations
    walkRight: ['creamywalk01.png', 'creamywalk02.png'],
    walkLeft: ['creamywalk01L.png', 'creamywalk02L.png'],

    walkJumpRight: ['creamywalk04.png', 'creamywalk05.png'],
    walkJumpLeft: ['creamywalk04L.png', 'creamywalk05L.png'],

    ceilingRight: [ 'creamyhang05.png', 'creamyhang04.png'],
    ceilingLeft: [ 'creamyhang05L.png', 'creamyhang04L.png'],

    ceilingJumpR: ['creamywalk05.png', 'creamywalk05.png'],
    ceilingJumpL: ['creamywalk05L.png', 'creamywalk05L.png'],

    stand: ['creamyjump01.png', 'creamyjump01.png'],
    standJump: ['creamyjump00.png', 'creamyjump03.png'],

    wallWalkRight: ['creamywall01.png', 'creamywall03.png'],
    wallWalkLeft: ['creamywall01L.png', 'creamywall03L.png'],

    // animation control
    currentFrame: 0,
    updateTime: 100,
    animTime: 0,
    animDir: 1,
    jumper: false,
    dirX: 1,
    dirY: 1,
    currentAnimation: null,

    // ******************************************************************************************** setup
    setup: function(x, y, w, h) {
      this.startPos.x = x;
      this.startPos.y = y;

      this.size.x = w;
      this.size.y = h;
      this.halfsize.x = w/2;
      this.halfsize.y = h/2;

      this.currentAnimation = this.stand;

      this.physBody = gPhysicsEngine.addBody( {
        x: x,
        y: y,
        type: 'dynamic',
        density: 0.6,
        friction: 2,
        restitution: -4, // sticky
        radius: (w/2),
        userData: {
          "id": 'player',
          "ent": this
        }
      });
    },

    // ******************************************************************************************** draw
    draw: function() {
      this.convertPosToScreen();

      drawSprite(this.currentAnimation[this.currentFrame], this.canvaspos.x - this.halfsize.x,
                                       this.canvaspos.y - this.halfsize.y, this.size.x, this.size.y);
    },

    // ******************************************************************************************** update
    update: function(deltaTime) {

      if (this.newpos.y > gMap.pixelSize.y) {
        // if we are off the map we get sent back to the start
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
      } else if (this.jumpVec.x > 0) {
        this.physBody.ApplyImpulse({ x: -(gPhysicsEngine.gravity.y), y:-(gPhysicsEngine.gravity.y/5)}, this.pos);
      } else if (this.jumpVec.x < 0) {
        this.physBody.ApplyImpulse({ x: (gPhysicsEngine.gravity.y), y:-(gPhysicsEngine.gravity.y/5)}, this.pos);
      }


      this.stateTime += deltaTime;
      if (this.stateTime > 50) {
        this.stateTime = 0;

        // slow down
        this.physBody.ApplyImpulse({ x: -(this.currVel.x/3), y:-(this.currVel.x/3)}, this.pos);

        if (gInputEngine.actions['jump']) {
          // apply vertical impulse only if ready to jump
          if (this.readyToJump) {
            this.physBody.ApplyImpulse(this.jumpVec, this.pos);

            this.setJumpAnimation();

            // detach from surface
            this.jumpVec.x = 0;
            this.jumpVec.y = 0;
            this.readyToJump = false;
          }
        }

        if (this.readyToJump === true) { // only move left or right when not jumping
          this.setWalkAnimation();

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

      this.oldJumpVec.x = this.jumpVec.x;
      this.oldJumpVec.y = this.jumpVec.y;

      this.updateAnimations(deltaTime);
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
          this.physBody.SetLinearVelocity( new Vec2(0,0));

        } else if (physOwner.id === 'goal') {
          gGameEngine.gameState = gGameEngine.STATE.WIN;
          gSM.playSound('sound/coin.ogg');
        }
      }
    },

    onEndContact: function () {
      // detach from surface
      this.jumpVec.x = 0;
      this.jumpVec.y = 0;
      this.readyToJump = false;
    },

    // ******************************************************************************************** animations
    updateAnimations: function(deltaTime) {

      if (this.currVel.x > velocityCheck || this.currVel.x < -velocityCheck ||
        this.currVel.y > velocityCheck || this.currVel.y < -velocityCheck) {

        this.animTime += deltaTime;
        if (this.animTime > this.updateTime) {
          this.animTime = 0;

          this.currentFrame += this.animDir;
          if (this.jumper) this.currentFrame = 1;

          if (this.currentFrame >= this.currentAnimation.length || this.currentFrame < 0) {
            this.currentFrame -= this.animDir;
            this.animDir *= -1;
          }
        }

        if (this.oldJumpVec.x !== this.jumpVec.x && this.oldJumpVec.y !== this.jumpVec.y) {
          this.setWalkAnimation();
        }
      }
    },

    setJumpAnimation: function() {
      if (this.jumpVec.y < 0 && this.currVel.x > 0) {
        this.currentAnimation = this.walkJumpRight;
        this.jumper = true;
      } else if (this.jumpVec.y < 0 && this.currVel.x < 0) {
        this.currentAnimation = this.walkJumpLeft;
        this.jumper = true;


      } else if (this.jumpVec.y > 0 && this.currVel.x > 0) {
        this.currentAnimation = this.ceilingJumpR;
        this.jumper = true;
      } else if (this.jumpVec.y > 0 && this.currVel.x < 0) {
        this.currentAnimation = this.ceilingJumpL;
        this.jumper = true;


      } else if (this.jumpVec.x > 0) {
        this.currentAnimation = this.ceilingJumpR;
        this.jumper = true;
      } else if (this.jumpVec.x < 0) {
        this.currentAnimation = this.ceilingJumpL;
        this.jumper = true;

      } else {
        this.currentAnimation = this.standJump;
        this.jumper = true;
      }
    },

    setWalkAnimation: function() {
      if (this.jumpVec.y < 0 && this.currVel.x > 0) {
        this.currentAnimation = this.walkRight;
        this.jumper = false;
      } else if (this.jumpVec.y < 0 && this.currVel.x < 0) {
        this.currentAnimation = this.walkLeft;
        this.jumper = false;

      } else if (this.jumpVec.y > 0 && this.currVel.x > 0) {
        this.currentAnimation = this.ceilingRight;
        this.jumper = false;
      } else if (this.jumpVec.y > 0 && this.currVel.x < 0) {
        this.currentAnimation = this.ceilingLeft;
        this.jumper = false;

      } else if (this.jumpVec.x < 0 && this.currVel.x > 0) {
        this.currentAnimation = this.wallWalkRight;
        this.jumper = false;
      } else if (this.jumpVec.x > 0 && this.currVel.x < 0) {
        this.currentAnimation = this.wallWalkLeft;
        this.jumper = false;
      } 
    },


    // ******************************************************************************************** utils
    convertPosToScreen: function() {
      this.canvaspos.x = this.newpos.x - gMap.viewRect.x;
      this.canvaspos.y = this.newpos.y - gMap.viewRect.y;
    }
  });

  window.gPlayer = new PlayerClass();
}).call(this);