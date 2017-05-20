(function f(global) {
  'use strict';

  var g = global;

  g.ModalWindow = global.Class.create({
    Z_INDEX_BASE: 1000,
    INTERVAL_MSEC: 32,
    ANIMATION_SPEED: 0.1,
    OPACITY_MAX: 0.7,

    timerId: null,
    back: null,
    opacity: null,
    selects: null,
    isAnimate: null,
    preExecute: null,
    postExecute: null,
    inner: null,

    initialize: function initialize(color, zIndex) {
      this.Z_INDEX_BASE = zIndex || 1000;
      this.back = new global.Element('div').setStyle({
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
      this.preExecute = global.Prototype.emptyFunction;
      this.postExecute = global.Prototype.emptyFunction;
    },

    ready: function ready() {
      this.setupEventListener();
      global.$(global.document.body).insert({ top: this.back });
    },

    setPreExecute: function setPreExecute(callback) {
      this.preExecute = callback;
    },

    setPostExecute: function setPostExecute(callback) {
      this.postExecute = callback;
    },

    setupEventListener: function setupEventListener() {
      var handler = this.hide.bindAsEventListener(this);
      this.back.observe('click', handler);
      global.Event.observe(global.document.body, 'keyup', handler);
      global.Event.observe(global, 'resize', this.setupBackSize.bindAsEventListener(this));
    },

    setInner: function setInner(elm) {
      this.inner = elm;
    },

    setInnerStyle: function setInnerStyle(elm) {
      var dim;
      if (elm) this.setInner(elm);
      dim = this.inner.getDimensions();
      this.inner.setStyle({
        position: 'absolute',
        zIndex: this.Z_INDEX_BASE + 1,
        top: (this.getScrollTop() + 30) + 'px',
        left: ((this.getClientWidth() / 2) - (dim.width / 2)) + 'px'
      });
    },

    show: function show() {
      if (this.isAnimate) {
        return;
      }
      this.isAnimate = true;
      this.hideSelectElement();
      this.setupBackSize();
      this.back.show();
      this.timerId = global.setInterval(this.appear.bind(this), this.INTERVAL_MSEC);
    },

    hide: function hide(e) {
      if (this.isAnimate || (e && e.type === 'keyup' && e.keyCode !== global.Event.KEY_ESC)) {
        return;
      }
      this.isAnimate = true;
      if (e) e.stop();
      this.postExecute();
      this.timerId = global.setInterval(this.fade.bind(this), this.INTERVAL_MSEC);
    },

    appear: function appear() {
      if (this.OPACITY_MAX <= this.opacity) {
        global.clearInterval(this.timerId);
        this.preExecute();
        this.isAnimate = false;
        return;
      }
      this.opacity += this.ANIMATION_SPEED;
      this.back.setOpacity(this.opacity);
    },

    fade: function fade() {
      if (this.opacity <= 0.0) {
        global.clearInterval(this.timerId);
        this.back.hide();
        this.showSelectElement();
        this.isAnimate = false;
        return;
      }
      this.opacity -= this.ANIMATION_SPEED;
      this.back.setOpacity(this.opacity);
    },

    setupBackSize: function setupBackSize() {
      var scrollHeight = this.getScrollHeight();
      var clientHeight = this.getClientHeight();
      var scrollWidth = this.getScrollWidth();
      var clientWidth = this.getClientWidth();
      var backHeight;
      var backWidth;
      var scrollTop;
      var scrollLeft;
      var innerHeight;
      var innerWidth;
      this.back.setStyle({
        height: (clientHeight < scrollHeight ? scrollHeight : clientHeight) + 'px',
        width: (clientWidth < scrollWidth ? scrollWidth : clientWidth) + 'px'
      });
      if (!this.inner) return;
      backHeight = this.back.getHeight();
      backWidth = this.back.getWidth();
      scrollTop = this.getScrollTop();
      scrollLeft = this.getScrollLeft();
      innerHeight = scrollTop + this.inner.getHeight();
      innerWidth = scrollLeft + this.inner.getWidth();
      this.back.setStyle({
        height: (backHeight < innerHeight ? innerHeight + 100 : backHeight) + 'px',
        width: (backWidth < innerWidth ? innerWidth + 100 : backWidth) + 'px'
      });
      this.setInnerStyle();
    },

    getScrollHeight: function getScrollHeight() {
      return global.document.documentElement.scrollHeight || global.document.body.scrollHeight;
    },

    getScrollWidth: function getScrollWidth() {
      return global.document.documentElement.scrollWidth || global.document.body.scrollWidth;
    },

    getClientHeight: function getClientHeight() {
      return global.document.viewport.getHeight();
    },

    getClientWidth: function getClientWidth() {
      return global.document.viewport.getWidth();
    },

    getScrollTop: function getScrollTop() {
      return global.document.viewport.getScrollOffsets().last();
    },

    getScrollLeft: function getScrollLeft() {
      return global.document.viewport.getScrollOffsets().first();
    },

    hideSelectElement: function hideSelectElement() {
      this.toggleSelectElement('hidden');
    },

    showSelectElement: function showSelectElement() {
      this.toggleSelectElement('visible');
    },

    toggleSelectElement: function toggleSelectElement(value) {
      if (!global.Prototype.Browser.IE || global.navigator.userAgent.indexOf('MSIE 6.0') === -1) {
        return;
      }
      if (!this.selects) {
        this.selects = global.$$('select');
      }
      this.selects.each(function fs(x) { x.setStyle({ visibility: value }); });
    }
  });
}(window));
