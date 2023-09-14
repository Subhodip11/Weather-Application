import axios from "axios"
import fileNameDict from "./fileNames";

export const getCurrentLocation = ()=>{
    return new Promise((resolve, reject)=>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position)=>{
             resolve({lat: position.coords.latitude, lon: position.coords.longitude})
            });
        }else{
            reject("Geolocation is not available")
        }    
    })   
}

export const getSearchLocationDetails = async (placeName, apiKey, setOptionsFieldForPlace) => {
    let placeDetails=null
  console.log(placeName)
  
  if(placeName !== '' && placeName){
    placeDetails = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${placeName}&limit=5&appid=${apiKey}`
    );
    const convertToOptionLabelForm = placeDetails.data.reduce((acc, curr, index)=>{
      const checkIfPlaceExist = acc.find((place) => place.label===curr.name)
      // console.log(checkIfPlaceExist)
      if(!checkIfPlaceExist)
      return [...acc, {"label": curr.name, "id": index}]
      else
      return [...acc]
    }, [])
    setOptionsFieldForPlace(currVal=>currVal=convertToOptionLabelForm)
    // console.log(convertToOptionLabelForm)
  }
  return placeDetails;
}

export function retrieveCurrentDayData(data) {
    // console.log(data)
    //This function retrieves current day weather report
    let currDate = new Date().toISOString().split("T")[0]
    let totalList = data.list;
    let hourlyList = []
    
    for(let i=0;i<totalList.length;i++){
        let tempDate = totalList[i].dt_txt.split(" ")[0]
        
        if(currDate === tempDate){
            hourlyList.push(totalList[i])
        }
        else{
            break;
        }
    }
    return hourlyList;

}

export const retriveDailyData = (hourlyWeatherDataList) => {
    let dailyWeatherDataMap = new Map();
    hourlyWeatherDataList.forEach((ele) => {
        // console.log(ele)
        const weatherDate = ele.dt_txt.split(" ")[0]
        if(dailyWeatherDataMap.has(weatherDate)){
            // console.log(dailyWeatherDataMap.get(weatherDate))
            dailyWeatherDataMap.set(weatherDate, [...dailyWeatherDataMap.get(weatherDate), ele])
        }else{
            dailyWeatherDataMap.set(weatherDate, new Array(ele))
        }
    })
    // dailyWeatherDataMap.keys()
    return dailyWeatherDataMap
}

export const filterEssentialFieldsAndFormat = (dailyDataList) => {
    let resData = []
    
    for(let i = 0; i < dailyDataList.length; i++){
        const { time, values } = dailyDataList[i];
        const date = new Date(time).toDateString().split(" ");
        const maxTemp = values.temperatureMax, minTemp = values.temperatureMin;
        const weather_icon_info = fileNameDict[values.weatherCodeMax+"0"]
        resData.push({
            date: date[2]+", "+date[0], month: date[1], weatherCode: weather_icon_info.weatherCode, weatherName: weather_icon_info.weatherName, maxTemp, minTemp
        })
        // console.log(date.toDateString())
    }

    return resData;
}

export const chartConfig = (hourlyList, type) => {
    let typeList = null
    console.log(type)
    switch(type){
        
    case 'main':
        typeList = {data: hourlyList.map((weatherEle)=>{
            return (weatherEle.main.temp - 273.15).toFixed(2)
        }), label: "Temperature in Celsius"}
        break;
    case 'wind':
        typeList = {data: hourlyList.map((weatherEle)=>{
            return (weatherEle.wind.speed * 2.23694).toFixed(2)
        }), label: "Wind in mph"}
        break;
    case 'cloud':
        typeList = {data: hourlyList.map((weatherEle)=>{
            return weatherEle.clouds.all
        }), label: "Cloudiness in percentage"}
        break;
    case 'rain':
        typeList = {
            data: hourlyList.map(weatherEle=>{
                return weatherEle.rain?weatherEle.rain['3h']:0
            }),
            label: 'Rain in mm'}
        break;
    case 'precipitation':
            typeList = {
                data: hourlyList.map(weatherEle=>{
                    return weatherEle.pop?weatherEle.pop*100:0
                }),
                label: 'Precipitation in %'}
        break;
    default:
        throw new Error("Mapping not found for the route")
    }
     

    const weatherDetailTime = hourlyList.map((weatherEle, index)=>{
        const timeIn24HourFormat = weatherEle.dt_txt.split(" ")[1];
        const extractTimePart = timeIn24HourFormat.split(":");
        const hours = parseInt(extractTimePart[0])
        const timeIn12HourFormat = hours === 12 ?(hours+":"+extractTimePart[1]+"P.M") : (hours<12?(hours+":"+extractTimePart[1]+"A.M"): ((parseInt(extractTimePart[0])-12)+":"+extractTimePart[1]+"P.M"));

        return timeIn12HourFormat 
    })

    

    const config = {
    data: {
        labels: weatherDetailTime,
        datasets: [{
          label: typeList.label,
          data: typeList.data,
          fill: true,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          tension: 0.1
        }]
      }
    }

    return config
}