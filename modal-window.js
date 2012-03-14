/**
 *
 * @class ModalWindow
 */
var ModalWindow = Class.create({

    /**
     *
     * @type {number}
     */
    Z_INDEX_BASE: 1000,

    /**
     *
     * @type {number}
     */
    INTERVAL_MSEC: 32,

    /**
     *
     * @type {number}
     */
    ANIMATION_SPEED: 0.1,

    /**
     *
     * @type {number}
     */
    OPACITY_MAX: 0.7,

    /**
     *
     * @type {number}
     */
    timerId: null,

    /**
     *
     * @type {Element}
     */
    back: null,

    /**
     *
     * @type {number}
     */
    opacity: null,

    /**
     *
     * @type {Array.<Element>}
     */
    selects: null,

    /**
     *
     * @type {boolean}
     */
    isAnimate: null,

    /**
     *
     * @type {Function}
     */
    preExecute: null,

    /**
     *
     * @type {Function}
     */
    postExecute: null,

    /**
     *
     * @type {Element}
     */
    inner: null,

    /**
     *
     * @param {string} color
     * @param {number} zIndex
     * @constructor
     * @protected
     */
    initialize: function (color, zIndex) {
        this.Z_INDEX_BASE = zIndex || 1000;
        this.back = new Element('div').setStyle({
            display: 'none',
            position: 'absolute',
            zIndex: this.Z_INDEX_BASE,
            backgroundColor: color || '#333333',
            top: '0px',
            left: '0px'
        });
        this.opacity = 0.0;
        this.back.setOpacity(this.opacity);
        this.isAnimate = false;
        this.preExecute = Prototype.emptyFunction;
        this.postExecute = Prototype.emptyFunction;
        this.setupEventListener();
        $(document.body).insert({ top: this.back });
    },

    /**
     *
     * @param {Function} callback
     * @public
     */
    setPreExecute: function (callback) {
        this.preExecute = callback;
    },

    /**
     *
     * @param {Function} callback
     * @public
     */
    setPostExecute: function (callback) {
        this.postExecute = callback;
    },

    /**
     *
     * @param {Element} elm
     * @public
     */
    setInner: function(elm) {
        this.inner = elm;
    },

    /**
     *
     * @param {Element} elm
     * @public
     */
    setInnerStyle: function (elm) {
        if (elm) this.setInner(elm);
        var dim = this.inner.getDimensions();
        this.inner.setStyle({
            position: 'absolute',
            zIndex: this.Z_INDEX_BASE + 1,
            top: this.getScrollTop() + 30 + 'px',
            left: this.getClientWidth() / 2 - dim.width / 2 + 'px'
        });
    },

    /**
     *
     * @public
     */
    show: function () {
        if (this.isAnimate) {
            return;
        }
        this.isAnimate = true;
        this.hideSelectElement();
        this.setupBackSize();
        this.back.show();
        this.timerId = window.setInterval(this.appear.bind(this), this.INTERVAL_MSEC);
    },

    /**
     *
     * @param {Event} e
     * @public
     */
    hide: function (e) {
        if (this.isAnimate || (e && e.type == 'keyup' && e.keyCode != Event.KEY_ESC)) {
            return;
        }
        this.isAnimate = true;
        if (e) e.stop();
        this.postExecute();
        this.timerId = window.setInterval(this.fade.bind(this), this.INTERVAL_MSEC);
    },

    /**
     *
     * @private
     */
    setupEventListener: function () {
        var handler = this.hide.bindAsEventListener(this);
        this.back.observe('click', handler);
        Event.observe(document.body, 'keyup', handler);
        Event.observe(window, 'resize', this.setupBackSize.bindAsEventListener(this));
    },

    /**
     *
     * @private
     */
    appear: function () {
        if (this.OPACITY_MAX <= this.opacity) {
            window.clearInterval(this.timerId);
            this.preExecute();
            this.isAnimate = false;
            return;
        }
        this.opacity += this.ANIMATION_SPEED;
        this.back.setOpacity(this.opacity);
    },


    /**
     *
     * @private
     */
    fade: function () {
        if (this.opacity <= 0.0) {
            window.clearInterval(this.timerId);
            this.back.hide();
            this.showSelectElement();
            this.isAnimate = false;
            return;
        }
        this.opacity -= this.ANIMATION_SPEED;
        this.back.setOpacity(this.opacity);
    },

    /**
     *
     * @param {Event} e
     * @private
     */
    setupBackSize: function (e) {
        var scrollHeight = this.getScrollHeight();
        var clientHeight = this.getClientHeight();
        var scrollWidth = this.getScrollWidth();
        var clientWidth = this.getClientWidth();
        this.back.setStyle({
            height: (clientHeight < scrollHeight ? scrollHeight : clientHeight) + 'px',
            width: (clientWidth < scrollWidth ? scrollWidth : clientWidth) + 'px'
        });
        if (!this.inner) return;
        var backHeight = this.back.getHeight();
        var backWidth = this.back.getWidth();
        var scrollTop = this.getScrollTop();
        var scrollLeft = this.getScrollLeft();
        var innerHeight = scrollTop + this.inner.getHeight();
        var innerWidth = scrollLeft + this.inner.getWidth();
        this.back.setStyle({
            height: (backHeight < innerHeight ? innerHeight + 100 : backHeight) + 'px',
            width: (backWidth < innerWidth ? innerWidth + 100 : backWidth) + 'px'
        });
        this.setInnerStyle();
    },

    /**
     *
     * @private
     * @return {number}
     */
    getScrollHeight: function () {
        return document.documentElement.scrollHeight || document.body.scrollHeight;
    },

    /**
     *
     * @private
     * @return {number}
     */
    getScrollWidth: function () {
        return document.documentElement.scrollWidth || document.body.scrollWidth;
    },

    /**
     *
     * @private
     * @return {number}
     */
    getClientHeight: function () {
        return document.viewport.getHeight();
    },

    /**
     *
     * @private
     * @return {number}
     */
    getClientWidth: function () {
        return document.viewport.getWidth();
    },

    /**
     *
     * @private
     * @return {number}
     */
    getScrollTop: function () {
        return document.viewport.getScrollOffsets().last();
    },

    /**
     *
     * @private
     * @return {number}
     */
    getScrollLeft: function () {
        return document.viewport.getScrollOffsets().first();
    },

    /**
     *
     * @private
     */
    hideSelectElement: function () {
        this.toggleSelectElement('hidden');
    },

    /**
     *
     * @private
     */
    showSelectElement: function () {
        this.toggleSelectElement('visible');
    },

    /**
     *
     * @param {string} value
     * @private
     */
    toggleSelectElement: function (value) {
        if (!Prototype.Browser.IE || window.navigator.userAgent.indexOf('MSIE 6.0') === -1) {
            return;
        }
        if (!this.selects) {
            this.selects = $$('select');
        }
        this.selects.each(function (x) { x.setStyle({ visibility: value }); });
    }
});