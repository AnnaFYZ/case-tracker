import { useEffect, useState } from 'react';
import './App.css';
import Table from './Table';
import { ExcelContext } from './ExcelData/ExcelContext';

function App() {
  const [input, setInput] = useState("");
  const [tableData, setTableData] = useState([]);
  

  useEffect(() => {
    
  }, [tableData]); 
 
    function readTheFile () {
      fetch("http://localhost:5000")
        .then((response) => response.json())
        .then((data) => {
        setTableData(data);
        })
        .catch((error) => console.log(error));
        
      }

  return (
    <div className="App">
      <header className="App-header">
        <label>
          Enter file location:{" "}
          <input value={input} onChange={(e) => setInput(e.target.value)} />
        </label>
        <button type="submit" onClick={(e) => readTheFile()}>
          Enter
        </button>
      </header>
      <ExcelContext.Provider value={{ tableData, setTableData }}>
        <Table table={tableData} />
      </ExcelContext.Provider>
    </div>
  );
}

export default App;
