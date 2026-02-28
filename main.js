const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 900,
        minHeight: 600,
        title: 'King Image Editor',
        backgroundColor: '#0d0d0d',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: false
        },
        show: false
    });

    mainWindow.loadFile('index.html');

    // White flash இல்லாம show பண்ணு
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => { mainWindow = null; });
}

function buildMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: '📂 Open Image',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => mainWindow.webContents.executeJavaScript("document.getElementById('fi').click()")
                },
                {
                    label: '⬇ Save Image',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => mainWindow.webContents.executeJavaScript("openDlModal && openDlModal()")
                },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => app.quit()
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {
                    label: '↩ Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    click: () => mainWindow.webContents.executeJavaScript("undo && undo()")
                },
                {
                    label: '↪ Redo',
                    accelerator: 'CmdOrCtrl+Y',
                    click: () => mainWindow.webContents.executeJavaScript("redo && redo()")
                },
                { type: 'separator' },
                {
                    label: '🔁 Reset All',
                    click: () => mainWindow.webContents.executeJavaScript("resetAll && resetAll()")
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Toggle Fullscreen',
                    accelerator: 'F11',
                    click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen())
                },
                {
                    label: 'Zoom In',
                    accelerator: 'CmdOrCtrl+Plus',
                    click: () => mainWindow.webContents.setZoomFactor(
                        mainWindow.webContents.getZoomFactor() + 0.1
                    )
                },
                {
                    label: 'Zoom Out',
                    accelerator: 'CmdOrCtrl+-',
                    click: () => mainWindow.webContents.setZoomFactor(
                        Math.max(0.5, mainWindow.webContents.getZoomFactor() - 0.1)
                    )
                },
                {
                    label: 'Reset Zoom',
                    accelerator: 'CmdOrCtrl+0',
                    click: () => mainWindow.webContents.setZoomFactor(1)
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About King Image Editor',
                    click: () => dialog.showMessageBox(mainWindow, {
                        type: 'info',
                        title: 'King Image Editor',
                        message: 'King Image Editor v1.0.0',
                        detail: 'Features:\n• Filters & Adjustments\n• Crop, Flip, Rotate\n• Text & Emoji Overlays\n• AI Background Removal\n• Collage Builder\n• Watermark\n• Batch Export\n• Before/After Preview',
                        buttons: ['OK']
                    })
                }
            ]
        }
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
    createWindow();
    buildMenu();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});