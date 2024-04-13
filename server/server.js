const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

const ExcelJS = require("exceljs");

const readExcelFile = async (path) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path);
    const worksheet = workbook.getWorksheet(1);
    const rowData = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      rowData.push(row.values);
    });
    return rowData;
  } catch (error) {
    console.error("Error reading Excel file:", error);
  }
};

app.get("/", async (req, res) => {
   try {
    const data = await readExcelFile("/home/anna/Documents/my docs/case tracker.xltx");
    res.json(data); 
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
})

app.listen(port, () => console.log(`Listening on port ${port}`));
