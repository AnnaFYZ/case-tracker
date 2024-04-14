const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;

const {readExcelFile} = require("./readExcelFile");

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

app.get("/:path", async (req, res) => {
   try {
    //const data = await readExcelFile("/home/anna/Documents/my docs/case tracker.xltx");
    const data = await readExcelFile(req.params.path);
    res.json(data); 
    
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
})

app.listen(port, () => console.log(`Listening on port ${port}`));
