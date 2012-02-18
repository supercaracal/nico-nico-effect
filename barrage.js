/**
 *
 * @class Barrage
 */
var Barrage = Class.create({

    /**
     *
     * @type {number}
     */
    BASE_Z_INDEX: 3000,

    /**
     *
     * @type {number}
     */
    INTERVAL_MSEC: 32,

    /**
     *
     * @type {string}
     */
    text: null,

    /**
     *
     * @type {Element}
     */
    elm: null,

    /**
     *
     * @type {Object}
     */
    dim: null,

    /**
     *
     * @type {number}
     */
    height: null,

    /**
     *
     * @type {number}
     */
    width: null,

    /**
     *
     * @type {number}
     */
    scrollTop: null,

    /**
     *
     * @type {number}
     */
    seed: null,

    /**
     *
     * @type {number}
     */
    pid: null,

    /**
     *
     * @param {string} text
     * @protected
     * @constructor
     */
    initialize: function (text) {
        this.text = text;
        this.height = (document.documentElement.clientHeight || document.body.clientHeight);
        this.width = (document.documentElement.clientWidth || document.body.clientWidth);
        this.scrollTop = (document.documentElement.scrollTop || document.body.scrollTop);
        this.createElem();
        this.seed = this.getSeed();
        this.pid = window.setInterval(this.move.bind(this), this.INTERVAL_MSEC);
    },

    /**
     *
     * @return {number}
     * @private
     */
    getSeed: function () {
        return Math.floor(Math.random() * 100);
    },

    /**
     *
     * @private
     */
    createElem: function () {
        var color = null;
        var changePos = this.getSeed() % 6;
        var changeVal = this.getSeed() % 16;
        var hexs = {
             0: '0F',
             1: '1F',
             2: '2F',
             3: '3F',
             4: '4F',
             5: '5F',
             6: '6F',
             7: '7F',
             8: '8F',
             9: '9F',
            10: 'AF',
            11: 'BF',
            12: 'CF',
            13: 'DF',
            14: 'EF',
            15: 'FF'
        };
        switch (changePos) {
            case 0:
                color = '#' + hexs[changeVal] + 'FF' + 'FF';
                break;
            case 1:
                color = '#' + 'FF' + hexs[changeVal] + 'FF';
                break;
            case 2:
                color = '#' + 'FF' + 'FF' + hexs[changeVal];
                break;
            case 3:
                color = '#' + hexs[changeVal] + hexs[changeVal] + 'FF';
                break;
            case 4:
                color = '#' + hexs[changeVal] + 'FF' + hexs[changeVal];
                break;
            case 5:
                color = '#' + 'FF' + hexs[changeVal] + hexs[changeVal];
                break;
            default:
                color = '#FFFFFF';
                break;
        }
        var fontSize = this.getSeed() + 8;
        var topPos = this.scrollTop + Math.floor(this.height * (this.getSeed() / 100));
        this.elm = new Element('span').setStyle({
            color: color,
            fontSize: fontSize + 'px',
            fontWeight: 'bolder',
            top: topPos + 'px',
            left: this.width + 'px',
            zIndex: this.BASE_Z_INDEX + this.getSeed() + 1,
            position: 'absolute',
            whiteSpace: 'nowrap'
        }).update(this.text);
        Element.insert(document.body, { top: this.elm });
        this.dim = this.elm.getDimensions();
        if (this.scrollTop + this.height < topPos + this.dim.height) {
            this.elm.setStyle({top: this.scrollTop + this.height - this.dim.height + 'px'});
        }
    },

    /**
     *
     * @private
     */
    move: function () {
        var x = this.elm.getStyle('left').replace('px', '') - 0;
        if (x < -this.dim.width) {
            this.elm.remove();
            window.clearInterval(this.pid);
        }
        x -= this.seed % 10 + 5;
        this.elm.setStyle({ left: x + 'px' });
    }
});
