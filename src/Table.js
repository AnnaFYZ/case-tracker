import "./table.css";
import { useContext, useState } from "react";
import { ExcelContext } from "./ExcelData/ExcelContext";

const Table = (props) => {
  const { tableData, setTableData } = useContext(ExcelContext);
  const [editableCell, setEditableCell] = useState(null);
  
  const nonFormulaTable = tableData.map((row) => {
    return row.map((item) =>
      typeof item === "object" && item !== null && "result" in item
        ? item.result
        : item
    );
  });

  const maxColumns = Math.max(...tableData.map((row) => row.length));
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  console.log(nonFormulaTable);

  const handleCellClick = (rowIndex, cellIndex) => {
    setEditableCell({ rowIndex, cellIndex }); 
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    const { rowIndex, cellIndex } = editableCell;
    const updatedTableData = [...tableData];
    console.log(updatedTableData)
    updatedTableData[rowIndex+1][cellIndex+1] = value;
    setTableData(updatedTableData);
  };

    return (
      <table>
        <thead>
          <tr>
            {nonFormulaTable[0].map((header, index) => (
              <th scope="col" id={header} key={index}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {nonFormulaTable.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex} id={rowIndex}>
              <th scope="row"></th>
              {row.slice(1).map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  onDoubleClick={() => handleCellClick(rowIndex, cellIndex)}
                >
                  {editableCell &&
                  editableCell.rowIndex === rowIndex &&
                  editableCell.cellIndex === cellIndex ? (
                    <input
                      type="text"
                      value={cell}
                      onChange={handleInputChange}
                      onBlur={() => setEditableCell(null)} 
                    />
                  ) : typeof cell === "string" && cell.includes("T") ? (
                    formatDate(cell)
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );

};

export default Table;
