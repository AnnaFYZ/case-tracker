import "./table.css";
import { useContext, useState } from "react";
import { ExcelContext, ChangesContext } from "./ExcelData/ExcelContext";

const Table = (props) => {
  const { tableData, setTableData } = useContext(ExcelContext);
  const [editableCell, setEditableCell] = useState(null);
  const { changes, setChanges} = useContext(ChangesContext);
  
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
              
              {row.map((cell, cellIndex) => (
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
                      onBlur={handleCellValueChanged} //record changes into change tracker array
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
