import { useEffect, useState, useCallback, openFileDialog } from 'react';
import { useDropzone } from 'react-dropzone';

import './App.css';
import Table from './Table';
import { ExcelContext, ChangesContext } from './ExcelData/ExcelContext';


function App() {
  // const [input, setInput] = useState("/home/anna/Documents/my docs/case tracker.xltx");
  const [changes, setChanges] = useState([])
  const [input, setInput] = useState("")
  const [tableData, setTableData] = useState([
    [
      "no data uploaded"
    ],
  ]);
  const [filePaths, setFilePaths] = useState([])



  useEffect(() => {
  }, [tableData]);

  useEffect(() => {
    readTheFile(filePaths);
    setInput(filePaths)
  }, [filePaths]);

  function readTheFile(input) {
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

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      setFilePaths(acceptedFiles.map((f) => '"' + f.path + '"'))
    }
    else {
      setFilePaths(['Error'])
    }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className="App">
      <header className="App-header">
        <div className="enterLocation">
          <div className="container">
            <p style={{ marginBottom: '50px' }}>
              File paths:
              <ul>
                {filePaths.map((fp, i) => (
                  <li key={i}>{fp}</li>
                ))}
              </ul>
            </p>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag n drop some files here, or click to select files</p>
              )}
            </div>
          </div>
        </div>
        {/* <label>
            Enter file location:{" "}
            <input value={input} onChange={(e) => setInput(e.target.value)} />
          </label>
          <button type="submit" onClick={(e) => readTheFile()}>
            Enter
          </button>
        </div> */}
        <div className="saveData">
          <button type="submit" onClick={handleSubmitButton}>
            Save changes
          </button>
        </div>
        <div className="manageData"></div>
      </header>
      <ExcelContext.Provider value={{ tableData, setTableData }}>
        <ChangesContext.Provider value={{ changes, setChanges }}>
          <Table table={tableData} />
        </ChangesContext.Provider>
      </ExcelContext.Provider>
    </div>
  );
}

export default App;
