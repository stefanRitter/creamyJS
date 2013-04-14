/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 *  
 *  TILEDMapClass based on Udacity game dev course: 
 *  https://www.udacity.com/course/cs255
 *
 *  shared under the Creative Commons CC BY-NC-SA license:
 *  http://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 */

/*jshint loopfunc: true */

(function() {

  // ******************************************************************************************** CanvasTile Class
  var CanvasTile = Class.extend({
    x: 0,
    y: 0,
    w: 100,
    h: 100,
    cvsHdl: null,
    ctx: null,

    //-----------------------------------------
    // Initializes this CanvasTile with initial
    // values and creates a new Canvas element
    // and context for it.
    create: function (width, height) {
      this.x = -1;
      this.y = -1;
      this.w = width;
      this.h = height;
      var can2 = document.createElement('canvas');
      can2.width = width;
      can2.height = height;
      this.cvsHdl = can2;
      this.ctx = can2.getContext('2d');
    },

    //-----------------------------------------
    // Tests if this CanvasTile intersects the
    // 'viewRect' of the 'TILEDMapClass' using
    // the 'intersectRect' method below.
    isVisible: function () {
      var r2 = gMap.viewRect;
      var r1 = this;
      return gMap.intersectRect({
          top: r1.y,
          left: r1.x,
          bottom: r1.y + r1.h,
          right: r1.x + r1.w
      }, {
          top: r2.y,
          left: r2.x,
          bottom: r2.y + r2.h,
          right: r2.x + r2.w
      });
    }
  });

  // ******************************************************************************************** TILEDMapClass
  window.TILEDMapClass = Class.extend({

    // used to construct entities out of tiles on layer border
    platformBuilder: {
      newPlatform: true,
      size: 0,
      start: {x:0, y: 0},
      vertical: []
    },

    // This is where we store the full parsed
    // JSON of the map.json file.
    currMapData: null,

    // tilesets stores each individual tileset
    // from the map.json's 'tilesets' Array.
    // The structure of each entry of this
    // Array is explained below in the
    // parseAtlasDefinition method.
    tilesets: [],

    // Our 'viewRect' determines what position
    // of the map that is visible on our canvas.
    // It defaults to the top-left corner of the
    // map with a width of 1000 and a height of
    // 1000.
    viewRect: {
        "x": 0,
        "y": 0,
        "w": 1000,
        "h": 1000
    },

    // This is where we store the width and
    // height of the map in tiles. This is
    // in the 'width' and 'height' fields
    // of map.json, respectively.
    // The values 100 here are just set
    // so these fields are initialized to
    // something, rather than null.
    numXTiles: 100,
    numYTiles: 100,

    // The size of each individual map
    // tile, in pixels. This is in the
    // 'tilewidth' and 'tileheight' fields
    // of map.json, respectively.
    // The values 64 here are just set
    // so these fields are initialized to
    // something, rather than null.
    tileSize: {
        "x": 64,
        "y": 64
    },

    // The size of the entire map,
    // in pixels. This is calculated
    // based on the 'numXTiles', 'numYTiles',
    // and 'tileSize' parameters.
    // The values 64 here are just set
    // so these fields are initialized to
    // something, rather than null.
    pixelSize: {
        "x": 64,
        "y": 64
    },

    // Counter to keep track of how many tile
    // images we have successfully loaded.
    imgLoadCount: 0,

    // Boolean flag we set once our tile images
    // has finished loading.
    fullyLoaded: false,

    // Gives a default size for all of our
    // 'CanvasTiles' in pixels.
    canvasTileSize: {
        "x": 1024,
        "y": 1024
    },

    // An array to store all of our 'CanvasTile'
    // objects, so that we can cache them using
    // the preDrawCache method below.
    canvasTileArray: [],

    canvas_width: 0,
    canvas_height: 0,

    // ******************************************************************************************** load functions
    //-----------------------------------------
    // Load the json file at the url 'map' into
    // memory. This is similar to the requests
    // we've done in the past using
    // XMLHttpRequests.
    load: function (map, callbackFn, canvas_width, canvas_height) {

      gMap.canvas_width = canvas_width;
      gMap.canvas_height = canvas_height;

      xhrGet(map, function () {
          // Once the XMLHttpRequest loads, call the
          // parseMapJSON method.
          gMap.parseMapJSON(this.response, callbackFn);
      });
    },

    //-----------------------------------------
    // Parses the map data from 'mapJSON', then
    // stores that data in a number of members
    // of our 'TILEDMapClass' that are defined
    // above.
    parseMapJSON: function (mapJSON, callbackFn) {

      // Call JSON.parse on 'mapJSON' and store
      // the resulting map data
      gMap.currMapData = JSON.parse(mapJSON);

      var map = gMap.currMapData;

      // Set 'numXTiles' and 'numYTiles' from the
      // 'width' and 'height' fields of our parsed
      // map data.
      gMap.numXTiles = map.width;
      gMap.numYTiles = map.height;

      // Set the 'tileSize.x' and 'tileSize.y' fields
      // from the 'tilewidth' and 'tileheight' fields
      // of our parsed map data.
      gMap.tileSize.x = map.tilewidth;
      gMap.tileSize.y = map.tileheight;

      // Set the 'pixelSize.x' and 'pixelSize.y' fields
      // by multiplying the number of tiles in our map
      // by the size of each tile in pixels.
      gMap.pixelSize.x = gMap.numXTiles * gMap.tileSize.x;
      gMap.pixelSize.y = gMap.numYTiles * gMap.tileSize.y;

      // Loop through 'map.tilesets', an Array...
      for(var i = 0; i < map.tilesets.length; i++) {

        // ...loading each of the provided tilesets as
        // Images...
        var img = new Image();
        img.onload = function () {
          // ...Increment the above 'imgLoadCount'
          // field of 'TILEDMap' as each tileset is 
          // loading...
          gMap.imgLoadCount++;
          if (gMap.imgLoadCount === map.tilesets.length) {
              // ...Once all the tilesets are loaded, 
              // set the 'fullyLoaded' flag to true...
              gMap.fullyLoaded = true;

              callbackFn(); //let the game know we are done
          }
        };

        // This is the javascript object we'll create for
        // the 'tilesets' Array above. First, fill in the
        // given fields with the corresponding fields from
        // the 'tilesets' Array in 'currMapData'.
        var ts = {
          "firstgid": gMap.currMapData.tilesets[i].firstgid,

          "image": img,
          "imageheight": gMap.currMapData.tilesets[i].imageheight,
          "imagewidth": gMap.currMapData.tilesets[i].imagewidth,
          "name": gMap.currMapData.tilesets[i].name,


          // some TILED tilesets have the tiles divided by a margin in their source image
          // store the margin width here for adjustment later when getting the packet info

          "margin": gMap.currMapData.tilesets[i].margin,

          // calculate this data from the
          // width and height of the overall image and
          // the size of each individual tile.
          // 
          // This should be an integer

          "numXTiles": Math.floor(gMap.currMapData.tilesets[i].imagewidth / gMap.tileSize.x),
          "numYTiles": Math.floor(gMap.currMapData.tilesets[i].imageheight / gMap.tileSize.y)
        };

        // img.src = map.tilesets[i].image;
        // replace direct path with indirect location
        img.src = "images/" + map.tilesets[i].image.replace(/^.*[\\\/]/, '');

        gMap.tilesets.push(ts);
      }
    },

    //-----------------------------------------
    // Grabs a tile from our 'layer' data and returns
    // the 'pkt' object for the layer we want to draw.
    // It takes as a parameter 'tileIndex', which is
    // the id of the tile we'd like to draw in our
    // layer data.
    getTilePacket: function (tileIndex) {

      // We define a 'pkt' object that will contain
      // 
      // 1) The Image object of the given tile.
      // 2) The (x,y) values that we want to draw
      //    the tile to in map coordinates.
      var pkt = {
          "img": null,
          "px": 0,
          "py": 0
      };

      // The first thing we need to do is find the
      // appropriate tileset that we want to draw
      // from.
      //
      // Remember, if the tileset's 'firstgid'
      // parameter is less than the 'tileIndex'
      // of the tile we want to draw, then we know
      // that tile is not in the given tileset and
      // we can skip to the next one.
      var tile = 0;
      for(tile = gMap.tilesets.length - 1; tile >= 0; tile--) {
          if(gMap.tilesets[tile].firstgid <= tileIndex) break;
      }

      // Next, we need to set the 'img' parameter
      // in our 'pkt' object to the Image object
      // of the appropriate 'tileset' that we found
      // above.
      pkt.img = gMap.tilesets[tile].image;


      // Finally, we need to calculate the position to
      // draw to based on:
      //
      // 1) The local id of the tile, calculated from the
      //    'tileIndex' of the tile we want to draw and
      //    the 'firstgid' of the tileset we found earlier.

      var localIdx = tileIndex - gMap.tilesets[tile].firstgid;

      // 2) The (x,y) position of the tile in terms of the
      //    number of tiles in our tileset. This is based on
      //    the 'numXTiles' of the given tileset. Note that
      //    'numYTiles' isn't actually needed here. Think about
      //    how the tiles are arranged if you don't see this,
      //    It's a little tricky. You might want to use the 
      //    modulo and division operators here.

      var lTileX = Math.floor(localIdx % gMap.tilesets[tile].numXTiles);
      var lTileY = Math.floor(localIdx / gMap.tilesets[tile].numXTiles);

      // 3) the (x,y) pixel position in our tileset image of the
      //    tile we want to draw. This is based on the tile
      //    position we just calculated and the (x,y) size of
      //    each tile in pixels.
      pkt.px = (lTileX * gMap.tileSize.x);
      pkt.py = (lTileY * gMap.tileSize.y);


      // if the tileset comes with a margin, adjust the starting point accordingly
      if (gMap.tilesets[tile].margin) {
        var margin = gMap.tilesets[tile].margin;
        pkt.px += (lTileX * margin) + margin;
        pkt.py += (lTileY * margin) + margin;
      }

      return pkt;
    },

    // ******************************************************************************************** draw functions
    draw: function (ctx) {

      if(!gMap.fullyLoaded) return;

      // For each 'CanvasTile' in our 'canvasTileArray', we
      // need to test whether or not it is currently visible.
      // the 'isVisible' method of our canvas tile might be
      // useful here...
      //
      // If it is visible, then we need to draw the 'cvsHdl'
      // to our game canvas.
      //
      // One thing to keep in mind is that you'll need to
      // adjust the position to draw to based on the position
      // of our 'viewRect'.

      for(var q = 0; q < gMap.canvasTileArray.length; q++) {

          var r1 = gMap.canvasTileArray[q];

          if(r1.isVisible()) {
            // ctx.drawImage(r1.cvsHdl, r1.x - gMap.viewRect.x, r1.y - gMap.viewRect.y);
            ctx.drawImage(r1.cvsHdl, r1.x - gMap.viewRect.x, r1.y - gMap.viewRect.y);
          }
      }
    },

    //-----------------------------------------
    // Draws all of our map tiles to the 'canvasTileArray'
    // property of our 'TILEDMapClass' that we defined above.
    preDrawCache: function () {
      // First let's grab the total number of canvases (canvi? canvii?)
      // that we need to draw to fully tile our map, both across and
      // down.
      //
      // Be careful to make sure that at least 1 canvas is always drawn!
      var xCanvasCount = 1 + Math.floor(gMap.pixelSize.x / gMap.canvasTileSize.x);
      var yCanvasCount = 1 + Math.floor(gMap.pixelSize.y / gMap.canvasTileSize.y);

      // Now we'll need to create a new 'CanvasTile' for each of the
      // tile positions we calculated above, and initialize it with
      // the default size of our canvases as defined in our
      // 'canvasTileSize' property defined above.
      //
      // Finally, we'll need to push this new canvas to our
      // 'canvasTileArray'.
      for(var yC = 0; yC < yCanvasCount; yC++) {
          for(var xC = 0; xC < xCanvasCount; xC++) {
              var canvasTile = new CanvasTile();
              canvasTile.create(gMap.canvasTileSize.x, gMap.canvasTileSize.y);
              canvasTile.x = xC * gMap.canvasTileSize.x;
              canvasTile.y = yC * gMap.canvasTileSize.y;
              gMap.canvasTileArray.push(canvasTile);

              gMap.fillCanvasTile(canvasTile);
          }
      }

      gMap.fullyLoaded = true;
    },

    //-----------------------------------------
    // Draws all the relevant data to the passed-in
    // 'CanvasTile'. Note that this is very similar
    // to our 'draw' method above, but draws to the
    // context of the passed-in 'ctile'.
    fillCanvasTile: function (ctile) {
      // What we'd like to do is draw to Canvas context
      // of the passed-in 'ctile', rather than the
      // context of our game canvas.
      // We also need to create a new rectangle object
      // to use with intersectRect to test against
      // drawing below.
      // Create this here instead of within the for loop.
      var ctx = ctile.ctx;
      ctx.clearRect(0, 0, ctile.w, ctile.h);

      var vRect = {
          top: ctile.y,
          left: ctile.x,
          bottom: ctile.y + ctile.h,
          right: ctile.x + ctile.w
      };

      // Now, for every single layer in the 'layers' Array
      // of 'currMapData'...
      for(var layerIdx = 0; layerIdx < gMap.currMapData.layers.length; layerIdx++) {
        // Check if the 'type' of the layer is "tilelayer". If it isn't, we don't
        // care about drawing it...
        if(gMap.currMapData.layers[layerIdx].type != "tilelayer") continue;

        // don't draw borders layer, I use this to place entities
        if(gMap.currMapData.layers[layerIdx].name === "borders") continue;

        // ...Grab the 'data' Array of the given layer...
        var dat = gMap.currMapData.layers[layerIdx].data;

        // ...For each tileID in the 'data' Array...
        for(var tileIDX = 0; tileIDX < dat.length; tileIDX++) {
          // ...Check if that tileID is 0. Remember, we don't draw
          // draw those, so we can skip processing them...
          var tID = dat[tileIDX];
          if(tID === 0) continue;

          // ...If the tileID is not 0, then we grab the
          // packet data using getTilePacket.
          var tPKT = gMap.getTilePacket(tID);


          // Now we need to calculate the (x,y) position we want to draw
          // to in our game world.
          //
          // We've performed a similar calculation in 'getTilePacket',
          // think about how to calculate this based on the tile id and
          // various tile properties that our TILEDMapClass has.
          var worldX = Math.floor(tileIDX % gMap.numXTiles) * gMap.tileSize.x;
          var worldY = Math.floor(tileIDX / gMap.numXTiles) * gMap.tileSize.y;

          // We also need to test whether the world position we're drawing to
          // is within the bounds of our 'ctile'.
          //
          // Use the rectangle you created above and the 'intersectRect' method
          // to determine this. If it isn't visible, then don't continue with
          // drawing.
          var visible = gMap.intersectRect(vRect, {
              top: worldY,
              left: worldX,
              bottom: worldY + gMap.tileSize.y,
              right: worldX + gMap.tileSize.x
          });

          if(!visible) continue;

          ctx.drawImage(tPKT.img, tPKT.px, tPKT.py, this.tileSize.x, this.tileSize.y,
            worldX - vRect.left, worldY - vRect.top, this.tileSize.x, this.tileSize.y);
        }
      }
    },

    // ******************************************************************************************** createEntities

    createEntities: function() {
      var worldX = 0, worldY = 0, layerIdx = 0, tileIDX = 0, tID = 0, dat = [];

      for(layerIdx = 0; layerIdx < gMap.currMapData.layers.length; layerIdx++) {
        // I called the layer with entity information borders
        if(gMap.currMapData.layers[layerIdx].name === "borders") {

          // ...Grab the 'data' Array of the given layer...
          dat = gMap.currMapData.layers[layerIdx].data;

          for(tileIDX = 0; tileIDX < dat.length; tileIDX++) {

            tID = dat[tileIDX];

            worldX = Math.floor(tileIDX % gMap.numXTiles) * gMap.tileSize.x;
            worldY = Math.floor(tileIDX / gMap.numXTiles) * gMap.tileSize.y;

            // test all tiles for horizontal platform beginning and end
            gMap.buildHorizontalPlatform(tID, worldX, worldY);

            if (tID === 2) {
              gGameEngine.createGoal(worldX, worldY);

            } else if (tID === 3) {
              gGameEngine.createDynamicEnemy(worldX, worldY);

            } else if (tID === 4) {
              gPlayer.setup(worldX, worldY, 200, 200);

            } else if (tID === 5) {
              gGameEngine.createStaticEnemy(worldX, worldY);

            } else if (tID === 7) {
              alert('7');
              gGameEngine.createStaticRoundEnemy(worldX, worldY);

            } else if (tID === 6) {
              // collect all vertical platform tiles
              gMap.platformBuilder.vertical.push({ x: worldX, y: worldY});
            }

            // register linebreak
            if ((tileIDX+1) % gMap.numXTiles === 0) {
              gMap.buildHorizontalPlatform(-1);
            }
          }
        }
      }

      gMap.buildVerticalPlatforms();
    },

    buildHorizontalPlatform: function (tID, worldX, worldY) {

      var correctionValue = 6; // adjust position to graphics

      if (gMap.platformBuilder.newPlatform) {
        if (tID === 1) {
          gMap.platformBuilder.newPlatform = false;
          gMap.platformBuilder.size = 1;
          gMap.platformBuilder.start.x = worldX;
          gMap.platformBuilder.start.y = worldY;
        }
      } else {

        if (tID !== 1) {
          // we have hit the end of one platform
          gGameEngine.createPlatform(gMap.platformBuilder.start.x, gMap.platformBuilder.start.y + correctionValue,
                                     gMap.tileSize.x * gMap.platformBuilder.size, gMap.tileSize.y - (2*correctionValue));
          gMap.platformBuilder.newPlatform = true;

        } else {
          //growing platform
          gMap.platformBuilder.size += 1;
        }
      }
    },

    buildVerticalPlatforms: function() {
      var correctionValueY = 12,
          correctionValueX = 5; // adjust position to graphics

      // Bucket tiles by xCoord
      var vertical = gMap.platformBuilder.vertical;
      var xIndex_array = [],
          tiles_bucketed_by_xIndex = {};

      vertical.forEach( function(tile) {

        // Bucket the entities in the tiles list by their x coord
        if (xIndex_array.indexOf(tile.x) === -1) {
            xIndex_array.push(tile.x);
            tiles_bucketed_by_xIndex[tile.x] = [];
        }

        tiles_bucketed_by_xIndex[tile.x].push(tile);
      });

      xIndex_array.forEach( function(index) {

        // sort by y coordinate
        tiles_bucketed_by_xIndex[index].sort( function(a,b) {
          if (a.y === b.y) return 0;
          if (a.y < b.y) return -1;
          return 1;
        });

        var tiles = tiles_bucketed_by_xIndex[index];
        var len = tiles.length;
        gMap.platformBuilder.size = 1;
        gMap.platformBuilder.start.x = tiles[0].x;
        gMap.platformBuilder.start.y = tiles[0].y;

        for (var i = 1; i < len; i++) {

          // end of the array
          if (i+1 === len) {
            gMap.platformBuilder.size += 1;
            gGameEngine.createPlatform(gMap.platformBuilder.start.x  + correctionValueX, gMap.platformBuilder.start.y + correctionValueY,
                                       gMap.tileSize.x - (2*correctionValueX), gMap.tileSize.y  * gMap.platformBuilder.size);

          } else {

            // same x but is there a gap in the y?
            if (tiles[i].y !== tiles[i-1].y + gMap.tileSize.y) {

              gGameEngine.createPlatform(gMap.platformBuilder.start.x  + correctionValueX, gMap.platformBuilder.start.y + correctionValueY,
                                       gMap.tileSize.x - (2*correctionValueX), gMap.tileSize.y  * gMap.platformBuilder.size);
              gMap.platformBuilder.size = 1;
              gMap.platformBuilder.start.x = tiles[i].x;
              gMap.platformBuilder.start.y = tiles[i].y;

            } else {
              gMap.platformBuilder.size += 1;
            }
          }
        }
      });
    },

    // ******************************************************************************************** utils
    //-----------------------------------------
    // Test if two rectangles intersect. The parameters
    // are objects of the shape:
    // {
    //     top: The 'y' coordinate of the top edge
    //     left: The 'x' coordinate of the left edge
    //     bottom: The 'y' coordinate of the bottom edge
    //     right: The 'x' coordinate of the right edge
    // }
    intersectRect: function (r1, r2) {
      // returning true if they do intersect and false if they do not intersect.
      return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
    },

    //-----------------------------------------
    // Shifts the 'viewRect' object such that it's
    // center stays at the center of the canvas.
    centerAt: function(x, y) {

      gMap.viewRect.x = x - gMap.canvas_width/2;
      if (gMap.viewRect.x < 0) {
        gMap.viewRect.x = 0;
      } else if (gMap.viewRect.x + gMap.canvas_width > gMap.pixelSize.x) {
        gMap.viewRect.x = gMap.pixelSize.x - gMap.canvas_width;
      }

      gMap.viewRect.y = y - gMap.canvas_height/2;
      if (gMap.viewRect.y < 0) {
        gMap.viewRect.y = 0;
      } else if (gMap.viewRect.y + gMap.canvas_height > gMap.pixelSize.y) {
        gMap.viewRect.y = gMap.pixelSize.y - gMap.canvas_height;
      }
    }
  });

  window.gMap = new TILEDMapClass();
}).call(this);
