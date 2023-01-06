const Path = require('path');
const Fs = require('fs');
const PackageUtil = require('./eazax/package-util');

/** package name */
const PACKAGE_NAME = PackageUtil.name

/** package.json path */
const PACKAGE_PATH = Path.join(__dirname, '../package.json');

/** 快捷键行为 */
const ACTION_NAME = 'cocos';

/** package.json menu key */
const MENU_ITEM_KEY = `i18n:MAIN_MENU.package.title/i18n:${PACKAGE_NAME}.name/i18n:${PACKAGE_NAME}.${ACTION_NAME}`;

/** config file path */
const CONFIG_PATH = Path.join(__dirname, '../config.json');

/**
 * Config Manager
 */
const ConfigManager = {

    /**
     * default
     */
    defaultConfig: {
        version: "1.0",
        autoCheckUpdate: true,
    },

    /**
     * read config
     * @returns {{ autoCheckUpdate: boolean }}
     */
    get() {
        const configData = JSON.parse(JSON.stringify(this.defaultConfig));
        // config
        if (Fs.existsSync(CONFIG_PATH)) {
            const localConfig = JSON.parse(Fs.readFileSync(CONFIG_PATH));
            configData.autoCheckUpdate = localConfig.autoCheckUpdate;
        }
        // shortcut
        const packageData = JSON.parse(Fs.readFileSync(PACKAGE_PATH)),
            menuItem = packageData['main-menu'][MENU_ITEM_KEY];
        configData.hotkey = menuItem['accelerator'] || '';
        // Done
        return configData;
    },

    /**
     * save config
     * @param {{ autoCheckUpdate: boolean }} config
     */
    set(config) {
        const configData = JSON.parse(JSON.stringify(this.defaultConfig));
        // config
        configData.autoCheckUpdate = config.autoCheckUpdate;
        Fs.writeFileSync(CONFIG_PATH, JSON.stringify(configData, null, 2));
        // shortcut
        const packageData = JSON.parse(Fs.readFileSync(PACKAGE_PATH)),
            menuItem = packageData['main-menu'][MENU_ITEM_KEY];
        if (config.hotkey && config.hotkey !== '') {
            menuItem['accelerator'] = config.hotkey;
        } else {
            delete menuItem['accelerator'];
        }
        Fs.writeFileSync(PACKAGE_PATH, JSON.stringify(packageData, null, 2));
    },

};

module.exports = ConfigManager;
