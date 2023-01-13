(() => {
    'use-strict';

    const Fs = require('fs');
    const Path = require('path');
    const PackageUtil = require('../../../eazax/package-util');

    /** package name */
    const PACKAGE_NAME = PackageUtil.name;
    const PACKAGE_PATH = Editor.url(`packages://${PACKAGE_NAME}`);

    Editor.UI.registerElement('ui-preview-sprite', {
        get value() {
            return this._value;
        },
        set value(t) {
            this._value !== t && ((this._value = t), this._update());
        },
        get type() {
            return this._type;
        },
        set type(t) {
            let e = Editor.assettype2name[t];
            e || (e = t), this._type !== e && ((this._type = e), this._update());
        },
        get highlighted() {
            return this.getAttribute('highlighted') !== null;
        },
        set highlighted(t) {
            t ? this.setAttribute('highlighted', '') : this.removeAttribute('highlighted');
        },
        get invalid() {
            return this.getAttribute('invalid') !== null;
        },
        set invalid(t) {
            t ? this.setAttribute('invalid', '') : this.removeAttribute('invalid');
        },
        get multiValues() {
            return this._multiValues;
        },
        set multiValues(t) {
            (t = !(t == null || !1 === t)),
                (this._multiValues = t),
                this._update(),
                t ? this.setAttribute('multi-values', '') : this.removeAttribute('multi-values');
        },
        attributeChangedCallback(t, e, i) {
            if (t == 'multi-values') {
                this[
                    t.replace(/\-(\w)/g, function (t, e) {
                        return e.toUpperCase();
                    })
                ] = i;
            }
        },
        behaviors: [
            Editor.UI.Focusable,
            Editor.UI.Disable,
            Editor.UI.Readonly,
            Editor.UI.Droppable,
            Editor.UI.ButtonState,
        ],
        template: Fs.readFileSync(
            Path.join(PACKAGE_PATH, 'src/renderer/inspector/elements/ui-preview-sprite.html'),
            'utf-8',
        ),
        style: Fs.readFileSync(
            Path.join(PACKAGE_PATH, 'src/renderer/inspector/elements/ui-preview-sprite.css'),
            'utf-8',
        ),
        $: {
            typeName: '.type-name',
            name: '.name',
            input: '.input',
            browse: '.browse',
            close: '.close',
            uuid: '.uuid',
            assetIcon: '.asset-icon',
            iconBox: '.icon-box',
        },
        ready() {
            (this.droppable = 'asset'),
                (this.multi = !1),
                this._initFocusable([this.$name, this.$close]),
                this._initDroppable(this),
                this._initDisable(!1),
                this._initReadonly(!1),
                this._initButtonState(this.$name),
                this._initButtonState(this.$close),
                this._initButtonState(this.$browse),
                Editor.UI.installDownUpEvent(this.$close),
                (this._dummy = this.getAttribute('dummy') !== null),
                (this._name = this.getAttribute('name')),
                this._name === null && (this._name = 'None'),
                (this._type = this.getAttribute('type') || 'asset');

            const t = Editor.assettype2name[this._type];
            t && (this._type = t),
                (this._value = this.getAttribute('value')),
                (this.multiValues = this.getAttribute('multi-values')),
                (this._defaultIcon = Editor.url(
                    'packages://inspector/static/checkerboard-32x32.png',
                )),
                (this._T = Editor),
                this._initEvents(),
                this._update();
        },
        _initEvents() {
            this.addEventListener('mousedown', t => {
                Editor.UI.acceptEvent(t), Editor.UI.focus(this);
            }),
                this.addEventListener('drop-area-enter', this._onDropAreaEnter.bind(this)),
                this.addEventListener('drop-area-leave', this._onDropAreaLeave.bind(this)),
                this.addEventListener('drop-area-accept', this._onDropAreaAccept.bind(this)),
                this.addEventListener('drop-area-move', this._onDropAreaMove.bind(this));
        },
        _update() {
            return this._dummy
                ? ((this.$typeName.textContent = this._type),
                  (this.$name.textContent = this._name),
                  (this._needUpdated = !1),
                  void 0)
                : this._multiValues
                ? (this.setAttribute('empty', ''),
                  (this.$name.textContent = 'Difference'),
                  (this._needUpdated = !1),
                  void 0)
                : this.value
                ? (this.removeAttribute('empty'),
                  (this._needUpdated = !0),
                  Editor.assetdb.queryMetaInfoByUuid(this.value, (t, e) => {
                      if (!this._needUpdated) return;

                      const i = require('fire-url');
                      if (!e)
                          return (
                              this.setAttribute('missing', ''),
                              (this._name = 'Missing Reference...'),
                              (this.$typeName.textContent = this._type),
                              (this.$name.textContent = this._name),
                              (this.$uuid.textContent = ''),
                              void 0
                          );

                      (this._name = i.basenameNoExt(e.assetUrl)),
                          this.removeAttribute('missing'),
                          (this.$typeName.textContent = this._type),
                          (this.$name.textContent = this._name),
                          (this.$uuid.textContent = this._value),
                          this._loadImage(e);
                  }),
                  void 0)
                : ((this._name = 'None'),
                  this.setAttribute('empty', ''),
                  (this.$typeName.textContent = this._type),
                  (this.$name.textContent = this._name),
                  (this.$uuid.textContent = ''),
                  (this._needUpdated = !1),
                  void 0);
        },
        _loadImage(t) {
            const img = JSON.parse(t.json);
            img &&
                ((this._image = new Image()),
                (this._image.src = `uuid://${img.rawTextureUuid}?${t.assetMtime}`)),
                this._image.addEventListener('load', () => {
                    this._updateImage(img);
                });
        },
        _updateImage(img) {
            this._resize(img);
        },
        _resize(img) {
            const iconBoxRect = this.$iconBox.getBoundingClientRect();
            const imgSize = this._getSize(img);
            const i = Editor.Utils.fitSize(
                imgSize.width,
                imgSize.height,
                iconBoxRect.width,
                iconBoxRect.height,
            );
            img.rotated &&
                (this._scalingSize = { width: Math.ceil(i[1]), height: Math.ceil(i[0]) }),
                (this.$assetIcon.width = Math.ceil(i[0])),
                (this.$assetIcon.height = Math.ceil(i[1])),
                this._repaint(img);
        },
        _getSize(img) {
            let w = 0;
            let h = 0;

            return (
                img.importer === 'sprite-frame' && ((w = img.width), (h = img.height)),
                {
                    width: w,
                    height: h,
                }
            );
        },
        _repaint(img) {
            if (!img || !this._image) return;

            const t = this.$assetIcon.getContext('2d');
            t.imageSmoothingEnabled = !1;
            let cw = this.$assetIcon.width;
            let ch = this.$assetIcon.height;

            if (img.importer === 'sprite-frame') {
                let cx;
                let cy;
                let imgWidth;
                let imgHeight;
                if (img.rotated) {
                    const r = cw / 2;
                    const n = ch / 2;
                    t.translate(r, n),
                        t.rotate((-90 * Math.PI) / 180),
                        t.translate(-r, -n),
                        (cx = cw / 2 - this._scalingSize.width / 2),
                        (cy = ch / 2 - this._scalingSize.height / 2),
                        (imgWidth = img.height),
                        (imgHeight = img.width),
                        (cw = this.$assetIcon.height),
                        (ch = this.$assetIcon.width);
                } else
                    (cx = 0),
                        (cy = 0),
                        (imgWidth = img.width),
                        (imgHeight = img.height),
                        (cw = this.$assetIcon.width),
                        (ch = this.$assetIcon.height);

                t.drawImage(this._image, img.trimX, img.trimY, imgWidth, imgHeight, cx, cy, cw, ch);
            }
        },
        _onButtonClick(t) {
            if (
                (t === this.$name && Editor.Ipc.sendToAll('assets:hint', this.value),
                t === this.$browse)
            ) {
                let t = this.type;
                t === 'script' && (t = 'javascript,coffeescript,typescript'),
                    Editor.UI.fire(this, 'search-asset'),
                    Editor.Ipc.sendToPanel('assets', 'assets:search', `t:${t}`);
            }
            this.readonly ||
                (t === this.$close &&
                    ((this.value = ''),
                    console.log(this),
                    console.log(t),
                    setTimeout(() => {
                        Editor.UI.fire(this, 'change', {
                            bubbles: !1,
                            detail: {
                                value: this.value,
                            },
                        }),
                            Editor.UI.fire(this, 'confirm', {
                                bubbles: !1,
                                detail: {
                                    value: this.value,
                                },
                            });
                    }, 1)));
        },
        _isTypeValid(t) {
            return (
                t === this.type || cc.js.isChildClassOf(Editor.assets[t], Editor.assets[this.type])
            );
        },
        _onDropAreaMove(t) {
            t.stopPropagation(),
                this.highlighted
                    ? this.invalid
                        ? Editor.UI.DragDrop.updateDropEffect(t.detail.dataTransfer, 'none')
                        : Editor.UI.DragDrop.updateDropEffect(t.detail.dataTransfer, 'copy')
                    : Editor.UI.DragDrop.updateDropEffect(t.detail.dataTransfer, 'none');
        },
        _onDropAreaEnter(t) {
            t.stopPropagation();
            const e = t.detail.dragItems;
            this._requestID &&
                (Editor.Ipc.cancelRequest(this._requestID), (this._requestID = null));
            const i = e[0].id;
            (this.invalid = !0),
                (this._requestID = Editor.assetdb.queryMetaInfoByUuid(i, (t, e) => {
                    if (
                        ((this._requestID = null),
                        (this.highlighted = !0),
                        (this._cacheUuid = i),
                        (this.invalid = !this._isTypeValid(e.assetType)),
                        !this.invalid)
                    )
                        return;

                    const s = JSON.parse(e.json);
                    const a = Object.keys(s.subMetas);
                    if (a.length !== 1) return;

                    const n = s.subMetas[a[0]].uuid;
                    this._requestID = Editor.assetdb.queryInfoByUuid(n, (t, e) => {
                        (this._cacheUuid = n), (this.invalid = !this._isTypeValid(e.type));
                    });
                }));
        },
        _onDropAreaLeave(t) {
            t.stopPropagation(),
                this._requestID &&
                    (Editor.Ipc.cancelRequest(this._requestID), (this._requestID = null)),
                (this.highlighted = !1),
                (this.invalid = !1);
        },
        _onDropAreaAccept(t) {
            t.stopPropagation(),
                this._requestID &&
                    (Editor.Ipc.cancelRequest(this._requestID), (this._requestID = null)),
                (this.highlighted = !1),
                (this.invalid = !1),
                (this.value = this._cacheUuid),
                Editor.UI.fire(this, 'change', {
                    bubbles: !1,
                    detail: {
                        value: this.value,
                    },
                }),
                Editor.UI.fire(this, 'confirm', {
                    bubbles: !1,
                    detail: {
                        value: this.value,
                    },
                });
        },
    });
})();
