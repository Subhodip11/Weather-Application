import React, { useEffect, useReducer } from "react";
import Spinner from "./Spinner";
import axios from "axios";
import { filterEssentialFieldsAndFormat } from "../helper.js";
import { Box } from "@mui/material";

const tommorowIoAPIKey = process.env.REACT_APP_TOMMOROW_IO_API_KEY;

const initialState = {
  isLoading: true,
  dailyData: [],
  error: null,
};

const dailyDataReducer = (state, { type, payload }) => {
  switch (type) {
    case "REQUEST_PENDING":
      return { ...state, isLoading: true };
    case "REQUEST_FULFILLED":
      return { ...state, isLoading: false, dailyData: payload };
    case "REQUEST_ERROR":
      return { ...state, error: payload };
    default:
      throw new Error("Action type mapping not in list");
  }
};

const sessionStorage = window.sessionStorage;

const DailyWeatherDeatils = ({ basicApiData }) => {
  const [{ isLoading, dailyData, error }, dispatch] = useReducer(
    dailyDataReducer,
    initialState
  );

  const fetchDailyDataHandler = () => {
    dispatch({ type: "REQUEST_PENDING", isLoading: true });
    const { lat, lon } = basicApiData;

    const response = axios.get(
      `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${tommorowIoAPIKey}`
    );
    response
      .then((data) => data.data)
      .then((data) => {
        const temp = data.timelines.daily;
        const retriveEssentials = filterEssentialFieldsAndFormat(temp);
        sessionStorage.setItem("apiData", JSON.stringify(retriveEssentials));
        dispatch({
          type: "REQUEST_FULFILLED",
          isLoading: false,
          payload: retriveEssentials,
        });
        // console.log(retriveEssentials);
      })
      .catch((err) => {
        console.log(err.message);
        dispatch({
          type: "REQUEST_ERROR",
          isLoading: false,
          payload: err.message,
        });
      });
  };

  useEffect(() => {
    // checks if 5 minutes have elapsed since the last call to the api
    // this check is initiated so that the limit the api usage
    // let checkToCallApi = true;
    // const timediffToCallApi = sessionStorage.getItem("timediffToCallApi");
    // if (timediffToCallApi) {
    //   const currTime = new Date().getTime();
    //   let timeDiff = (currTime - timediffToCallApi) / 1000;
    //   timeDiff /= 60;
    //   timeDiff = Math.abs(Math.round(timeDiff));
    //   console.log(timeDiff);
    //   if (timeDiff > 5) {
    //     sessionStorage.setItem("timediffToCallApi", new Date().getTime());
    //     checkToCallApi = true;
    //   } else {
    //     const apiData = JSON.parse(sessionStorage.getItem("apiData"));
    //     dispatch({
    //       type: "REQUEST_FULFILLED",
    //       isLoading: false,
    //       payload: apiData,
    //     });
    //     console.log("Donot call API ", timeDiff);
    //     checkToCallApi = false;
    //   }
    // } else {
    //   sessionStorage.setItem("timediffToCallApi", new Date().getTime());
    //   checkToCallApi = true;
    // }
    fetchDailyDataHandler();
  }, [basicApiData]);

  if (isLoading) {
    return <Spinner />;
  } else if (error) {
    return <>Error</>;
  } else {
    return (
      <>
        <Box
          id="daily-weather-container"
          sx={{
            padding: "0.7rem 0.1rem",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            alignItems: "center",
            position: "relative",
            border: "3px solid rgba(20,20,40,0.8)",
            borderRadius: "4px",
            background: "linear-gradient(45deg, white, transparent)",
            margin: "1rem 0",
            "&:before": {
              content: '"Daily Weather Forecast"',
              position: "absolute",
              top: "-10px",
              left: "10px",
              backgroundColor: "white",
            },
          }}
        >
          {dailyData.map((currVal, index) => {
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  lineHeight: "1.3rem",
                  fontSize: "0.9rem",
                  background:
                    "linear-gradient(to bottom, rgb(223, 191, 30), rgb(248, 229, 129 ), white)",
                  padding: "0.7rem 0.3rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                <img
                  style={{ width: "50px", height: "50px" }}
                  src={currVal.weatherCode}
                  alt="Not Found"
                />
                <span>{currVal.weatherName}</span>
                <span>
                  {currVal.maxTemp}&deg;C| {currVal.minTemp}&deg;C
                </span>
                <span>{currVal.date}</span>
              </Box>
            );
          })}
        </Box>
      </>
    );
  }
};

export default DailyWeatherDeatils;
