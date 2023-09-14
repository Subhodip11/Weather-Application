import "./App.css";
import { useEffect, useReducer, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Spinner from "./components/Spinner";
import { reducer, fetchData } from "./utils";
import SearchBar from "./components/SearchBar";
import WeatherContainer from "./components/WeatherContainer";
import HourlyDataChart from "./components/HourlyDataChart";
import { Box } from "@mui/material";
import Navigation from "./components/Navigation";

const apiKey = "95a46330d145ac87bc7c3c50eb56a123";

const initialState = {
  isLoading: true,
  weatherData: [],
  error: null,
  basicApiData: {},
};

function App() {
  const [{ isLoading, weatherData, error, basicApiData }, dispatch] =
    useReducer(reducer, initialState);

  const [placeName, setPlaceName] = useState("");
  const [optionsFieldForPlace, setOptionsFieldForPlace] = useState([
    { label: "" },
  ]);
  const [backgroundURL, setBackgroundURL] = useState("");

  const fetchDataHandler = () => {
    fetchData(dispatch, placeName, apiKey, setOptionsFieldForPlace)
      .then((data) => {
        dispatch({
          type: "REQUEST_FULFILLED",
          isLoading: false,
          payload: data,
        });
        console.log(data);
        setBackgroundURL(data.backgroundImageURL);
      })
      .catch((err) => {
        dispatch({ type: "REQUEST_ERROR", payload: err.message });
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchDataHandler();
  }, []);

  if (error) {
    return <>Error</>;
  } else {
    return (
      <Router>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${backgroundURL})`,
            backgroundPosition: "center center",
            height: "100%",
            width: "100%",
            backgroundSize: "cover",
            zIndex: -1,
            opacity: 0.8,
          }}
        ></Box>
        <SearchBar
          placeName={placeName}
          setPlaceName={setPlaceName}
          optionsFieldForPlace={optionsFieldForPlace}
          setOptionsFieldForPlace={setOptionsFieldForPlace}
          apiKey={apiKey}
          fetchDataHandler={fetchDataHandler}
        />
        {weatherData && !isLoading ? (
          <Box>
            <WeatherContainer
              weatherData={weatherData}
              apiKey={apiKey}
              basicApiData={basicApiData}
            />
            <Navigation />
            <Routes>
              <Route
                path="/"
                element={
                  <HourlyDataChart
                    basicApiData={basicApiData}
                    apiKey={apiKey}
                    type="main"
                  />
                }
              />
              <Route
                path="/cloudiness"
                element={
                  <HourlyDataChart
                    basicApiData={basicApiData}
                    apiKey={apiKey}
                    type="cloud"
                  />
                }
              />
              <Route
                path="/wind"
                element={
                  <HourlyDataChart
                    basicApiData={basicApiData}
                    apiKey={apiKey}
                    type="wind"
                  />
                }
              />
              <Route
                path="/rain"
                element={
                  <HourlyDataChart
                    basicApiData={basicApiData}
                    apiKey={apiKey}
                    type="rain"
                  />
                }
              />
              <Route
                path="/precipitation"
                element={
                  <HourlyDataChart
                    basicApiData={basicApiData}
                    apiKey={apiKey}
                    type="precipitation"
                  />
                }
              />
            </Routes>
          </Box>
        ) : (
          <Spinner />
        )}
      </Router>
    );
  }
}

export default App;
