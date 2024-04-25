import "./table.css";
import { useContext, useState } from "react";
import { ExcelContext, ChangesContext } from "./ExcelData/ExcelContext";
import CheckboxDropdown from "./dropdownList";
// import { Table } from "antd";

const Table = (props) => {
  const { tableData, setTableData } = useContext(ExcelContext);
  const [editableCell, setEditableCell] = useState(null);
  const { changes, setChanges} = useContext(ChangesContext);
  const [hiddenRows, setHiddenRows] = useState([]);
  
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

  const handleFilterChange = () => {

  }

  const getUniqueValues = (tableData, columnIndex) => {
    const uniqueValues = new Set();
    tableData.slice(1).forEach((row) => {
      if (row[columnIndex]) {
        uniqueValues.add(row[columnIndex]);
      }
    });
    return Array.from(uniqueValues);
  };


    return (
      <table>
        <thead>
          <tr>
            {tableData[0].map((header, index) => (
              <th scope="col" id={header} key={index}>
                {header === "status" || header === "assigned to" ? (
                  <div>
                    {header}
                    <div 
                      className="selectRows"
                      onChange={(e) =>
                        handleFilterChange(e.target.value, tableData)
                      }
                    
                    >
                      <CheckboxDropdown options={getUniqueValues(tableData, index)}/>
                    </div>
                  </div>
                ) : (
                  header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.slice(1).map((row, rowIndex) => (
            <tr
              key={rowIndex}
              id={rowIndex}
              const
              rowClassName={hiddenRows[rowIndex] ? "hiddenRow" : ""}
            >
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
