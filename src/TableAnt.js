import React, { useContext, useState } from "react";
import { Table, Input } from "antd";
import { ExcelContext, ChangesContext } from "./ExcelData/ExcelContext";
import CheckboxDropdown from "./dropdownList";

const MyTable = (props) => {
  const { tableData, setTableData } = useContext(ExcelContext);
  const [editableCell, setEditableCell] = useState(null);
  const { changes, setChanges } = useContext(ChangesContext);
  const [hiddenRows, setHiddenRows] = useState([]);

  const handleCellClick = (rowIndex, cellIndex, event) => {
    setEditableCell({ rowIndex, cellIndex });
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    const { rowIndex, cellIndex } = editableCell;
    const updatedTableData = [...tableData];
    updatedTableData[rowIndex + 1][cellIndex] = value;
    setTableData(updatedTableData);
  };

  const handleCellValueChanged = (e) => {
    setEditableCell(null);
    const { value } = e.target;
    const { rowIndex, cellIndex } = editableCell;
    const change = {
      rowIndex: rowIndex + 1,
      columnIndex: cellIndex,
      value,
    };
    if (
      changes.some(
        (change) =>
          change.rowIndex === rowIndex + 1 && change.columnIndex === cellIndex
      )
    ) {
      const updatedChanges = changes.map((changeItem) =>
        changeItem.rowIndex === rowIndex + 1 &&
        changeItem.columnIndex === cellIndex
          ? { ...changeItem, value }
          : changeItem
      );
      setChanges(updatedChanges);
    } else {
      const updatedChanges = [...changes, change];
      setChanges(updatedChanges);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCellValueChanged(e);
    }
  };

  const handleFilterChange = () => {};

  const getUniqueValues = (tableData, columnIndex) => {
    const uniqueValues = new Set();
    tableData.slice(1).forEach((row) => {
      if (row[columnIndex]) {
        uniqueValues.add(row[columnIndex]);
      }
    });
    return Array.from(uniqueValues);
  };

  const columns = tableData[0].map((header, index) => ({
    title: header,
    dataIndex: header,
    key: index,
    render: (text, record, rowIndex) => {
      if (header === "status" || header === "assigned to") {
        return (
          <CheckboxDropdown
            options={getUniqueValues(tableData, index)}
            onChange={(values) => handleFilterChange(values, tableData)}
          />
        );
      }
      return text;
    },
  }));

  return (
    <Table
      dataSource={tableData.slice(1)}
      columns={columns}
      onRow={(record, rowIndex) => ({
        onClick: () => handleCellClick(rowIndex),
      })}
      rowClassName={(record, rowIndex) =>
        hiddenRows[rowIndex] ? "hiddenRow" : ""
      }
      bordered
    />
  );
};

export default MyTable;
