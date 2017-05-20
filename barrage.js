(function f(global) {
  'use strict';

  var g = global;

  g.Barrage = global.Class.create({
    BASE_Z_INDEX: 3000,
    INTERVAL_MSEC: 32,

    text: null,

    elm: null,
    dim: null,
    height: null,
    width: null,
    scrollTop: null,
    seed: null,
    pid: null,

    initialize: function initialize(text) {
      this.text = text;
      this.height = (global.document.documentElement.clientHeight ||
          global.document.body.clientHeight);
      this.width = (global.document.documentElement.clientWidth ||
          global.document.body.clientWidth);
      this.scrollTop = (global.document.documentElement.scrollTop ||
          global.document.body.scrollTop);
      this.createElem();
      this.seed = this.getSeed();
    },

    start: function start() {
      this.pid = global.setInterval(this.move.bind(this), this.INTERVAL_MSEC);
    },

    getSeed: function getSeed() {
      return Math.floor(Math.random() * 100);
    },

    createElem: function createElem() {
      var color = null;
      var changePos = this.getSeed() % 6;
      var changeVal = this.getSeed() % 16;
      var fontSize = this.getSeed() + 8;
      var topPos = this.scrollTop + Math.floor(this.height * (this.getSeed() / 100));
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
          color = '#' + hexs[changeVal] + 'FFFF';
          break;
        case 1:
          color = '#FF' + hexs[changeVal] + 'FF';
          break;
        case 2:
          color = '#FFFF' + hexs[changeVal];
          break;
        case 3:
          color = '#' + hexs[changeVal] + hexs[changeVal] + 'FF';
          break;
        case 4:
          color = '#' + hexs[changeVal] + 'FF' + hexs[changeVal];
          break;
        case 5:
          color = '#FF' + hexs[changeVal] + hexs[changeVal];
          break;
        default:
          color = '#FFFFFF';
          break;
      }
      this.elm = new global.Element('span').setStyle({
        color: color,
        fontSize: fontSize + 'px',
        fontWeight: 'bolder',
        top: topPos + 'px',
        left: this.width + 'px',
        zIndex: this.BASE_Z_INDEX + this.getSeed() + 1,
        position: 'absolute',
        whiteSpace: 'nowrap'
      }).update(this.text);
      global.Element.insert(global.document.body, { top: this.elm });
      this.dim = this.elm.getDimensions();
      if (this.scrollTop + this.height < topPos + this.dim.height) {
        this.elm.setStyle({ top: ((this.scrollTop + this.height) - this.dim.height) + 'px' });
      }
    },

    move: function move() {
      var x = this.elm.getStyle('left').replace('px', '') - 0;
      if (x < -this.dim.width) {
        this.elm.remove();
        global.clearInterval(this.pid);
      }
      x -= (this.seed % 10) + 5;
      this.elm.setStyle({ left: x + 'px' });
    }
  });
}(window));
