import "./table.css";
import { useContext } from "react";
import { ExcelContext } from "./ExcelData/ExcelContext";

const Table = (props) => {
  //console.log(props.table);
  const { tableData, setTableData } = useContext(ExcelContext);
  
  const nonFormulaTable = tableData.map((row) => {
    return row.map((item) =>
      typeof item === "object" && item !== null && "result" in item
        ? item.result
        : item
    );
  });
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  console.log(nonFormulaTable);

  try {
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
                <td key={cellIndex}>
                  {typeof cell === "string" && cell.includes("T")
                    ? formatDate(cell)
                    : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  } catch (error) {
    return <div>No data to show</div>;
  }
};

export default Table;
