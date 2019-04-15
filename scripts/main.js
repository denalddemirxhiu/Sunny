// Secret Key
var secretKey = "3081b6193ea6e4470000e30fedfd4f2f";

$(document).ready(function() {

});


/****
 * Darksky weather info
 */

// $(document).ready(function() {
//     $.ajax({
//         url: "https://api.darksky.net/forecast/3081b6193ea6e4470000e30fedfd4f2f/37.8267,-122.4233",
//         dataType: 'jsonp',
//         success: function(resp) {
//             console.log(resp);
//         }
//     });
// });

/******
 * Geocoding
 */
// $(document).ready(function() {
//     $.ajax({
//         url: "https://geocode.xyz/?locate=Tirana&json=1",
//         dataType: 'jsonp',
//         success: function(resp) {
//             console.log(resp);
//         }
//     });
// });

/******************************************************
 * 
 * Function that gets the latitude and longitude 
 * of a specific location. Carries an API call to
 * geocode.xyz
 * 
 **/

function getLatAndLong(location) {

    var errorDisplay = $('#error'); // Error Box
    errorDisplay.hide(); // Hide it
    // Request URL we need to build
    var urlBuilder = "https://geocode.xyz/?locate=" + location + "&json=1";
    
    $.ajax({
        url: urlBuilder,
        dataType: 'jsonp',
        success: function(resp) {
            // If there was an error show it in a container
            if(resp.error) {
                errorDisplay.text(resp.error.description);
                errorDisplay.show();
            } else {
                // Use the data returned from the api call
                console.log(resp);
                $("#locationText").text(resp.standard.city + ",  " + resp.standard.countryname);
                displayWeatherData(resp.latt, resp.longt);
            }
            
        }
    });
}

function displayWeatherData(lat, long) {
    var apiURL = "https://api.darksky.net/forecast/3081b6193ea6e4470000e30fedfd4f2f/" + lat + "," + long;
    
    $.ajax({
        url: apiURL,
        dataType: 'jsonp',
        success: function(resp) {
            console.log(resp);
            updateConditionsNow(resp.currently);
            updateUpcomingConditions(resp.daily.data);
            $('#nowBox').show();
        }
    });
}

function updateConditionsNow(currently) {
    $('#conditionSummary').text(currently.summary);
    $('#conditionSummary').text(currently.summary);

    $('#currentTempData').html(convertToCelsius(currently.temperature)+ " &#8451;");
    $('#feelsLikeData').html(convertToCelsius(currently.apparentTemperature) + " &#8451;");
    $('#dewPointData').text(currently.dewPoint);
    $('#uvIndexData').text(currently.uvIndex);
    $('#visibilityData').text(currently.visibility);

    var skycons = new Skycons({"color": "#5379FF"});
    skycons.add("conditionNow", currently.icon);
    skycons.play();
}

function updateUpcomingConditions(daily) {
    // Clear previous contents of the block
    var upcomingBlock = document.getElementById("upcomingBlock")
    while(upcomingBlock.firstChild) {
        upcomingBlock.removeChild(upcomingBlock.firstChild);
    }

    // Update the block
    for(var i = 1; i < daily.length; i++) {
        createCard(daily[i]);
    }

    var nowBox = document.getElementById('nowBox').setAttribute('style', "display:inline-block;");
    $('#nextFewDaysBox').show();
}


function searchButtonClicked() {
    var location = $('#location').val();

    if(location !== "") {
        getLatAndLong(location);
    }
    
}

function createCard(weatherData) {
    console.log(weatherData);
    var upcomingBlock = document.getElementById("upcomingBlock");

    var card = document.createElement("div");
    card.setAttribute("class", "cardContent");

    var weatherCanvas = document.createElement("canvas");
    weatherCanvas.setAttribute("width", "100");
    weatherCanvas.setAttribute("height", "100");
    weatherCanvas.setAttribute("id", weatherData.time.toString());

    var utcSeconds = weatherData.time;
    var d = new Date(0);
    d.setUTCSeconds(utcSeconds);
    var date = document.createElement("h2");
    date.setAttribute("id", "date");
    date.innerHTML = formatDate(d);

    var condition = document.createElement("p");
    condition.setAttribute("id", "condition");
    condition.innerHTML = weatherData.summary;

    var temp = document.createElement("div");
    temp.setAttribute("class", "temperature");
    
    var tempValue = document.createElement("p");
    tempValue.setAttribute("id", "temperatureValue");
    tempValue.innerHTML = convertToCelsius(weatherData.temperatureLow) + " &#8451;";

    temp.appendChild(tempValue);

    card.appendChild(weatherCanvas);
    card.appendChild(date);
    card.appendChild(temp);
    card.appendChild(date);
    card.appendChild(temp);
    card.appendChild(condition);

    upcomingBlock.appendChild(card);

    var skycons = new Skycons({"color": "white"});
    skycons.add(weatherData.time.toString(), weatherData.icon);
    skycons.play();
}

function formatDate(date) {
    var dateToday = new Date();
    if(date.getDay() - dateToday.getDay() === 1) {
        return "Tomorrow";
    }

    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
  
    var day = date.getDate();
    var monthIndex = date.getMonth();
  
    return monthNames[monthIndex] + ' ' + day;
}

function convertToCelsius(fahrenheit) {
    return Math.floor((fahrenheit - 32) * 5 / 9);
}
  