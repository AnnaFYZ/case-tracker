import "./table.css";
import { useContext, useState } from "react";
import { ExcelContext, ChangesContext } from "../ExcelData/ExcelContext";

const Table = () => {
  const { tableData, setTableData } = useContext(ExcelContext);
  const [editableCell, setEditableCell] = useState(null);
  const { changes, setChanges} = useContext(ChangesContext);
  const hiddenColumnIndex = 3;
   
  const handleCellClick = (rowIndex, cellIndex, event) => {
    setEditableCell({ rowIndex, cellIndex }); 
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    const { rowIndex, cellIndex } = editableCell;
    const updatedTableData = [...tableData];
    console.log(rowIndex, cellIndex)
    updatedTableData[rowIndex+1][cellIndex] = value;
    setTableData(updatedTableData);
    
  };

  const handleCellValueChanged = (e) => {
    setEditableCell(null)
    const { value } = e.target;
    const { rowIndex, cellIndex } = editableCell;
    const change = {
      rowIndex: rowIndex + 1,
      columnIndex: cellIndex,
      value,
    }; 
    if (changes.some((change) =>
          change.rowIndex === rowIndex+1 && change.columnIndex === cellIndex)) {
            const updatedChanges = changes.map((changeItem) =>
               changeItem.rowIndex === rowIndex+1 &&
               changeItem.columnIndex === cellIndex
                 ? { ...changeItem, value }
                  : changeItem );
      setChanges(updatedChanges);
    } else {
      const updatedChanges = [...changes, change];
      setChanges(updatedChanges);
    }
    console.log(changes)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCellValueChanged(e);
    }
  };


    return (
      <table>
        <thead>
          <tr>
            {tableData[0].map((header, index) => (
              <th
                scope="col"
                id={header}
                key={index}
                style={{
                  display: index === hiddenColumnIndex ? "none" : "table-cell",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex} id={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  className={
                    editableCell &&
                    editableCell.rowIndex === rowIndex &&
                    editableCell.cellIndex === cellIndex
                      ? "tableInput"
                      : ""
                  }
                  key={cellIndex}
                  onClick={() => handleCellClick(rowIndex, cellIndex)}
                  style={{
                    display:
                      cellIndex === hiddenColumnIndex ? "none" : "table-cell",
                  }}
                >
                  {editableCell &&
                  editableCell.rowIndex === rowIndex &&
                  editableCell.cellIndex === cellIndex ? (
                    <input
                      className="tableInput"
                      type="text"
                      value={cell}
                      ref={(input) => input && input.focus()}
                      onChange={handleInputChange}
                      onBlur={handleCellValueChanged}
                      onKeyDown={handleKeyDown}
                    />
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
