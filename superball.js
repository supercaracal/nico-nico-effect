/**
 *
 * @class Superball
 */
var Superball = Class.create({

    /**
     *
     * @type {number}
     */
    DELAY_SEC: 0.3,

    /**
     *
     * @type {number}
     */
    INTERVAL_MSEC: 16,

    /**
     *
     * @type {Element}
     */
    elm: null,

    /**
     *
     * @type {Draggable}
     */
    dd: null,

    /**
     *
     * @param {Element} elem
     * @param {number} delay
     * @protected
     * @constructor
     */
    initialize: function (elem, delay) {
        this.elm = elem;
        if (delay == undefined) {
            delay = this.DELAY_SEC;
        }
        var self = this;
        this.dd = new Draggable(this.elm, {
            onEnd: function (d) {
                self.fall.bind(self).delay(self.DELAY_SEC);
            }
        });
        this.fall.bind(this).delay(delay);
    },

    /**
     *
     * @private
     */
    fall: function () {
        var dim = this.elm.getDimensions();
        var max = (document.documentElement.clientHeight || document.body.clientHeight) - dim.height - 30;
        var self = this;
        var isDown = true;
        var inc = 1;
        var wait = 0;
        var lastInc = null;
        var pid = window.setInterval(function () {
            if (wait > 0) {
                --wait;
                return;
            }
            if ((!isDown && (inc <= 1))) {
                inc = 1;
                wait = 2;
                isDown = true;
                return;
            }
            var pos = self.elm.getStyle('top').replace('px', '') - 0;
            if ((pos + inc + 1) >= max) {
                isDown = false;
                inc = Math.round(inc * 0.7);
            }
            if (isDown) {
                pos += ++inc;
            } else {
                pos -= --inc;
                if (lastInc === inc) {
                    window.clearInterval(pid);
                }
                lastInc = inc;
            }
            self.elm.setStyle({ top: pos + 'px' });
        }, this.INTERVAL_MSEC);
    }
});
