'use strict'

const PanelManager = require('./panel-manager');
const MainUtil = require('./eazax/main-util');
const { print, translate, checkUpdate } = require('./eazax/editor-util');

/**
 * （Rendering Process）Check update callback
 * @param {Electron.IpcMainEvent} event 
 * @param {boolean} logWhatever log whatever update
 */
function onCheckUpdateEvent(event, logWhatever) {
    checkUpdate(logWhatever);
}

/**
 * （Rendering Process）Print update callback
 * @param {Electron.IpcMainEvent} event 
 * @param {{ type: string, content: string }} options
 */
function onPrintEvent(event, options) {
    const { type, content } = options;
    print(type, content);
}

/**
 * （Rendering Process）Event callback
 * @param {Electron.IpcMainEvent} event 
 * @param {string} content 
 */
function onGreetEvent(event, content) {
    print('log', content);

    // Reply Rendering Process
    MainUtil.reply(event, 'greet-reply', () => translate('nice'));
}

module.exports = {

    /**
     * extension messages
     */
    messages: {

        /**
         * Open Cocos Panel
         */
        'open-cocos-panel'() {
            PanelManager.openCocosPanel();
        },

        /**
         * Open Electron Native Panel
         */
        'open-native-panel'() {
            PanelManager.openNativePanel();
        },

        /**
         * Open Setting Panel
         */
        'open-setting-panel'() {
            PanelManager.openSettingPanel();
        },

        /**
         * Check Update
         */
        'force-check-update'() {
            checkUpdate(true);
        },

    },

    load() {
        MainUtil.on('check-update', onCheckUpdateEvent);
        MainUtil.on('print', onPrintEvent);
        MainUtil.on('greet', onGreetEvent);

        Editor.success('Reanimator Loaded!');
    },

    unload() {
        MainUtil.removeAllListeners('check-update');
        MainUtil.removeAllListeners('print');
        MainUtil.removeAllListeners('greet');
    },

};
