const { BrowserWindow } = require('electron');
const { language, translate } = require('./eazax/editor-util');
const PackageUtil = require('./eazax/package-util');

/** Package name */
const PACKAGE_NAME = PackageUtil.name;

/** Extension name */
const EXTENSION_NAME = translate('name');

/**
 * Calculate Window Position
 * @param {[number, number]} size size of window
 * @param {'top' | 'center'} anchor anchor of window
 * @returns {[number, number]}
 */
function calcWindowPosition(size, anchor) {
    // Calculate based on the location of the current window
    const editorWin = BrowserWindow.getFocusedWindow(),
        editorSize = editorWin.getSize(),
        editorPos = editorWin.getPosition();
    // !Warning：(0, 0) is Top-Left
    // Position must be an integer value.(The minimum pixel size is 1)
    const x = Math.floor(editorPos[0] + (editorSize[0] / 2) - (size[0] / 2));
    let y;
    switch (anchor || 'top') {
        case 'top': {
            y = Math.floor(editorPos[1]);
            break;
        }
        case 'center': {
            y = Math.floor(editorPos[1] + (editorSize[1] / 2) - (size[1] / 2));
            break;
        }
    }
    return [x, y];
}

/**
 * Panel Manager
 */
const PanelManager = {

    /**
     * Open Panel
     */
    openCocosPanel() {
        Editor.Panel.open(`${PACKAGE_NAME}.cocos`);
    },

    /**
     * Panel Instance
     * @type {BrowserWindow}
     */
    nativePanel: null,

    /**
     * Open Native Panel
     */
    openNativePanel() {
        // Close if it is open
        if (this.nativePanel) {
            this.closeNativePanel();
            return;
        }
        // Create window
        const winSize = [800, 400],
            winPos = calcWindowPosition(winSize, 'center'),
            win = this.nativePanel = new BrowserWindow({
                width: winSize[0],
                height: winSize[1],
                minWidth: winSize[0] * 0.6,
                minHeight: winSize[1] * 0.6,
                x: winPos[0],
                y: winPos[1] - 100,
                frame: true,
                title: `${EXTENSION_NAME} | Cocos Creator`,
                autoHideMenuBar: true,
                resizable: true,
                minimizable: false,
                maximizable: false,
                fullscreenable: false,
                skipTaskbar: true,
                alwaysOnTop: true,
                hasShadow: true,
                show: false,
                webPreferences: {
                    nodeIntegration: true,
                },
            });
        // Load page and pass language
        win.loadURL(`file://${__dirname}/renderer/native/index.html?lang=${language}`);
        // ESC for exit
        win.webContents.on('before-input-event', (event, input) => {
            if (input.key === 'Escape') this.closeNativePanel();
        });
        // Show when ready (Anti-blinking)
        win.on('ready-to-show', () => win.show());
        // Auto off after out-of-focus
        // win.on('blur', () => this.closeNativePanel());
        // Close and remove references
        win.on('closed', () => (this.nativePanel = null));
        // for debugging purposes devtools（must be detached for auto-close for out-of-focus）
        // win.webContents.openDevTools({ mode: 'detach' });
    },

    /**
     * Close native panel
     */
    closeNativePanel() {
        if (!this.nativePanel) {
            return;
        }
        // hide and close
        this.nativePanel.hide();
        // close
        this.nativePanel.close();
        // remove reference
        this.nativePanel = null;
    },

    /**
     * setting panel instance
     * @type {BrowserWindow}
     */
    settingPanel: null,

    /**
     * Open setting panel
     */
    openSettingPanel() {
        // 已打开则关闭
        if (this.settingPanel) {
            this.closeSettingPanel();
            return;
        }
        // Close if it is open
        const winSize = [500, 355],
            winPos = calcWindowPosition(winSize, 'center'),
            win = this.settingPanel = new BrowserWindow({
                width: winSize[0],
                height: winSize[1],
                minWidth: winSize[0],
                minHeight: winSize[1],
                x: winPos[0],
                y: winPos[1] - 100,
                frame: true,
                title: `${EXTENSION_NAME} | Cocos Creator`,
                autoHideMenuBar: true,
                resizable: true,
                minimizable: false,
                maximizable: false,
                fullscreenable: false,
                skipTaskbar: true,
                alwaysOnTop: true,
                hasShadow: true,
                show: false,
                webPreferences: {
                    nodeIntegration: true,
                },
            });
        // Load page and pass language
        win.loadURL(`file://${__dirname}/renderer/setting/index.html?lang=${language}`);
        // 监听按键（ESC 关闭）
        win.webContents.on('before-input-event', (event, input) => {
            if (input.key === 'Escape') this.closeSettingPanel();
        });
        // ESC for exit
        win.on('ready-to-show', () => win.show());
        // Auto off after out-of-focus
        // win.on('blur', () => this.closeSettingPanel());
        // Close and remove references
        win.on('closed', () => (this.settingPanel = null));
        // for debugging purposes devtools（must be detached for auto-close for out-of-focus）
        // win.webContents.openDevTools({ mode: 'detach' });
    },

    /**
     * Close setting panel
     */
    closeSettingPanel() {
        if (!this.settingPanel) {
            return;
        }

        // hide and close
        this.settingPanel.hide();
        // close
        this.settingPanel.close();
        // remove reference
        this.settingPanel = null;
    },

};

module.exports = PanelManager;
