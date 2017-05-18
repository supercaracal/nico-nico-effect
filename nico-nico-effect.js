(function f(global) {
  'use strict';

  var g = global;

  g.NicoNicoEffect = global.Class.create({
    COMMENTS: [
      'キタ――（゜∀゜）――！！',
      'キタ━ヽ（ ゜∀゜）ノ┌┛）｀Д゜）・；’━！！',
      'ｷﾀ - .∵･(ﾟ∀ﾟ)･∵. - ｯ!!',
      'キタ━（゜∀゜）━！',
      'ｷﾀ━━━(Дﾟ(○=(ﾟ∀ﾟ)=○)Дﾟ)━━━!!',
      'ｷﾀ─￣─_─￣─(ﾟ∀ﾟ)─￣─_─￣─!!!!',
      'ｷﾀ*･゜ﾟ･*:.｡..｡.:*･゜(ﾟ∀ﾟ)ﾟ･*:.｡. .｡.:*･゜ﾟ･*!!!!',
      'キタ━（゜∀゜）━┥東│東│東│　 │　 │　 │発│発│発│中│中│中│北┝┥北┝━（゜∀゜）━！！！！)',
      'ｷﾀ─ｗｗﾍ√ﾚｖｖ～(ﾟ∀ﾟ)─ｗｗﾍ√ﾚｖｖ～─!!)',
      'JR━―━―━(ﾟ∀ﾟ)━―━―━―!!',
      'キタ━━━（゜∀゜）━（ ゜∀）━（ 　゜）━（　　）━（　　）━（゜ 　）━（∀゜ ）━（゜∀゜）━━━！！',
      'キタキタキタキタ━━━（゜∀゜≡（゜∀゜≡゜∀゜）≡゜∀゜）━━━━！！',
      'ｷﾀ━━(ﾟ∀ﾟ)⌒Ｙ⌒(｡Ａ｡)⌒Ｙ⌒(ﾟ∀ﾟ)⌒Ｙ⌒(｡Ａ｡)⌒Ｙ⌒(ﾟ∀ﾟ)━━!!',
      'キタ━━━ヽ（∀゜ ）人（゜∀゜）人（ ゜∀）ノ━━━！！)',
      'ｷﾀ━━━━━━━━m9( ﾟ∀ﾟ)━━━━━━━━!!',
      'キタ━━━━（゜∀゜）━━━━！！'
    ],

    triggerElement: null,
    superBall: null,
    magazine: null,
    magazineCount: null,
    magazineCounter: null,
    textField: null,
    submitButton: null,
    form: null,
    timerIds: null,
    modalWindow: null,

    initialize: function initialize() {
      this.triggerElement = this.createTriggerElement();
      Element.insert(global.document.body, this.triggerElement);
      this.superBall = new global.Superball(this.triggerElement);
      this.superBall.ready();

      this.magazine = this.createMagazine();
      this.magazineCount = this.COMMENTS.length;
      this.magazineCounter = this.createMagazineCounter(this.magazineCount);
      this.magazine.insert(this.magazineCounter).insert('&nbsp;/&nbsp;' + this.magazineCount);

      this.textField = this.createTextField();
      this.submitButton = this.createSubmitButton();
      this.form = this.createForm();
      this.form.insert(this.textField).insert(this.submitButton);
      this.form.observe('submit', (function fs(e) {
        e.stop();
        if (this.textField.value) {
          new global.Barrage(this.textField.value).start();
        }
      }).bind(this));

      this.timerIds = [];
      this.modalWindow = new global.ModalWindow();
      this.modalWindow.setPreExecute(this.afterModalShow.bind(this));
      this.modalWindow.setPostExecute(this.beforeModalHide.bind(this));
      this.modalWindow.ready();

      Event.observe(this.triggerElement, 'dblclick', this.modalWindow.show.bindAsEventListener(this.modalWindow));
    },

    createTriggerElement: function createTriggerElement() {
      var e = new Element('span');
      var maxWidth = (global.document.documentElement.clientWidth ||
        global.document.body.clientWidth) - 270 - 30;
      e.setStyle({
        fontSize: 'xx-large',
        fontWeight: 'bolder',
        top: '-50px',
        left: maxWidth + 'px',
        zIndex: 500,
        position: 'absolute',
        cursor: 'move'
      });
      e.update('僕は友達が少ない');
      return e;
    },

    createMagazine: function createMagazine() {
      var e = new Element('div');
      e.setStyle({
        zIndex: 2000,
        borderRadius: '10px',
        boxShadow: '0px 0px 30px #EFEFEF',
        padding: '7px',
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: '#EFEFEF'
      });
      e.update('Magazine:&nbsp');
      return e;
    },

    createMagazineCounter: function createMagazineCounter(count) {
      return new Element('span').update(count).setStyle({ fontWeight: 800, fontSize: '20px', color: '#FF3333' });
    },

    createTextField: function createTextField() {
      return new Element('input', { type: 'text', value: '' }).setStyle({ width: '400px' });
    },

    createSubmitButton: function createSubmitButton() {
      return new Element('input', { type: 'submit', value: 'コメント' });
    },

    createForm: function createForm() {
      return new Element('form', { action: '#', method: 'post' }).setStyle({
        zIndex: 2000,
        borderRadius: '10px',
        boxShadow: '0px 0px 30px #FFFFFF',
        padding: '7px',
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: '#EFEFEF'
      });
    },

    afterModalShow: function afterModalShow() {
      var wait = 0;
      var count = 0;
      Element.insert(global.document.body, { top: this.magazine });
      Element.insert(global.document.body, { top: this.form });
      this.textField.activate();
      this.COMMENTS.each((function fb(x) {
        if (count > 10) {
          wait += 20;
          count = 0;
        }
        this.timerIds.push((function fm() {
          this.magazineCount -= 1;
          new global.Barrage(x).start();
          this.magazineCounter.update(this.magazineCount);
        }).bind(this).delay(wait));
        count += 1;
      }).bind(this));
    },

    beforeModalHide: function beforeModalHide() {
      this.timerIds.each(function fc(x) { window.clearTimeout(x); });
      this.magazine.remove();
      this.form.remove();
      this.magazineCount = this.COMMENTS.length;
      this.magazineCounter.update(this.magazineCount);
    }
  });
}(window));
