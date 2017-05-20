(function f(global) {
  'use strict';

  var g = global;

  g.Superball = global.Class.create({
    DELAY_SEC: 0.3,
    INTERVAL_MSEC: 16,

    elm: null,
    dd: null,

    initialize: function initialize(elem) {
      this.elm = elem;
    },

    ready: function ready() {
      this.dd = new global.Draggable(this.elm, {
        onEnd: (function onEnd() {
          this.fall.bind(this).delay(this.DELAY_SEC);
        }).bind(this)
      });
      this.fall.bind(this).delay(this.DELAY_SEC);
    },

    fall: function fall() {
      var dim = this.elm.getDimensions();
      var max = (global.document.documentElement.clientHeight ||
          global.document.body.clientHeight) - dim.height - 30;
      var self = this;
      var isDown = true;
      var inc = 1;
      var wait = 0;
      var lastInc = null;
      var pos;
      var pid = global.setInterval(function fr() {
        if (wait > 0) {
          wait -= 1;
          return;
        }
        if ((!isDown && (inc <= 1))) {
          inc = 1;
          wait = 2;
          isDown = true;
          return;
        }
        pos = self.elm.getStyle('top').replace('px', '') - 0;
        if ((pos + inc + 1) >= max) {
          isDown = false;
          inc = Math.round(inc * 0.7);
        }
        if (isDown) {
          inc += 1;
          pos += inc;
        } else {
          inc -= 1;
          pos -= inc;
          if (lastInc === inc) {
            global.clearInterval(pid);
          }
          lastInc = inc;
        }
        self.elm.setStyle({ top: pos + 'px' });
      }, this.INTERVAL_MSEC);
    }
  });
}(window));
