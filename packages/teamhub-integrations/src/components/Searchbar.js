import React from "react";
import { TextField, InputAdornment } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Search, Clear } from "@material-ui/icons";
import { useDebounce } from "use-debounce";

const SearchComponent = withStyles((theme) => ({
  root: {
    "& fieldset": {
      border: "none",
    },
    "& input:focus": {
      color: theme.palette.primary,
    },
    "& .MuiInputBase-root": {
      color: theme.palette.text.secondary,
      backgroundColor: "#FAFAFA",
    },
    "& .MuiOutlinedInput-root": {
      "&:hover": {
        color: "#4c43db",
      },
      "&:hover fieldset": {
        border: "2px solid #4c43db",
      },
      "&.Mui-focused fieldset": {
        color: "#4c43db",
      },
    },
  },
}))(TextField);

export default function Searchbar(props) {
  const [search, setSearch] = React.useState("");
  // debounce onChange to parent component to avoid unnecessary rerenders while typing
  const [dValue] = useDebounce(search, 400);
  React.useEffect(() => {
    props.onChange(dValue);
  }, [dValue]);
  return (
    <SearchComponent
      value={search}
      id="TI_posUserList_searchbar"
      fullWidth
      variant="outlined"
      placeholder="Search"
      onChange={(e) => setSearch(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        endAdornment: search.length > 0 && (
          <InputAdornment position="end">
            <Clear
              style={{ cursor: "pointer" }}
              onClick={() => setSearch("")}
            />
          </InputAdornment>
        ),
      }}
    />
  );
}
