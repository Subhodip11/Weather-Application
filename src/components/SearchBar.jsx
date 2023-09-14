import {
  Autocomplete,
  TextField,
  Button,
  Box,
  FormControl,
} from "@mui/material";
import React from "react";
import { getSearchLocationDetails } from "../helper";

const SearchBar = ({
  placeName,
  setPlaceName,
  optionsFieldForPlace,
  setOptionsFieldForPlace,
  apiKey,
  fetchDataHandler,
}) => {
  return (
    <Box
      sx={{
        border: "1px solid black",
        width: "fit-content",
        height: "auto",
        margin: "1rem auto",
      }}
    >
      <FormControl
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          color: "white",
          bgcolor: "rgba(20,20,40,0.8)",
          padding: "0.5rem 0.8rem",
        }}
      >
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          inputValue={placeName}
          onSelect={() =>
            getSearchLocationDetails(placeName, apiKey, setOptionsFieldForPlace)
          }
          onInputChange={async (event, newInputValue) => {
            event.preventDefault();
            setPlaceName((currVal) => (currVal = newInputValue));
          }}
          options={optionsFieldForPlace}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              id="standard-basic"
              label="Search by city name"
              variant="standard"
              sx={{
                input: { color: "white" },
                label: { color: "white" },
              }}
            />
          )}
        />
        <Button
          size="small"
          sx={{ marginLeft: "0.8rem" }}
          variant="outlined"
          type="submit"
          onClick={(e) => fetchDataHandler()}
        >
          Search
        </Button>
      </FormControl>
    </Box>
  );
};

export default SearchBar;
