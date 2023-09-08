// // API Key
var apiKey = 'e5f8c29eda1bbcc8fecf3d7df7662e65'

var searchBtnEl = document.querySelector('.search-button');
var citiesListEl = document.querySelector(".cities-list");
var inputEl = document.querySelector('.input');

var cityName = localStorage.getItem('cityNameStore');

var URLWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + '&units=imperial' + apiKey;
var URLForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + '&units=imperial' + apiKey;

