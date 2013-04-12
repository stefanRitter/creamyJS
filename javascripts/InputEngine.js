/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 *  
 *  InputEngingeClass based on Udacity game dev course: 
 *  https://www.udacity.com/course/cs255
 *
 *  shared under the Creative Commons CC BY-NC-SA license:
 *  http://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 */


(function() { "use strict";

  var InputEngineClass = Class.extend({

    // A dictionary mapping ASCII key codes to string values
    // describing the action we want to take when that key is
    // pressed.
    bindings: {},

    // A dictionary mapping actions that might be taken in our
    // game to a boolean value indicating whether that action
    // is currently being performed.
    actions: {},

    mouse: {
      x: 0,
      y: 0
    },

    //-----------------------------
    setup: function () {

      // bind keys to events
      gInputEngine.bind(32, 'jump'); // 87 = W, 32 = SPACE
      gInputEngine.bind(37, 'move-left'); // 65 = A, 37 = left arrow
      gInputEngine.bind(39, 'move-right'); // 68 = D, 39 = right arrow
      gInputEngine.bind(40, 'move-down');
      gInputEngine.bind(38, 'move-up');

      // Adding the event listeners for the appropriate DOM events.
      //document.getElementById('my_canvas').addEventListener('mousemove', gInputEngine.onMouseMove);
      document.addEventListener('keydown', gInputEngine.onKeyDown);
      document.addEventListener('keyup', gInputEngine.onKeyUp);
    },

    //-----------------------------
    onMouseMove: function (event) {
      gInputEngine.mouse.x = event.clientX;
      gInputEngine.mouse.y = event.clientY;
    },

    //-----------------------------
    onKeyDown: function (event) {
      // Grab the keyID property of the event object parameter,
      // then set the equivalent element in the 'actions' object
      // to true.
      // 
      // You'll need to use the bindings object you set in 'bind'
      // in order to do this.
      var action = gInputEngine.bindings[event.keyCode];


      if (action) {
        gInputEngine.actions[action] = true;
      }
    },

    //-----------------------------
    onKeyUp: function (event) {
      // Grab the keyID property of the event object parameter,
      // then set the equivalent element in the 'actions' object
      // to false.
      // 
      // You'll need to use the bindings object you set in 'bind'
      // in order to do this.
      var action = gInputEngine.bindings[event.keyCode];

      if (action) {
        gInputEngine.actions[action] = false;
      }
    },

    // The bind function takes an ASCII keycode
    // and a string representing the action to
    // take when that key is pressed.
    // 
    // Fill in the bind function so that it
    // sets the element at the 'key'th value
    // of the 'bindings' object to be the
    // provided 'action'.
    bind: function (key, action) {
      gInputEngine.bindings[key] = action;
    }

  });

  window.gInputEngine = new InputEngineClass();

}).call(this);
