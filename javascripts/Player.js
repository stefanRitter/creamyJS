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
    pos: {
      x: 500,
      y: 300
    },
    stateTime: 0,
    walkSpeed: 1,
    mpPhysBody: new BodyDef(),

    init: function() { },

    draw: function() { },

    update: function(deltaTime) {
      this.stateTime += deltaTime;
      if (this.stateTime > 50) {
        this.stateTime = 0;

        if (gInputEngine.actions['move-up']) {
          this.pos.y -= 20;
        }
        if (gInputEngine.actions['move-right']) {
          this.pos.x += 20;
        }
        if (gInputEngine.actions['move-left']) {
          this.pos.x -= 20;
        }
        if (gInputEngine.actions['move-down']) {
          this.pos.y += 20;
        }

        gMap.centerAt(this.pos.x, this.pos.y, 600, 1000);
      }
    }
  });

  window.gPlayer = new PlayerClass();
}).call(this);

/*
updatePlayer: function (deltaTime) {

  

  // move_dir is a Vec2 object from the Box2d
  // physics library, which is of the form
  // {
  //     x: 0,
  //     y: 0
  // }
  // 
  // We'll be going more into Box2D later in
  // the course. The Vec2 constructor takes
  // an initial x and y value to set the
  // vector to.

  if (gInputEngine.actions['move-up']) {
    // adjust the move_dir by 1 in the
    // y direction. Remember, in our
    // coordinate system, up is the
    // negative-y direction, and down
    // is the positive-y direction!
    gGameEngine.move_dir.y -= 1;
  }
  if (gInputEngine.actions['move-down']) {
    // adjust the move_dir by 1 in the
    // y direction. Remember, in our
    // coordinate system, up is the
    // negative-y direction, and down
    // is the positive-y direction!
    gGameEngine.move_dir.y += 1;
  }
  if (gInputEngine.actions['move-left']) {
    // adjust the move_dir by 1 in the
    // x direction.
    gGameEngine.move_dir.x -= 1;
  }
  if (gInputEngine.actions['move-right']) {
    // adjust the move_dir by 1 in the
    // x direction.
    gGameEngine.move_dir.x += 1;
  }

  // After modifying the move_dir above, we check
  // if the vector is non-zero. If it is, we adjust
  // the vector length based on the player's walk
  // speed.
  if (gGameEngine.move_dir.LengthSquared()) {
    // First set 'move_dir' to a unit vector in
    // the same direction it's currently pointing.
    gGameEngine.move_dir.Normalize();

    // Next, multiply 'move_dir' by the player's
    // set 'walkSpeed'. We do this in case we might
    // want to change the player's walk speed due
    // to a power-up, etc.
    gGameEngine.move_dir.Multiply(gGameEngine.gPlayer0.walkSpeed);
  }

  gGameEngine.gPlayer0.mpPhysBody.setLinearVelocity(gGameEngine.move_dir.x, gGameEngine.move_dir.y);

  // Keyboard based facing & firing direction
  if (gInputEngine.actions.fire0 || gInputEngine.actions.fire1) {

    // Grab the player's screen position in space.
    var playerInScreenSpace = {
      x: gRenderEngine.getScreenPosition(this.gPlayer0.pos).x,
      y: gRenderEngine.getScreenPosition(this.gPlayer0.pos).y
    };

    // Set the dirVec property to the difference between the
    // current mouse position and the player's position in
    // screen space.
    dirVec.x = gInputEngine.mouse.x - playerInScreenSpace.x;
    dirVec.y = gInputEngine.mouse.y - playerInScreenSpace.y;

    dirVec.normalize();
  }

  // Modify dirVec based on the current state of the 'fire-up',
  // 'fire-down', 'fire-left', 'fire-right'.
  if (gInputEngine.actions['fire-up']) {
    gGameEngine.dirVec.y--;
  } else if (gInputEngine.actions['fire-down']) {
    gGameEngine.dirVec.y++;
  }

  if (gInputEngine.actions['fire-left']) {
    gGameEngine.dirVec.x--;
  } else if (gInputEngine.actions['fire-right']) {
    gGameEngine.dirVec.x++;
  }
}
*/