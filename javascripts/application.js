/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 * 
 *  This project is based on Udacity game dev course: 
 *  https://www.udacity.com/course/cs255
 *
 *  shared under the Creative Commons CC BY-NC-SA license:
 *  http://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 */

(function() { "use strict";

	// ******************************************************************************* globals
	window.gLoading = null;
  window.gCanvas = null;
  window.gContext = null;

	// ******************************************************************************* utils
  function createScreenshot() {
    window.open(gCanvas.toDataURL(), 'screen shot');
  }

  function slideDown() {
    gLoading.style.position = 'fixed';
    gLoading.style.top = '45%';

    var inter = setInterval(function() {
      gLoading.style.top =  (parseInt(gLoading.style.top, 10) + 1) + '%';
      if (parseInt(gLoading.style.top, 10) >= 70) {
        clearInterval(inter);
      }
    }, 10);
  }

  // ******************************************************************************* assets
  var assets = [
      'images/controls.png',
      'images/doneloading.png',
      'images/winner.png'];

	// ******************************************************************************* onload
	window.onload = function () {

    loadAssets(assets, init);

    function init() {

      var soundcontrol = document.getElementById('soundcontrol'),
          screenshot = document.getElementById('screenshot');

      // set globals
      gLoading = document.getElementById('loading');
      gCanvas = document.getElementById('game');
      gContext = gCanvas.getContext('2d');

      slideDown(gLoading, 20);
      gContext.drawImage(gCachedAssets['images/controls.png'], 0, 0);

      // setup UI
      gSM.setup();

      soundcontrol.addEventListener('click', function(event) {
        event.preventDefault();
        gSM.togglemute();
        soundcontrol.style.textDecoration = (soundcontrol.style.textDecoration === 'line-through') ? 'none' : 'line-through';
      });

      screenshot.addEventListener('click', function(event) {
        event.preventDefault();
        createScreenshot();
      });

      // load and start playing music
      gSM.loadAsync('sound/music.mp3', function() {
          gSM.playSound('sound/music.mp3', { looping: true });
      });

      gGameEngine.setup();
    }
	};
}).call(this);