const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const express = require("express");
const appExcel = express();
const cors = require("cors");
const port = 5000;

appExcel.use(express.json());

const { readExcelFile, saveExcelFile } = require("./server/readExcelFile");

// const corsOptions = {
//   origin: "http://localhost:3000",
// };

// appExcel.use(cors(corsOptions));

let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Enable Node.js integration
    },
  });

  // Load the React app from the build folder
   mainWindow.loadURL(
     `file://${path.resolve(__dirname, "../build/index.html")}`
   );


 app.on("window-all-closed", function () {
   if (process.platform !== "darwin") {
     app.quit();
   }
 });
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

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
