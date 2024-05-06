import { createContext } from "react";

export const ExcelContext = createContext({ tableData: [], setTableData: () => {} });

export const ChangesContext = createContext({ changes: [], setChanges: () => {}});

export const DisplayedColumns = createContext({
  displayedColumns: [],
  setDisplayedColumns: () => {},
});

export const RowsFilter = createContext({
  rowFilter: [],
  setRowFilter: () => {},
});