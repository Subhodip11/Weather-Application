import React, { useEffect, useReducer, useState } from "react";
import "../styles/HourlyDataChart.css";
import {
  chartConfig,
  retrieveCurrentDayData,
  retriveDailyData,
} from "../helper";
import { fetchHourlyData } from "../utils";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Spinner from "./Spinner";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const initialState = {
  isLoading: true,
  weatherDataMap: [],
  error: null,
};

const hourlyDataReducer = (state, { type, payload }) => {
  switch (type) {
    case "REQUEST_PENDING":
      return { ...state, isLoading: true };
    case "REQUEST_FULFILLED":
      return {
        ...state,
        isLoading: false,
        weatherDataMap: payload,
      };
    case "REQUEST_ERROR":
      return { ...state, error: payload };
    default:
      throw new Error("Action type mapping not in list");
  }
};

const HourlyDataChart = ({ apiKey, basicApiData, type }) => {
  const [{ isLoading, weatherDataMap, error }, dispatch] = useReducer(
    hourlyDataReducer,
    initialState
  );

  const [chartDate, setChartDate] = useState(null);
  const [config, setConfig] = useState(null);
  const [chartType, setChartType] = useState("Line Chart");

  const fetchHourlyDataHandler = () => {
    // console.log("hourly data", basicApiData);
    fetchHourlyData(apiKey, basicApiData, dispatch)
      .then((data) => {
        // console.log(data);
        const hourlyList = retrieveCurrentDayData(data);
        const dataMap = retriveDailyData(data.list);
        // console.log(dataMap);
        if (chartDate) setConfig(chartConfig(dataMap.get(chartDate), type));
        else setConfig(chartConfig(hourlyList, type));
        dispatch({
          type: "REQUEST_FULFILLED",
          isLoading: false,
          payload: dataMap,
        });
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
    fetchHourlyDataHandler();
  }, [chartDate, type]);

  if (isLoading) {
    return <Spinner />;
  } else if (error) {
    return <>{error}</>;
  } else {
    const handleChange = (event, newValue) => {
      const selectedDate = event.target.value;
      setChartDate(selectedDate);
      console.log(weatherDataMap.get(selectedDate));
    };
    return (
      <Container
        sx={{
          backgroundColor: "white",
          "@media screen and (max-width: 700px)": {
            margin: "0 auto",
            width: "80%",
          },
        }}
        maxWidth="sm"
      >
        <Box
          sx={{
            margin: "0 auto",
            minWidth: "50%",
            width: "80%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">Select Date</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Date"
              value={chartDate}
              onChange={handleChange}
            >
              {[...weatherDataMap.keys()].map((key, index) => (
                <MenuItem key={index} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">
              Select Chart Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Chart Type"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <MenuItem value="Line Chart">Line Chart</MenuItem>
              <MenuItem value="Bar Chart">Bar Chart</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {chartType === "Line Chart" ? (
          <Box>
            <Line {...config} color="white" />
          </Box>
        ) : null}
        {chartType === "Bar Chart" ? (
          <Box>
            <Bar {...config} />
          </Box>
        ) : null}
      </Container>
    );
  }
};

export default HourlyDataChart;
