import { useEffect, useState } from 'react';
import './App.css';
import Table from './components/Table';
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  ExcelContext,
  ChangesContext,
  DisplayedColumns,
  RowsFilter,
} from "./ExcelData/ExcelContext";
import { Filter } from './components/Filter';
import { ColumnManager } from './components/ColumnManager';

function App() {
  const [input, setInput] = useState("/home/anna/Documents/my docs/case tracker.xltx");
  const [tableData, setTableData] = useState([["no data uploaded"],]);
  const [changes, setChanges] = useState([]);
  const [displayedColumns, setDisplayedColumns] = useState([]);
  
    
  useEffect(() => {
      }, [tableData]); 
 
    function readTheFile () {
      const encodedInput = encodeURIComponent(input);
      fetch(`http://localhost:5000/${encodedInput}`)
        .then((response) => response.json())
        .then((data) => {
        setTableData(data);
        console.log(data)
        })
        .catch((error) => console.log(error));
      }
      

      function handleSubmitButton(event) {
        event.preventDefault();
        console.log("submitted")
        const encodedInput = encodeURIComponent(input);
        fetch(`http://localhost:5000/${encodedInput}`, {
          method: "PUT", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changes),
        })
          .then((response) => {
            console.log("Status:", response.status);
            setChanges([]);
          }      
             
          )
          .catch((error) => console.log(error));
      }

  return (
    <DisplayedColumns.Provider
            value={{ displayedColumns, setDisplayedColumns }}
          >
    <div className="App">
      <header className="App-header">
        <div className="enterLocation">
          <div>
            <Typography variant="subtitle1">Enter File Location:</Typography>
          </div>
          <div>
            <TextField
              error={input.trim() === "" || !/\.(xlsx|xltx)$/.test(input)}
              id="outlined-error-helper-text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              helperText={
                input.trim() === ""
                  ? "Input cannot be empty."
                  : !/\.(xlsx|xltx)$/.test(input)
                  ? "Invalid path. Must end with .xlsx or .xltx."
                  : ""
              }
              sx={{
                "& .MuiInputBase-input": {
                  color: "black",
                  backgroundColor: "white",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "white",
                },
                "& .MuiInputBase-root": {
                  marginRight: "10px",
                  backgroundColor: "white",
                },
              }}
            />

            <LoadingButton
              onClick={(e) => readTheFile()}
              color="secondary"
              variant="contained"
            >
              <span>Fetch Data</span>
            </LoadingButton>
          </div>
        </div>
        <div className="saveData">
          <LoadingButton
            onClick={handleSubmitButton}
            startIcon={<SaveIcon />}
            color="secondary"
            variant="contained"
          >
            <span>Save changes</span>
          </LoadingButton>
        </div>
        <div className="manageData">
            <ColumnManager
              tableData={tableData}
              setDisplayedColumns={setDisplayedColumns}
            />
            <Filter />
        </div>
      </header>
      <ExcelContext.Provider value={{ tableData, setTableData }}>
        <ChangesContext.Provider value={{ changes, setChanges }}>
          <Table columns={displayedColumns} />
        </ChangesContext.Provider>
      </ExcelContext.Provider>
    </div>
    </DisplayedColumns.Provider>
  );
}

export default App;
