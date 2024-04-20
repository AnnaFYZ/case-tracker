import { createContext } from "react";

export const ExcelContext = createContext({ tableData: [], setTableData: () => {} });

export const ChangesContext = createContext({ changes: [], setChanges: () => {}});