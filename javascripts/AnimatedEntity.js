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
 *
 */


 var AnimatedEntity = EntityClass.extend({
  assets: [],
  numFrames: 0,
  currentFrame: 0,
  animLength: 0,
  stateTime: 0,
  loop: false,

  setAnimation: function(images, animLength, looping) {
    this.assets = images;
    this.animLength = animLength;
    this.numFrames = images.length;
    this.loop = looping || false;

    // TODO: pre-process sprite sheet info
  },

  update: function(deltaTime) {

    this.stateTime += deltaTime;
    if (this.stateTime > this.animLength) {
      this.stateTime = 0;

      this.currentFrame += 1;
      if (this.currentFrame >= this.numFrames) {
        this.currentFrame = 0;
        if (!this.loop) {
          this._killed = true;
        }
      }
    }
  },

  draw: function() {
    drawSprite(this.assets[this.currentFrame], this.pos.x, this.pos.y);
  }

 });

 gGameEngine.factory['AnimatedEntity'] = AnimatedEntity;