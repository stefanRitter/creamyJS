/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 *  
 *  EntityClass based on Udacity game dev course: 
 *  https://www.udacity.com/course/cs255
 *
 */


EntityClass = Class.extend({
    // can all be referenced by child classes
    pos : {x:0,y:0},
    size : {x:0,y:0},
    last : {x:0,y:0},

    currSpriteName : null,
    zindex: 0,

    // overloaded by child classes
    update : function() { },

    //-----------------------------------------
    draw : function() {
    if (this.currSpriteName) {

            drawSprite(this.currSpriteName,
                   this.pos.x.round() - Math.floor(this.size.x / 2),
                   this.pos.y.round() - Math.floor(this.size.y / 2)
              );
        }
    }
});