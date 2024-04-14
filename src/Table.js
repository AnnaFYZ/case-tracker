import "./table.css";
import { useContext, useState } from "react";
import { ExcelContext } from "./ExcelData/ExcelContext";

const Table = (props) => {
  const { tableData, setTableData } = useContext(ExcelContext);
  const [editableCell, setEditableCell] = useState(null);
  
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
            {tableData[0].map((header, index) => (
              <th scope="col" id={header} key={index}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.slice(1).map((row, rowIndex) => (
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
                  ) : cell
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );

};

export default Table;
