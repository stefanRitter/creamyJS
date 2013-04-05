/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 *
 *  shared under the Creative Commons CC BY-NC-SA license:
 *  http://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 */


var AnimatedEntity = EntityClass.extend({
  assets: [],
  numFrames: 0,
  currentFrame: 0,
  frameLength: 0,
  stateTime: 0,
  loop: false,

  init: function() {},

  setAnimation: function(images, animLength, looping) {
    this.assets = images;
    this.numFrames = images.length;
    this.frameLength = animLength / this.numFrames;
    this.loop = looping || false;

    // TODO: pre-process sprite sheet info
    // TODO: set size property
    // TODO: set half size property
  },

  update: function(deltaTime) {

    this.stateTime += deltaTime;
    if (this.stateTime > this.frameLength) {
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
    // TODO: convert world to screen pos
    // TODO: minus half size
    drawSprite(this.assets[this.currentFrame], this.pos.x, this.pos.y);
  }
});

gGameEngine.factory['AnimatedEntity'] = AnimatedEntity;