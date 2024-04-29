const express = require("express");
const appExcel = express();
const cors = require("cors");
const port = 5000;

appExcel.use(express.json());

const {readExcelFile, saveExcelFile} = require("./readExcelFile");

const corsOptions = {
  origin: "http://localhost:3000",
};

appExcel.use(cors(corsOptions));

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
