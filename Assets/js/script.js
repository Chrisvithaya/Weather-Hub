$(document).ready(function () {

var apiKey = 'e5f8c29eda1bbcc8fecf3d7df7662e65'

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