$(document).ready(function () {

var apiKey = '83abb9bd71a6d989fa143b8834121117'

var cityEl = $('h2#city');
var dateEl = $('h3#date');
var weatherIconEl = $('img#weather-icon');
var temperatureEl = $('span#temperature');
var humidityEl = $('span#humidity');
var windEl = $('span#wind');
var uvIndexEl = $('span#uv-index');
var cityListEl = $('div.cityList');

var cityInput = $('#city-input');

let previousCities = [];

function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const cityA = a.city.toUpperCase();
    const cityB = b.city.toUpperCase();

    let comparison = 0;
    if (cityA > cityB) {
        comparison = 1;
    } else if (cityA < cityB) {
        comparison = -1;
    }
    return comparison;
}

