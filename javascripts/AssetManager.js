/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 *  
 *  AssetManager based on Udacity game dev course: 
 *  https://www.udacity.com/course/cs255
 *
 *  shared under the Creative Commons CC BY-NC-SA license:
 *  http://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 */
 
/*jshint loopfunc: true */

var gCachedAssets = {};

function loadImage(assetName, callbackFcn) {
  // TASK #1
  // Check if the given assetName exists in the cache
  // gCachedAssets. If it doesn't, use the code below
  // to load the new image.

  if (!gCachedAssets[assetName]) {
    // TASK #2
    // Add the new asset to the cache. Remember, each
    // entry in the cache should be of the form:
    // {assetName: assetObject}

    var img = new Image();
    img.onload = function () {
      gCachedAssets[assetName] = img;
      callbackFcn(img);
    };
    img.src = assetName;

  } else {
    // TASK #3
    // If assetName already exists in the cache, that
    // means the asset has already been loaded. In this
    // case, just call callbackFcn on the cached Image
    // object.
    callbackFcn(gCachedAssets[assetName]);
  }
}

// We need to update our loadAsset function to handle
// Javascript assets as well, dynamically loading them
// into the DOM.
//
// In order to determine what type of asset we're
// dealing with, we've provided a function for determing
// what the asset type is from the file extension.
//
// We'll need to create a new script element in the DOM
// for each javascript file, then set the type attribute
// of that element to 'text/javascript' and the src
// attribute to the filename.
//
// Finally, we need to attach this script tag to the
// document, at which point it will be loaded by the
// browser.

function loadAssets(assetList, callbackFcn) {
  // All the information we need to keep track of
  // for this batch.
  var loadBatch = {
    count: 0,
    total: assetList.length,
    cb: callbackFcn
  };

  for(var i = 0; i < assetList.length; i++) {

    if(!gCachedAssets[assetList[i]]) {
      var assetType = getAssetTypeFromExtension(assetList[i]);

      if(assetType === 0) { // Asset is an image
        var img = new Image();
        img.onload = function () { onLoadedCallback(img, loadBatch); };
        img.src = assetList[i];
        gCachedAssets[assetList[i]] = img;

      } else if(assetType === 1) { // Asset is Javascript
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.onload = function (e){ onLoadedCallback(fileref,loadBatch); };
        fileref.setAttribute("src", assetList[i]);
        document.getElementsByTagName("head")[0].appendChild(fileref);
        gCachedAssets[assetList[i]] = fileref;

      } else if(assetType === 2) { // Asset is JSON
        var name = assetList[i]; // get name for callback closure
        xhrGet(assetList[i], function() {
          gCachedAssets[name] = this.responseText;
          onLoadedCallback(name,loadBatch);
        });
      }

    } else { // Asset is already loaded
      onLoadedCallback(gCachedAssets[assetList[i]], loadBatch);
    }
  }
}

function onLoadedCallback(asset, batch) {
  // If the entire batch has been loaded,
  // call the callback.
  batch.count++;
  if(batch.count == batch.total) {
    batch.cb(asset);
  }
}

// We've provided you a handy function for determining the
// asset type from the file extension.
// Images return 0, javascript returns 1, and everything
// else returns -1.
function getAssetTypeFromExtension(fname) {

  if (fname.indexOf('.jpg') != -1 || fname.indexOf('.jpeg') != -1 || fname.indexOf('.png') != -1 || fname.indexOf('.gif') != -1 || fname.indexOf('.wp') != -1) {
    // It's an image!
    return 0;
  }

  if (fname.indexOf('.json') != -1) {
    // It's JSON!
    return 2;
  }

  if (fname.indexOf('.js') != -1) {
    // It's javascript!
    return 1;
  }

  // Uh Oh
  return -1;
}
