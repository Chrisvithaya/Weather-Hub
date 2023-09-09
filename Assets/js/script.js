$(document).ready(function () {
  var apiKey = "83abb9bd71a6d989fa143b8834121117";

  var cityEl = $("h2#city");
  var dateEl = $("h3#date");
  var weatherIconEl = $("img#weather-icon");
  var temperatureEl = $("span#temperature");
  var humidityEl = $("span#humidity");
  var windEl = $("span#wind");
  var uvIndexEl = $("span#uv-index");
  var cityListEl = $("div.cityList");

  var cityInput = $("#city-input");

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
    const savedCities = JSON.parse(localStorage.getItem("previousCities"));
    if (savedCities) {
      previousCities = savedCities;
    }
  }

  function storeCities() {
    localStorage.setItem("previousCities", JSON.stringify(previousCities));
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
      let cityDiv = $("<div>").addClass("col-12 city");
      let cityBtn = $("<button>")
        .addClass("btn btn-light city-btn")
        .text(location.city);
      cityDiv.append(cityBtn);
      cityListEl.append(cityDiv);
    });
  }

  function searchWeather(queryURL) {
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // Store current city in past cities
      let city = response.name;
      let id = response.id;

      if (previousCities[0]) {
        previousCities = $.grep(previousCities, function (storedCity) {
          return id !== storedCity.id;
        });
      }
      previousCities.unshift({ city, id });
      storeCities();
      displayCities(previousCities);

      cityEl.text(response.name);
      let formattedDate = moment.unix(response.dt).format("L");
      dateEl.text(formattedDate);
      let weatherIcon = response.weather[0].icon;
      weatherIconEl
        .attr("src", `http://openweathermap.org/img/wn/${weatherIcon}.png`)
        .attr("alt", response.weather[0].description);
      temperatureEl.html(((response.main.temp - 273.15) * 1.8 + 32).toFixed(1));
      humidityEl.text(response.main.humidity);
      windEl.text((response.wind.speed * 2.237).toFixed(1));

      let lat = response.coord.lat;
      let long = response.coord.long;
      let queryURLAll = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&long=${long}&appid=${apiKey}`;

      $.ajax({
        url: queryURLAll,
        method: "GET",
      }).then(function (response) {
        let uvIndex = response.current.uvi;
        let uvColor = setUVIndexColor(uvIndex);
        uvIndexEl.text(response.current.uvi);
        uvIndexEl.attr(
          "style",
          `background-color: ${uvColor}; color: ${
            uvColor === "yellow" ? "black" : "white"
          }`
        );
        let fiveDay = response.daily;

        // Display 5 day forecast in DOM elements
        for (let i = 0; i <= 5; i++) {
          let currDay = fiveDay[i];
          $(`div.day-${i} .card-title`).text(
            moment.unix(currDay.dt).format("L")
          );
          $(`div.day-${i} .fiveDay-img`)
            .attr(
              "src",
              `http://openweathermap.org/img/wn/${currDay.weather[0].icon}.png`
            )
            .attr("alt", currDay.weather[0].description);
          $(`div.day-${i} .fiveDay-temp`).text(
            ((currDay.temp.day - 273.15) * 1.8 + 32).toFixed(1)
          );
          $(`div.day-${i} .fiveDay-humid`).text(currDay.humidity);
        }
      });
    });
  }

  function displayLastSearchedCity() {
    if (previousCities[0]) {
      let queryURL = buildURLFromId(previousCities[0].id);
      searchWeather(queryURL);
    } else {
      let queryURL = buildURLFromInputs("Detroit");
      searchWeather(queryURL);
    }
  }

  $("#search-btn").on("click", function (event) {
    event.preventDefault();

    let city = cityInput.val().trim();
    city = city.replace(" ", "%20");

    cityInput.val("");

    if (city) {
      let queryURL = buildURLFromInputs(city);
      searchWeather(queryURL);
    }
  });

  $(document).on("click", "button.city-btn", function (event) {
    let pressedCity = $(this).text();
    let foundCity = $.grep(previousCities, function (storedCity) {
      return pressedCity === storedCity.city;
    });
    let queryURL = buildURLFromId(foundCity[0].id);
    searchWeather(queryURL);
  });

  // load any cities in local storage into array
  loadCities();
  displayCities(previousCities);

  // Display weather for last searched city
  displayLastSearchedCity();
});
