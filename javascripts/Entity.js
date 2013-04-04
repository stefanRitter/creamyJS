/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 *  
 *  EntityClass based on Udacity game dev course: 
 *  https://www.udacity.com/course/cs255
 *
 *  shared under the Creative Commons CC BY-NC-SA license:
 *  http://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 */


var EntityClass = Class.extend({
    // can all be referenced by child classes
    pos :  {x:0,y:0},
    size : {x:0,y:0},
    last : {x:0,y:0},
    _killed: false,

    currSpriteName : null,
    zindex: 0,

    // overloaded by child classes
    update : function() { },

    //-----------------------------------------
    draw : function() {

      if (this.currSpriteName) {
        drawSprite(this.currSpriteName, this.pos.x, this.pos.y);

        /*drawSprite(this.currSpriteName,
          this.pos.x.round() - Math.floor(this.size.x / 2),
          this.pos.y.round() - Math.floor(this.size.y / 2)
        );*/
      }
    }
});


/*

//
// example with physics ontouch
//

EnergyCanisterClass = EntityClass.extend({
    physBody: null,
    _killed: false,

    init: function (x, y, settings) {
        this.parent(x, y, settings);

        var startPos = {
            x: x,
            y: y
        };

        // Create our physics body;
        var entityDef = {
            id: "EnergyCanister",
            type: 'static',
            x: startPos.x,
            y: startPos.y,
            halfHeight: 18 * 0.5,
            halfWidth: 19 * 0.5,
            damping: 0,
            angle: 0,
            categories: ['projectile'],
            collidesWith: ['player'],
            userData: {
                "id": "EnergyCanister",
                "ent": this
            }
        };

        this.physBody = gPhysicsEngine.addBody(entityDef);
        this.physBody.SetLinearVelocity(new Vec2(0, 0));
    },

    //-----------------------------------------
    kill: function () {
        // Remove my physics body
        gPhysicsEngine.removeBody(this.physBody);
        this.physBody = null;

        // Destroy me as an entity
        this._killed = true;
    },

    //-----------------------------------------
    onTouch: function (otherBody, point, impulse) {
        if(!this.physBody) return false;
        if(!otherBody.GetUserData()) return false;

        var physOwner = otherBody.GetUserData().ent;

        if(physOwner !== null) {
            if(physOwner._killed) return false;

            // Increase the 'energy' property of 'physOwner' by
            // 10 when it touches this EnergyCanister.
            //
            // YOUR CODE HERE
            physOwner.energy += 10;

            this.markForDeath = true;
        }

        return true;
    }

});

gGameEngine.factory['EnergyCanister'] = EnergyCanisterClass;

*/
