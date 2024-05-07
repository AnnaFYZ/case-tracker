const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require("path"); // Import the path module



ipcMain.on('open-file-dialog', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile']
  });

  if (!result.canceled) {
    const filePath = result.filePaths[0];
    event.sender.send('file-selected', filePath);
  }
});

// Your other code for creating windows, etc.

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'), // Use the path module to construct the file path
      sandbox: false
    }
  })

  win.loadURL("http://localhost:3000");
  win.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
