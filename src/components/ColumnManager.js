import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 36;
const ITEM_PADDING_TOP = 4;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

const theme = createTheme({
  palette: {
    premier: {
      main: "#fff",
    },
    secondary: {
      main: "#ba68c8",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ba68c8", // Border color when focused
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ba68c8", // Border color
          },
        },
        input: {
          color: "#000",
          backgroundColor: "#ba68c8",
          padding: "6px",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          color: "#fff",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          paddingTop: "0px", 
          paddingBottom: "0px", 
        },
      },
    },
  },
});


export const ColumnManager = ({tableData, setDisplayedColumns}) => {
  const [columnNames, setColumnNames] = useState([]);
  const columns = tableData[0];

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
     const checkedColumnIndexes = value.map((columnName) =>
       tableData[0].indexOf(columnName)
     );
    setColumnNames(
      typeof value === "string" ? value.split(",") : value
    );
    setDisplayedColumns(checkedColumnIndexes)
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel
            id="demo-multiple-checkbox-label"
            color="premier"
            sx={{
              position: "absolute",
              top: -10,
            }}
          >
            Choose Columns to Hide
          </InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={columnNames}
            onChange={handleChange}
            input={<OutlinedInput label="Hidden Columns" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {columns.length > 1 ? (
              columns.map((column, columnIndex) => (
                <MenuItem key={column} value={column}>
                  <Checkbox checked={columnNames.indexOf(column) > -1} />
                  <ListItemText primary={column} />
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Nothing to Hide</MenuItem>
            )}
          </Select>
        </FormControl>
      </ThemeProvider>
    </div>
  );
};
