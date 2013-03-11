/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 * 
 *
 */

(function(self) { "use strict";

	// ******************************************************************************* globals

	var loading;

	// ******************************************************************************* Utils

  function isTouchDevice() {
    return ("ontouchstart" in window) || navigator.msMaxTouchPoints;
  }

  //AJAX
	function xhrGet(reqUri, callback, type) {

		var caller = xhrGet.caller, xhr = new XMLHttpRequest();

		xhr.open('GET', reqUri, true);
		if (type) { xhr.responseType = type; }

		xhr.onload = function () {
			if (callback) {
				try {
					callback(xhr);
				} catch (error) {
					throw 'xhrGet failed: \n' + reqUri + '\nException: ' + error + '\nCaller: ' + caller + 
					'\nResponse: ' + xhr.responseText;
				}
			}
		};

		xhr.send();
	}

  //async script loading
	function loadScript(src, callback)
	{
	  var script, rState;
	  rState = false;
	  script = document.createElement('script');
	  script.type = 'text/javascript';
	  script.src = src;
	  script.onload = script.onreadystatechange = function() {
	    //console.log( this.readyState );
	    if ( !rState && (!this.readyState || this.readyState === 'complete') )
	    {
	      rState = true;
	      callback();
	    }
	  };
	  document.body.appendChild(script);
    return script;
	}

  function createImage(event) {
    window.open(canvas.toDataUrl(), 'screen shot');
  }

	// ******************************************************************************* window.onload
	window.onload = function () {

		// set global
		loading = document.getElementById('loading');

		loading.style.visibility = 'visible';

	};
}(this));