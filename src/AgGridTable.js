import { useContext, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ExcelContext, ChangesContext } from "./ExcelData/ExcelContext";

const MyGrid = () => {
  const { tableData, setTableData } = useContext(ExcelContext);
  const { changes, setChanges } = useContext(ChangesContext);

if (!tableData || tableData.length === 0) {
    return <div>No data available</div>;
  }

 const columnNames = tableData[0];

  // Generate column definitions based on column names
  const columnDefs = columnNames.map((columnName) => ({
    headerName: columnName,
    field: columnName.toLowerCase().replace(/ /g, "_"), // Convert to lowercase and replace spaces with underscores
    sortable: false,
    editable: true,
  }));

  // Remove the first array (column names) from the rowData
  const formattedRowData = tableData.slice(1).map((row) => {
    const rowDataObject = {};
    columnNames.forEach((columnName, index) => {
      rowDataObject[columnName.toLowerCase().replace(/ /g, "_")] = row[index];
    });
    return rowDataObject;
  });

  const handleCellValueChanged = (params) => {
    const { rowIndex, colDef } = params;
    const newValue = params.newValue;
    const value = newValue ? newValue.value : null;

    //  const columnIndex = tableData[0].indexOf(colDef.field);

    //  if (columnIndex !== -1) {
    //    const updatedTableData = [...tableData];
    //    updatedTableData[rowIndex + 1][columnIndex] = value; 

    //    setTableData(updatedTableData); 
    //  }

    const change = {
      rowIndex: rowIndex + 1,
      columnIndex: colDef.field, 
      value,
    };

    if (
      changes.some(
        (changeItem) =>
          changeItem.rowIndex === rowIndex + 1 &&
          changeItem.columnIndex === colDef.field
      )
    ) {
      const updatedChanges = changes.map((changeItem) =>
        changeItem.rowIndex === rowIndex + 1 &&
        changeItem.columnIndex === colDef.field
          ? { ...changeItem, value }
          : changeItem
      );
      setChanges(updatedChanges);
    } else {
      const updatedChanges = [...changes, change];
      setChanges(updatedChanges);
    }

    console.log(changes);
  };


  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={formattedRowData}
        columnDefs={columnDefs}
        //onCellValueChanged={handleCellValueChanged}
      />
    </div>
  );
};

export default MyGrid;
