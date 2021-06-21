const apiKey = "5a49e5482026f6ec21745ae268488b47";
const cityBoxEl = document.getElementById("city-box");
const citySubmitEl = document.getElementById("city-submit");

citySubmitEl.addEventListener("click", (event) => {
    event.preventDefault();
    let cityName = cityBoxEl.value;
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    fetch(weatherURL)
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {
        console.log(data),
        drawWeather(data),
        getUVI(data);
        // getFiveDay(data);
     })
//   .catch(function() { // catch any errors
//   })
});

function drawWeather(data) {
	var celsius = Math.round(parseFloat(data.main.temp)-273.15);
	var fahrenheit = Math.round(((parseFloat(data.main.temp)-273.15)*1.8)+32); 
	var description = data.weather[0].description;
    var icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    var date = new Date().toLocaleString();
    var mphWind = Math.round(parseFloat(data.wind.speed)*2.23894)

	document.getElementById('forecast-heading').innerHTML = "Current Forecast:";
    document.getElementById('location').innerHTML = "Location: " + data.name + ", " + data.sys.country + ".";
    document.getElementById('date').innerHTML = "Date: " + date;
	document.getElementById('temp').innerHTML = "Temperature: " + celsius + "&deg;" + "C (" + fahrenheit + "&deg;" + "F)";
	$(`#icon`).html(`<img src="${icon}">`);
    document.getElementById('description').innerHTML = "Description: " + description.charAt(0).toUpperCase() + description.slice(1) + ".";
    document.getElementById('humidity').innerHTML = "Humidity: " + data.main.humidity + "%";
    document.getElementById('wind-speed').innerHTML = "Wind Speed: " + data.wind.speed + " m/s (" + mphWind + " mph)";
    //UV-Index: "The product retired on 1st April 2021, please find UVI data in One Call API" ~https://openweathermap.org/api
    //document.getElementById('UV-index').innerHTML = "UV-Index: " + ;
    
	
// 	if( description.indexOf('rain') > 0 ) {
//   	document.body.className = 'rainy';
//   } else if( description.indexOf('cloud') > 0 ) {
//   	document.body.className = 'cloudy';
//   } else if( description.indexOf('sunny') > 0 ) {
//   	document.body.className = 'sunny';
//   }
}

function getUVI(data) {
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    var part = "minutely, hourly, alerts"

    const oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${apiKey}`;

    console.log("lat/lon: " + lat + ", " + lon)

    fetch(oneCallURL)
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {
        console.log(data),
        document.getElementById('UV-index').innerHTML = "UV-Index: " + data.current.uvi;
     })
}

// function getFiveDay(data) {
    
//forEach(element)

//}


// }