import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import "../styles/NavigationStyle.css";
import { FaTemperatureHigh } from "react-icons/fa";
import { BsCloudRain, BsCloudRainHeavyFill, BsWind } from "react-icons/bs";
import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <Box margin={2} display="flex" justifyContent="center">
      <BottomNavigation
        sx={{ width: "fit-content", height: "fit-content", padding: "1rem" }}
      >
        <Link to="/">
          <BottomNavigationAction
            className="bottom-nav"
            showLabel
            label="Temperature"
            icon={<FaTemperatureHigh />}
          />
        </Link>
        <Link to="/cloudiness">
          <BottomNavigationAction
            className="bottom-nav"
            showLabel
            label="Cloudiness"
            icon={<BsCloudRainHeavyFill />}
          />
        </Link>
        <Link to="/wind">
          <BottomNavigationAction
            className="bottom-nav"
            showLabel
            label="Wind"
            icon={<BsWind />}
          />
        </Link>
        <Link to="/rain">
          <BottomNavigationAction
            className="bottom-nav"
            showLabel
            label="Rain"
            icon={<BsCloudRain />}
          />
        </Link>
        <Link to="/precipitation">
          <BottomNavigationAction
            className="bottom-nav"
            showLabel
            label="Precipitation"
            icon={<BsCloudRain />}
          />
        </Link>
      </BottomNavigation>
    </Box>
  );
};

export default Navigation;
