import React from "react";
import { Container } from "@mui/material";
import BasicWeatherDetails from "./BasicWeatherDetails";
import DailyWeatherDeatils from "./DailyWeatherDeatils";

const WeatherContainer = ({ weatherData, apiKey, basicApiData }) => {
  return (
    <Container maxWidth="md">
      <BasicWeatherDetails weatherData={weatherData} />
      <DailyWeatherDeatils basicApiData={basicApiData} />
    </Container>
  );
};

export default WeatherContainer;
