const apiKey = "5a49e5482026f6ec21745ae268488b47";
const cityBoxEl = document.getElementById("city-box");
const citySubmitEl = document.getElementById("city-submit");

citySubmitEl.addEventListener("click", (event) => {
    event.preventDefault();
    let cityName = cityBoxEl.value;
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    // reset five-day-forecast cards on click
    $(".fd").remove();

    // call API and begin weather and location print
    fetch(weatherURL)
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {
        console.log(data),
        drawWeather(data),
        getUVI(data); //required to get deprecated API functionality
     })
//   .catch(function() { // catch any errors
//   })
});

function drawWeather(data) {
	var celsius = Math.round(parseFloat(data.main.temp)-273.15);
	var fahrenheit = Math.round(((parseFloat(data.main.temp)-273.15)*1.8)+32); 
	var description = data.weather[0].description;
    var icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    var date = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60000 + (1000*data.timezone)).toLocaleString();
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
    //Would use:
    //document.getElementById('UV-index').innerHTML = "UV-Index: " + var;
    //Used One Call API instead.

//     if( description.includes("rain") == true ) {
//         document.html.className = 'rainy';
//     } else if( description.includes("cloud") == true ) {
//         document.html.className = 'cloudy';
//     } else if( description.includes("sun") == true) {
//         document.html.className = 'sunny';
//     }
 }


// calls second API to get the rest of the data
function getUVI(data) {
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    var part = "minutely, hourly, alerts"

    const oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${apiKey}`;

    console.log("lat/lon: " + lat + ", " + lon)

    fetch(oneCallURL)
    .then(function(resp) { return resp.json() }) // convert data to json
    .then(function(data) {
        console.log(data),
        document.getElementById('UV-index').innerHTML = "UV-Index: " + data.current.uvi,
        // triggers event to reset the search box
        $("form").trigger('reset'),
        // creates the five day summary with the rest of the data
        getFiveDay(data);
     })
}

function getFiveDay(data) {
    var fiveDayForecastEl = document.getElementById("bottom-col");
    
    
    var fdHeaderEl = document.createElement("div");
    fdHeaderEl.className = "fd-heading fd";
    fdHeaderEl.id = "fd-heading";
    fdHeaderEl.innerHTML = "Five Day Forecast:";
    fiveDayForecastEl.append(fdHeaderEl);
    
    
    for (var i=0; i<5; i++) {
        var cardEl = document.createElement("div");
        cardEl.className = "fd-card fd";
        cardEl.id = "fd-card-" + (i + 1);
        fiveDayForecastEl.appendChild(cardEl);

        var dateEl = document.createElement("div");
        dateEl.id = "fd-date-" + (i + 1);
        var dateIncre = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60000 + (1000*data.timezone_offset) + 86400000*(i+1) ).toLocaleString();
        var cardDate = dateIncre.split(",");
        dateEl.innerHTML = "Date: " + cardDate[0];
        cardEl.appendChild(dateEl);

        var tempEl = document.createElement("div");
        tempEl.id = "fd-temp-" + (i + 1);
        var celsius = Math.round(parseFloat(data.daily[i].temp.day)-273.15);
	    var fahrenheit = Math.round(((parseFloat(data.daily[i].temp.day)-273.15)*1.8)+32); 
        tempEl.innerHTML = "Temp: " + celsius + "&deg;" + "C (" + fahrenheit + "&deg;" + "F)";
        cardEl.appendChild(tempEl);

        var iconEl= document.createElement("div");
        iconEl.id = "fd-icon-" + (i + 1);
        //TD fix URL
        var icon = `http://openweathermap.org/img/wn/${data.daily[0].weather[0].icon}@2x.png`;
        $(`iconEl.id`).html(`<img src="${icon}">`);
        cardEl.appendChild(iconEl);

        var descriptionEl= document.createElement("div");
        descriptionEl.id = "fd-description-" + (i + 1);
        description = data.daily[i].weather[0].description;
        descriptionEl.innerHTML = description.charAt(0).toUpperCase() + description.slice(1) + ".";
        cardEl.appendChild(descriptionEl);

        var humidityEl= document.createElement("div");
        humidityEl.id = "fd-humidity-" + (i + 1);
        humidityEl.innerHTML = "Hum: " + data.daily[i].humidity + "%";
        cardEl.appendChild(humidityEl);

        var windSpeedEl= document.createElement("div");
        windSpeedEl.id = "fd-wind-speed-" + (i + 1);
        var mphWind = Math.round(parseFloat(data.daily[i].wind_speed)*2.23894)
        windSpeedEl.innerHTML = "Wind: " + data.daily[i].wind_speed + "m/s (" + mphWind + "mph)";
        cardEl.appendChild(windSpeedEl);

        var UVIndexEl= document.createElement("div");
        UVIndexEl.id = "fd-date-UVI-" + (i + 1);
        UVIndexEl.innerHTML = "UVI: " + data.daily[i].uvi;
        cardEl.appendChild(UVIndexEl);
    }  
}
