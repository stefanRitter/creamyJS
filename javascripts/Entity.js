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

var fudgeVariance = 128;

var EntityClass = Class.extend({
    pos :  {x:0,y:0}, // center of the sprite!
    canvaspos: {x:0,y:0},
    size : {x:0,y:0},
    halfsize : {x:0,y:0},
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

    // setters
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

      /*
      // draw a circle around the centre for debug
      gContext.beginPath();
      gContext.arc(this.canvaspos.x, this.canvaspos.y, 32, 0 , 2 * Math.PI, false);
      gContext.fillStyle = 'green';
      gContext.fill();
      gContext.lineWidth = 5;
      gContext.strokeStyle = '#003300';
      gContext.stroke();
      */

      drawSprite(this.sprite, this.canvaspos.x - this.halfsize.x, this.canvaspos.y - this.halfsize.y, this.size.x, this.size.y);
    },

    isVisible: function() {
      if ( entity.pos.x >= gMap.viewRect.x - fudgeVariance &&
           entity.pos.x < gMap.viewRect.x + gMap.viewRect.w + fudgeVariance &&
           entity.pos.y >= gMap.viewRect.y - fudgeVariance &&
           entity.pos.y < gMap.viewRect.y + gMap.viewRect.h + fudgeVariance ) {
        // entity is in view
        return true;

      } else {
        //check if entity is intersection view, this is necessary because some of my entities are bigger than the canvas...
        return !( gMap.viewRect.x > (this.pos.x+this.halfsize.x) || (gMap.viewRect.x+gMap.viewRect.w) < (this.pos.x-this.halfsize.x) ||
                  gMap.viewRect.y > (this.pos.y+this.halfsize.y) || (gMap.viewRect.y+gMap.viewRect.h) < (this.pos.y+this.halfsize.y));
      }
    }
});
