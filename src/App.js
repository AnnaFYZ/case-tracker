import { useEffect, useState } from 'react';
import './App.css';
import Table from './Table';
import { ExcelContext, ChangesContext } from './ExcelData/ExcelContext';

function App() {
  const [input, setInput] = useState("/home/anna/Documents/my docs/case tracker.xltx");
  const [tableData, setTableData] = useState([
    [
      "no data uploaded"      
    ],
  ]);
  const [changes, setChanges] = useState([])
  
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
          .then((response) =>       
             console.log("Status:", response.status)
          )
          .catch((error) => console.log(error));
      }

  return (
    <div className="App">
      <header className="App-header">
        <div className="enterLocation">
          <label>
            Enter file location:{" "}
            <input value={input} onChange={(e) => setInput(e.target.value)} />
          </label>
          <button type="submit" onClick={(e) => readTheFile()}>
            Enter
          </button>
        </div>
        <div className="saveData">
          <button type="submit" onClick={handleSubmitButton}>
            Save changes
          </button>
        </div>
        <div className="manageData"></div>
      </header>
      <ExcelContext.Provider value={{ tableData, setTableData }}>
        <ChangesContext.Provider value={{ changes, setChanges}}>
          <Table table={tableData} />
        </ChangesContext.Provider>
      </ExcelContext.Provider>
    </div>
  );
}

export default App;
