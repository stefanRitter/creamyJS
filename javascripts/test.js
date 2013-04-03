/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 * 
 *  I'm using this file to progressively test each class from the gamedev course
 *
 */

(function() { "use strict";

  var assets = [
    'javascripts/SoundManager.js',
    'javascripts/InputEngine.js',
    'images/1.gif',
    'images/2.png',
    'images/3.png',
    'javascripts/Spritesheet.js',
    'images/test.json',
    'images/test.png'
  ];

  /* TODO: test the following
    'javascripts/TILEDmap.js',
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


    // test sound
    gSM.loadAsync('sound/coin.ogg', function()  {
      gSM.loadAsync('sound/music.mp3', function()  {
        gSM.playSound('sound/music.mp3', { looping: true });
        gSM.playSound('sound/coin.ogg');
      });
    });

    // test input (hit W to toggle mute)
    setInterval(function() {
      if (gInputEngine.actions['move-up']) {
        gSM.togglemute();
        console.log('togglemute');
      }
    }, 100);

    // test loading images from AssetManager
    document.body.appendChild(gCachedAssets['images/1.gif']);
    document.body.appendChild(gCachedAssets['images/2.png']);
    document.body.appendChild(gCachedAssets['images/3.png']);

    // test Spritesheet
    var spriteTest = new SpriteSheetClass();
    spriteTest.setAsset('images/test.png', gCachedAssets['images/test.png']);
    spriteTest.parseAtlasDefinition(gCachedAssets['images/test.json']);
    drawSprite('2.png', 0, 0);

  }
}).call(this);