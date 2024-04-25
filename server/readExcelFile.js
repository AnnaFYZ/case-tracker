const ExcelJS = require("exceljs");

let workbook;
let worksheet;

function fillingGaps(table, placeholder) {
  const maxColumns = Math.max(...table.map((row) => row.length));
  return table.map((row) => {
    const missingColumns = maxColumns - row.length;
    if (missingColumns > 0) {
      const filledRow = [...row];
      for (let i = 0; i < missingColumns; i++) {
        filledRow.push(placeholder);
      }
      return filledRow;
    }
    return row;
  });
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const readExcelFile = async (path) => {
  try {
    workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path);
    worksheet = workbook.getWorksheet(1);
    const rowData = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      row.values.shift();
      const rowValues = row.values.slice(1).map((cell) => {
        if (typeof cell === "object" && cell !== null && "result" in cell) {
          return cell.result;
        } else if (cell instanceof Date) {
          return formatDate(cell.toISOString());
        } else {
          return cell;
        }
      });

      rowData.push(rowValues);
    });

    //return rowData;
    return fillingGaps(rowData);
  } catch (error) {
    console.error("Error reading Excel file:", error);
  }
};

const saveExcelFile = async (newbook, path) => {

  workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path);
  worksheet = workbook.getWorksheet(1);
  try {
    newbook.forEach((modifiedCell) => {
      const row = worksheet.getRow(modifiedCell.rowIndex + 1);
      const cell = row.getCell(modifiedCell.columnIndex + 1);
      cell.value = modifiedCell.value;
    });

    await workbook.xlsx.writeFile(path);
  } catch (error) {
    console.error("Error saving Excel file:", error);
    throw error;
  }
};

module.exports = { readExcelFile, saveExcelFile };
