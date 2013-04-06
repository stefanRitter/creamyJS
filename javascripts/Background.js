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
  var BackgroundClass = Class.extend({

    image: '',

    setup: function (image) {
      this.image = image;
    },

    draw: function() {
      gContext.drawImage(gCachedAssets[this.image],0,0, gCanvas.width, gCanvas.height);
    }
  });

  window.gBackground = new BackgroundClass();
}).call(this);