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

function loadCities() {
    const savedCities = JSON.parse(localStorage.getItem('previousCities'));
    if (savedCities) {
        previousCities = savedCities;
    }
}

function storeCities() {
    localStorage.setItem('previousCities', JSON.stringify(previousCities));
}

function buildURLFromInputs(city) {
    if (city) {
        return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    }
}

function buildURLFromId(id) {
    return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`;
}

function displayCities(previousCities) {
    cityListEl.empty();
    previousCities.splice(5);
    let sortedCities = [...previousCities];
    sortedCities.sort(compare);
    sortedCities.forEach(function (location) {
        let cityDiv = $('<div>').addClass('col-12 city');
        let cityBtn = $('<button>').addClass('btn btn-light city-btn').text(location.city);
        cityDiv.append(cityBtn);
        cityListEl.append(cityDiv);
    });
}