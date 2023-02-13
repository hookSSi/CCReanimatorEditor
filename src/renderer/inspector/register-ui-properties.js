'use-strict';

const Fs = require('fs');
const Path = require('path');
const PackageUtil = require('../../eazax/package-util');

/** package name */
const PACKAGE_NAME = PackageUtil.name;
const PACKAGE_PATH = Editor.url(`packages://${PACKAGE_NAME}`);

(() => {
    Editor.UI.registerProperty('ReanimatorDriver', {
        value: Editor.UI.parseObject,
        template: Fs.readFileSync(
            Path.join(PACKAGE_PATH, 'src/renderer/inspector/reanimator-driver.html'),
            'utf-8',
        ),
        ready() {
            (this.$propKey = this.querySelector('#key-comp')),
                (this.$inputKey = this.$propKey.children[0]),
                this.value && (this.$inputKey.value = this.value.key.value),
                this.values && (this.$inputKey.values = this.values.map(t => t.key.value)),
                this.installStandardEvents(this.$inputKey),
                this.$inputKey.maxLength = 100,
                (this.$propNum = this.querySelector('#num-comp')),
                (this.$inputNum = this.$propNum.children[0]),
                (this.$inputNum.min = 0),
                (this.$inputNum.max = 255),
                (this.$inputNum.step = 1),
                (this.$inputNum.precision = 0),
                this.value && (this.$inputNum.value = this.value.num.value),
                this.values && (this.$inputNum.values = this.values.map(t => t.num.value)),
                this.installStandardEvents(this.$inputNum),
                this.installSlideEvents(
                    this.$propNum,
                    t => {
                        this.$inputNum.value = this.$inputNum.value + t;
                    },
                    null,
                    () => {
                        this.$inputNum.value = this.value.num;
                    },
                ),
                (this.multiValues = this.getAttribute('multi-values'));
        },
        inputValue() {
            return {
                key: this.$inputKey.multiValues ? null : this.$inputKey.value,
                num: this.$inputNum.multiValues ? null : this.$inputNum.value,
            };
        },
        valueChanged(t, i) {
            (this.$inputKey.value = i.key.value), (this.$inputNum.value = i.num.value);
        },
        valuesChanged(t, i) {
            (this.$inputKey.values = i.map(t => t.key.value)),
                (this.$inputNum.values = i.map(t => t.num.value)),
                this.multiValues && (this._updateMultiKey(), this._updateMultiNum());
        },
        multiValuesChanged(t, i) {
            this._updateMultiKey(), this._updateMultiNum();
        },
        _updateMultiKey() {
            if (!this.multiValues || !this.values || this.values.length <= 1)
                return this.$inputKey.removeAttribute('multi-values');

            var t = this.values[0];
            this.values.every((i, e) => (e == 0 || i == t)
                ? this.$inputKey.removeAttribute('multi-values')
                : this.$inputKey.setAttribute('multi-values', ''))
        },
        _updateMultiNum() {
            if (!this.multiValues || !this.values)
                return this.$inputNum.removeAttribute('multi-values');

            var t = this.values.map(t => t.num.value);
            t.every((i, e) => e == 0 || i == t[e - 1])
                ? (this.$inputNum.removeAttribute('multi-values'), (this.$inputNum.value = t[0]))
                : (this.$inputNum.setAttribute('multi-values', ''), (this.$inputNum.values = t));
        },
        _emitConfirm() {
            // console.log('confirm');
        }
    }),
        Editor.UI.registerProperty('PreviewSprite', {
            value: Editor.UI.parseObject,
            template: Fs.readFileSync(
                Path.join(PACKAGE_PATH, 'src/renderer/inspector/preview-sprite.html'),
                'utf-8',
            ),
            ready() {
                (this.style.paddingTop = '8px'),
                    this.setAttribute('multiline', ''),
                    this.setAttribute('auto-height', ''),
                    (this.$inputSprite = this.querySelector('#sprite-cell-comp')),
                    (this.$inputSprite.value = this.value ? this.value.sprite.value : null),
                    this.values
                        ? (this.$inputSprite.values = this.values.map(t => t.sprite.value))
                        : (this.$inputSprite.values = null),
                    (this.multiValues = this.getAttribute('multi-values')),
                    this.installStandardEvents(this.$inputSprite);
            },
            inputValue() {
                const s = this.$inputSprite.multiValues;

                return {
                    sprite: s ? null : this.$inputSprite.value,
                };
            },
            valueChanged(t, i) {
                this.$inputSprite.value = i.sprite.value;
            },
            valuesChanged(t, i) {
                (this.$inputSprite.values = i.map(t => t.sprite.value)),
                    this.multiValues && this._updateMultiSpriteValue();
            },
            multiValuesChanged(t, i) {
                this._updateMultiValue();
            },
            _updateMultiValue() {
                this._updateMultiSpriteValue();
            },
            _updateMultiSpriteValue() {
                if (!this.multiValues || !this.values || this.values.length <= 1)
                    return this.$inputSprite.removeAttribute('multi-values');

                const t = this.values.map(t => t.sprite.value);
                t.every((i, e) => e == 0 || i == t)
                    ? this.$inputSprite.removeAttribute('multi-values')
                    : this.$inputSprite.setAttribute('multi-values', '');
            },
        });
})();
