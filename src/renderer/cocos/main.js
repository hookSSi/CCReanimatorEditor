const Fs = require('fs');
const Path = require('path');

const PackageUtil = require('..\\..\\eazax\\package-util');

/** package name */
const PACKAGE_NAME = PackageUtil.name
const PACKAGE_PATH = Editor.url(`packages://${PACKAGE_NAME}/`);
const DIR_PATH = Path.join(PACKAGE_PATH, 'src\\renderer\\cocos\\');

const Vue = require(Path.join(PACKAGE_PATH, 'lib\\vue.global.prod'));
const App = require(Path.join(DIR_PATH, 'index'));

// create panel
Editor.Panel.extend({

    /** HTML */
    // template: readFileSync(join(__dirname, 'index.html'), 'utf8'),
    template: Fs.readFileSync(Path.join(DIR_PATH, 'index.html'), { encoding: 'utf8' }),

    /**
     * 面板渲染成功
     */
    ready() {
        const root = this.shadowRoot;
        // 加载样式表
        // loadCss(root, join(__dirname, '../../eazax/css/cocos-tag.css'));
        // loadCss(root, join(__dirname, '../../eazax/css/cocos-class.css'));
        // loadCss(root, join(__dirname, 'index.css'));
        loadCSS(root, Path.join(PACKAGE_PATH, 'src\\eazax\\css\\cocos-tag.css'));
        loadCSS(root, Path.join(PACKAGE_PATH, 'src\\eazax\\css\\cocos-class.css'));
        loadCSS(root, Path.join(DIR_PATH, 'index.css'));
        //Replace Vue Version
        const oldVue = window.Vue;
        window.Vue = Vue;
        // Creating an Instance
        const app = Vue.createApp(App);
        // Mount
        app.mount(root);
        // Editor의 Vue 되돌리기
        window.Vue = oldVue;
    },

});

/**
 * stylesheet load
 * @param {HTMLElement} root 根元素
 * @param {string} path CSS 文件路径
 */
function loadCSS(root, path) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = path;
    const el = root.querySelector('#app');
    root.insertBefore(link, el);
}
