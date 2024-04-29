const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const express = require("express");
const appExcel = express();
const cors = require("cors");
const port = 5000;

appExcel.use(express.json());

const { readExcelFile, saveExcelFile } = require("./readExcelFile");

const corsOptions = {
  origin: "http://localhost:3000",
};

appExcel.use(cors(corsOptions));

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.setMenuBarVisibility(false);
  //Development
  //mainWindow.loadURL('http://localhost:3000');
  //Production
  mainWindow.loadFile(path.join(__dirname, "index.html"));
  
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

appExcel.get("/:path", async (req, res) => {
  try {
    const data = await readExcelFile(req.params.path);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

appExcel.put("/:path", (req, res) => {
  try {
    const data = req.body;
    const path = req.params.path;
    saveExcelFile(data, path);
    console.log(data);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

appExcel.listen(port, () => console.log(`Listening on port ${port}`));
