/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 * 
 *  I'm using this file to progressively test each class from the gamedev course
 *
 */


(function() { "use strict";
  window.onload = function() {

    var assets = [
      'javascripts/SoundManager.js',
      'javascripts/InputEngine.js',
      'images/2.png',
      'images/3.png',
      'javascripts/Spritesheet.js',
      'images/test.json',
      'images/test.png',
      'javascripts/TILEDmap.js',
      'javascripts/PhysicsEngine.js',
      'javascripts/GameEngine.js'
    ];

    /* TODO: test the following
      'javascripts/GameEngine.js',
      'javascripts/PhysicsEngine.js',
      'javascripts/Entity.js',
    */

    loadAssets( assets, function() {
      console.log('yeah all loaded!');



      playTest();
    });

    function playTest() {

      var canvas = document.getElementById('my_canvas');
      canvas.width = 500;
      canvas.height = 500;
      window.gContext = canvas.getContext('2d');

      gSM.create();
      gInputEngine.setup();
      gGameEngine.setup();

      var startTime = 0;
      var deltaTime = 0;
      var stateTime = 0;

      var currX = 300;
      var currY = 500;


      // test loading images from AssetManager
      document.body.appendChild(gCachedAssets['images/1.gif']);
      document.body.appendChild(gCachedAssets['images/2.png']);
      document.body.appendChild(gCachedAssets['images/3.png']);


      // test sound
      gSM.loadAsync('sound/coin.ogg', function()  {
        gSM.loadAsync('sound/music.mp3', function()  {
          gSM.playSound('sound/music.mp3', { looping: true });
          gSM.playSound('sound/coin.ogg');
        });
      });


      // test TILED map loading and drawing
      gMap.load('images/map/desert.json', function() {
        gMap.centerAt(currX, currY, 600, 1000);
        gMap.preDrawCache(); // divide map into rendered tiles

        loading = document.getElementById('loading');
        loading.style.visibility = 'hidden';

        startTime = Date.now();
        requestAnimationFrame(animate);
      });

      function animate() {
        requestAnimationFrame(animate);

        deltaTime = Date.now() - startTime;
        startTime = Date.now();

        update(deltaTime);

        gMap.draw(gContext);
        testSpritesheet();
      }


      function update(deltaTime) {

        // test input every 100ms (hit W to toggle mute)
        stateTime += deltaTime;
        if (stateTime > 100) {
          stateTime = 0;

          if (gInputEngine.actions['move-up']) {
            gSM.togglemute();
            console.log('togglemute');
          }
          if (gInputEngine.actions['move-right']) {
            currX += 20;
            gMap.centerAt(currX, currY, 600, 1000);
          }
          if (gInputEngine.actions['move-left']) {
            currX -= 20;
            gMap.centerAt(currX, currY, 600, 1000);
          }
          if (gInputEngine.actions['move-down']) {
            currY += 20;
            gMap.centerAt(currX, currY, 600, 1000);
          }
        }
      }


      // test Spritesheet
      function testSpritesheet() {
        var spriteTest = new SpriteSheetClass();
        spriteTest.setAsset('images/test.png', gCachedAssets['images/test.png']);
        spriteTest.parseAtlasDefinition(gCachedAssets['images/test.json']);
        drawSprite('2.png', 0, 0);
      }
    }
  };
}).call(this);