import { createContext } from "react";

export const ExcelContext = createContext({ tableData: [], setTableData: () => {} });