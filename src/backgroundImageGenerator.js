import axios from "axios";

const unsplashApikKey = process.env.REACT_APP_UNSPLASH_API_KEY;

async function generateImage(weatherData){
    const query = weatherData.weather[0].description;
    
    const apiEndpoint = `https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=${unsplashApikKey}`
    
    const response = await axios.get(apiEndpoint);

    //getting the most liked image from the response
    let maxLikes = Number.MIN_VALUE, bestBgImage = null, resdata = response.data.results;
    
    for(let i = 0; i < resdata.length; i++){
        if(resdata[i].likes && (maxLikes <= resdata[i].likes)){
            maxLikes = resdata[i].likes;
            bestBgImage = resdata[i].urls.raw
        }
    }
    
    return bestBgImage; 
}

export default generateImage
