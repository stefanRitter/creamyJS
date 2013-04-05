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
    // referenced by child classes
    pos :  {x:0,y:0},
    canvaspos: {x:0,y:0},
    size : {x:0,y:0},
    halfsize : {x:0,y:0},
    last : {x:0,y:0},
    _killed: false,
    zindex: 0,
    sprite: '',

    create: function(x, y, w, h, image) {
      this.pos.x = x;
      this.pos.y = y;
      this.size.x = w;
      this.size.y = h;
      this.halfsize.x = w/2;
      this.halfsize.y = h/2;
      this.sprite = image;

      this.convertPosToScreen();
    },

    // define setter for the this.pos member,
    // this a work-around of an inheritance bug 
    // I ran into with the chrome debugger
    position: function(x, y) {
      this.pos.x = x;
      this.pos.y = y;
    },

    setSprite: function(image) {
      this.sprite = image;
    },

    // overloaded by child classes
    update : function() { },

    convertPosToScreen: function() {
      this.canvaspos.x = this.pos.x - gMap.viewRect.x;
      this.canvaspos.y = this.pos.y - gMap.viewRect.y;
    },

    draw : function() {
      this.convertPosToScreen();
      drawSprite(this.sprite, this.canvaspos.x - this.halfsize.x, this.canvaspos.y - this.halfsize.y);
    }
});