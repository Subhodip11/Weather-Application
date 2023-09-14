import axios from "axios";
import { getCurrentLocation, getSearchLocationDetails } from "./helper.js";
import generateImage from "./backgroundImageGenerator.js"

export const reducer = (state, action) => {
    switch (action.type) {
      case "REQUEST_PENDING":
        return { ...state, isLoading: true };
      case "REQUEST_FULFILLED":
        return { ...state, isLoading: false, weatherData: action.payload.data, basicApiData: {lat: action.payload.latitude, lon: action.payload.longitude} };
      case "REQUEST_ERROR":
        return { ...state, error: action.payload };
      default:
        throw new Error("Action type mapping not in list");
    }
  };
  
export async function fetchData(dispatch, placeName, apiKey, setOptionsFieldForPlace) {
  dispatch({ type: "REQUEST_PENDING", isLoading: true });
  let placeDetails= await getSearchLocationDetails(placeName, apiKey, setOptionsFieldForPlace);
  let lat = '', lon = '';
  let getloc = await getCurrentLocation();
  // console.log(getloc)
  lat = placeDetails && placeDetails.data.length>0 ? placeDetails.data[0]["lat"]: getloc.lat;
  lon = placeDetails && placeDetails.data.length>0 ? placeDetails.data[0]["lon"]: getloc.lon;
  
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=95a46330d145ac87bc7c3c50eb56a123`
  );
// console.log(response.data)
  const getBackgroundImage = await generateImage(response.data);

  return {data: response.data, latitude: lat, longitude: lon, backgroundImageURL: getBackgroundImage};
}

export const fetchHourlyData = async (apiKey, basicApiData, dispatch) => {

  dispatch({ type: "REQUEST_PENDING", isLoading: true });
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${basicApiData.lat}&lon=${basicApiData.lon}&appid=${apiKey}`
  );
  return response.data;
  
};

