import React from "react";
import "../styles/BasicWeatherDetails.css";
import { Box } from "@mui/material";
import { TbTemperatureCelsius } from "react-icons/tb";
import {
  WiHumidity,
  WiSunrise,
  WiSunset,
  WiCloudyGusts,
  WiDegrees,
} from "react-icons/wi";
import { SiSpeedtest } from "react-icons/si";
import { Directions } from "@mui/icons-material";

const displayFlexDefault = {
  display: "flex",
  alignItems: "center",
};

const BasicWeatherDetails = ({ weatherData }) => {
  const convertToCelsius = (temp) => (temp - 273.15).toFixed(2);
  const convertEpochToTimestamp = (epoch) => {
    const dateObj = new Date(epoch * 1000);
    return `${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}`;
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "max-content",
        margin: "0 auto",
        filter: "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07));",
        backgroundColor: "rgb(255, 255, 255, 0.6)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "1rem 0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <img
            style={{
              width: "140px",
              height: "120px",
              filter: "drop-shadow(0 0 5px #444444)",
              transform: "perspective(400px)",
              alignSelf: "center",
            }}
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt=""
          />
          <Box
            sx={{
              display: "flex",
              marginTop: "-20px",
              fontFamily: "fantasy",
              letterSpacing: "1px",
              fontSize: "1.2rem",
              width: "fit-content",
            }}
          >
            <span style={{ marginRight: "7px" }}>{weatherData.name}, </span>
            <span style={{ display: "flex", alignItems: "center" }}>
              {convertToCelsius(weatherData.main.temp)}
              <TbTemperatureCelsius />
            </span>
          </Box>
        </Box>
        <Box
          sx={{
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Box sx={{ lineHeight: "1.5rem" }}>
            <Box>
              <span>{weatherData.weather[0].main}</span>,&nbsp;
              <span>{weatherData.weather[0].description}</span>
            </Box>
            <Box>
              Feels like ~ {convertToCelsius(weatherData.main.feels_like)}
              <TbTemperatureCelsius />
            </Box>
            <Box>
              <span style={{ ...displayFlexDefault }}>
                Humidity ~ {weatherData.main.humidity}
                <WiHumidity size={20} />
              </span>
            </Box>
            <Box>
              <span>Pressure - {weatherData.main.pressure} hpa</span>
            </Box>
            <Box>
              <span>Sea Level - {weatherData.main.sea_level}</span>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              fontSize: "0.95rem",
            }}
          >
            {/* Wind details */}
            {weatherData.wind.speed && (
              <span>
                Wind <SiSpeedtest /> - {weatherData.wind.speed} mph
              </span>
            )}
            {weatherData.wind.deg && (
              <span style={{ display: "flex", alignItems: "center" }}>
                Wind <Directions fontSize="10" /> - {weatherData.wind.deg}{" "}
                <WiDegrees size={30} style={{ marginLeft: "-10px" }} />
              </span>
            )}
            {weatherData.wind.gust && (
              <span>
                Gust <WiCloudyGusts /> - {weatherData.wind.gust} mph
              </span>
            )}
            <span style={displayFlexDefault}>
              <WiSunrise color="#E67451" size={20} /> -{" "}
              {convertEpochToTimestamp(weatherData.sys.sunrise)}
            </span>
            <span style={displayFlexDefault}>
              <WiSunset color="#FAD6A5" size={20} /> -{" "}
              {convertEpochToTimestamp(weatherData.sys.sunset)}
            </span>
          </Box>
        </Box>
      </Box>
      {/* Longitude - {weatherData.coord.lon}
      Latitude - {weatherData.coord.lat}
      Place Name - {weatherData.name} */}
    </Box>
  );
};

export default BasicWeatherDetails;
