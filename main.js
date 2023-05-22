/*
MAIN TO-DO: 

- Lighthouse testing and accesibiliy testing
  Create a proxy server to host the application on using Node and Express.
- Upload app to the internet.
*/

import {
  formatDate,
  getWeathercodeText,
  getNightWeather,
  getBeaufortWind,
  getAirQuality,
} from "./functions.js";

// defining and creating some of our dynamic HTML elements
let currentDay = new Date(); // so we can work with time easier.

//get desired latitude and longitude, timezone
let latitude = 45.81;
let longitude = 15.98;
let city_info = null;
let user_timezone = "timezone=auto";

// Introductory info and current european air quality index.
let timezone_para = document.createElement("p");
timezone_para.setAttribute("id", "timezone-para");
let main_introduction = document.getElementById("main-introduction");
let introduction_info = "Zagreb, Croatia";

// default city information(Zagreb)
let current_population = document.getElementById("introduction_population");
let current_elevation = document.getElementById("introduction_elevation");
current_elevation.textContent = "Elevation: 158m";
current_population.textContent = "Population: 1.1M";

// append the air qual elements to a parent div, inside introductory info.
let current_air = document.createElement("p");
let current_air_icon = document.createElement("div");
current_air_icon.setAttribute("class", "circle");

// current conditions card
let weathercode_icon = document.createElement("img");
weathercode_icon.setAttribute("class", "weathercode-icon");
weathercode_icon.setAttribute("id", "weathercode-icon");
weathercode_icon.style = "padding-right: 10px";

let current_temp = document.getElementById("current-temp");

let current_windspeed = document.getElementById("current-windspeed");
let current_windspeed_icon = document.createElement("img");
current_windspeed_icon.setAttribute("class", "current_windspeed_icon");

let current_humidity = document.getElementById("current-humidity");

let current_visibility = "";
let current_visibility_kilometers =
  document.getElementById("current-visibility");

let myVideo = document.getElementById("my-video");
const source = myVideo.querySelector("source");

// creating the 3-day forecast cards starting from TODAY.
let today_icon = document.createElement("img");
let today_date = document.createElement("p");
let today_minmax = document.createElement("p");
let today_precipitation = document.createElement("p");
let today_windspeed = document.createElement("p");
let today_windspeed_icon = document.createElement("img");
today_windspeed_icon.setAttribute("class", "today_windspeed_icon");
let today_sunriseSunset = document.createElement("p");

//tomorow
let tomorow_icon = document.createElement("img");
let tomorow_date = document.createElement("p");
let tomorow_minmax = document.createElement("p");
let tomorow_precipitation = document.createElement("p");
let tomorow_windspeed = document.createElement("p");
let tomorow_windspeed_icon = document.createElement("img");
tomorow_windspeed_icon.setAttribute("class", "tomorow_windspeed_icon");
let tomorow_sunriseSunset = document.createElement("p");

//2-days later card
let last_icon = document.createElement("img");
let last_date = document.createElement("p");
let last_minmax = document.createElement("p");
let last_precipitation = document.createElement("p");
let last_windspeed = document.createElement("p");
let twodays_windspeed_icon = document.createElement("img");
twodays_windspeed_icon.setAttribute("class", "twodays_windspeed_icon");
let twodays_sunriseSunset = document.createElement("p");

async function getWeather() {
  try {
    // call and fetch open-meteo api with the desired latitude-longitude and timezone.
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,visibility,precipitation_probability,rain,snowfall,weathercode,windspeed_10m&daily=weathercode,windspeed_10m_max,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,snowfall_sum&&current_weather=true&forecast_days=3&${user_timezone}`
    );
    const data = await response.json();

    // get air quality info (european standard)
    const response_air = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=european_aqi&${user_timezone}`
    );
    const data_air = await response_air.json();

    // Display user timezone.
    timezone_para.textContent = `${data.timezone} ${data.timezone_abbreviation}`;
    main_introduction.textContent = introduction_info;
    main_introduction.appendChild(timezone_para);

    // "current conditions" card content, checking for nighttime
    let current_weathercode_day = data.current_weather.weathercode;

    document.getElementById("weathercode_current_text").textContent =
      getWeathercodeText(current_weathercode_day);
    //fixed style issue

    if (
      document.getElementById("weathercode_current_text").textContent ===
      "Fog" ||
      document.getElementById("weathercode_current_text").textContent ===
      "Clear sky" ||
      document.getElementById("weathercode_current_text").textContent ===
      "Mainly clear"
    ) {
      document.getElementById("weathercode_current_text").style.paddingTop =
        "15px";
    } else {
      document.getElementById("weathercode_current_text").style.paddingTop =
      "0px";
    };

    let current_weathercode_night;
    let weathercode_night = data.current_weather.weathercode.toString();

    current_weathercode_night = getNightWeather(weathercode_night);

    // catch and update nighttime
    let current_time = `${data.current_weather.time.slice(11)[0]}${data.current_weather.time.slice(11)[1]
      }`;

    if (
      //nighttime
      current_time >
      `${data.daily.sunset[0].slice(11)[0]}${data.daily.sunset[0].slice(11)[1]}`
    ) {
      weathercode_icon.setAttribute(
        "src",
        `./images/night/${current_weathercode_night}.svg`
      );
      document
        .getElementById("child_current_weathercode")
        .prepend(weathercode_icon);
    } else {
      //daytime
      weathercode_icon.setAttribute(
        "src",
        `./images/weathercode/${current_weathercode_day}.svg`
      );
      document
        .getElementById("child_current_weathercode")
        .prepend(weathercode_icon);
    }

    current_temp.textContent = `${data.current_weather.temperature} ${data.daily_units.temperature_2m_max}`;
    document.getElementById("child_current_temp").prepend(current_temp);

    current_windspeed.textContent = `${data.current_weather.windspeed} ${data.hourly_units.windspeed_10m}`;

    current_humidity.textContent = `Humidity: ${data.hourly.relativehumidity_2m[currentDay.getHours()]
      }%`;
    document.getElementById("child_current_humidity").append(current_humidity);

    current_visibility =
      data.hourly.visibility[currentDay.getHours()].toString();
    current_visibility_kilometers.textContent = `Visibility: ${current_visibility[0]}${current_visibility[1]}km`;
    document
      .getElementById("child_current_visibility")
      .append(current_visibility_kilometers);

    document
      .getElementById("child_current_windspeed")
      .append(current_windspeed);
    current_windspeed_icon.setAttribute(
      "src",
      `./images/wind/${getBeaufortWind(data.current_weather.windspeed)}.svg`
    );
    document
      .getElementById("child_current_windspeed")
      .prepend(current_windspeed_icon);

    source.setAttribute(
      "src",
      `./videos/${data.current_weather.weathercode}.mp4`
    );
    myVideo.load();
    myVideo.play();

    //setting air quality information. Catching night case when time starts with 0
    let current_air_qual = getAirQuality(
      data_air.hourly.european_aqi[current_time]
    );

    if (current_time[0] === "0") {
      //it's nighttime
      current_air_qual = getAirQuality(
        data_air.hourly.european_aqi[current_time[1]]
      );
    }

    current_air.textContent = current_air_qual.result;
    document.getElementById("air_info").append(current_air);
    current_air_icon.style.backgroundColor = current_air_qual.circle_color;
    document.getElementById("air_info").prepend(current_air_icon);

    // today card. DAILY 3 day forecast.
    let today_weathercode = data.daily.weathercode[0];
    document.getElementById("weathercode_today_text").textContent =
      getWeathercodeText(data.daily.weathercode[0]);

    if (
      document.getElementById("weathercode_today_text").textContent === "Fog" ||
      document.getElementById("weathercode_today_text").textContent ===
      "Clear sky" ||
      document.getElementById("weathercode_today_text").textContent ===
      "Mainly clear"
    ) {
      document.getElementById("weathercode_today_text").style.paddingTop =
        "15px";
    } else {
      document.getElementById("weathercode_today_text").style.paddingTop =
      "0px";
    };

    today_icon.setAttribute("class", "weathercode-icon");
    today_icon.setAttribute(
      "src",
      `./images/weathercode/${today_weathercode}.svg`
    );
    document.getElementById("child_today_weathercode").prepend(today_icon);

    today_date.setAttribute("id", "today-date");
    today_date.style.color = "#46c685";
    today_date.textContent = "Today";
    document.getElementById("child_today_date").append(today_date);

    today_minmax.textContent = `${data.daily.temperature_2m_min[0]}${data.daily_units.temperature_2m_max} / ${data.daily.temperature_2m_max[0]}${data.daily_units.temperature_2m_max}`;
    document.getElementById("child_today_minmax").append(today_minmax);

    today_precipitation.textContent = `${data.daily.precipitation_sum[0]}mm`;
    document
      .getElementById("child_today_precipitation")
      .append(today_precipitation);

    today_windspeed.textContent = `${data.daily.windspeed_10m_max[0]} km/h`;
    document.getElementById("child_today_windspeed").append(today_windspeed);
    today_windspeed_icon.setAttribute(
      "src",
      `./images/wind/${getBeaufortWind(data.daily.windspeed_10m_max[0])}.svg`
    );
    document
      .getElementById("child_today_windspeed")
      .prepend(today_windspeed_icon);

    today_sunriseSunset.textContent = `${data.daily.sunrise[0].slice(
      11
    )} am / ${data.daily.sunset[0].slice(11)} pm`;
    document.getElementById("child_today_sunrise").append(today_sunriseSunset);

    // creating the tomorow card.
    let tomorow_weathercode = data.daily.weathercode[1];
    document.getElementById("weathercode_tomorow_text").textContent =
      getWeathercodeText(data.daily.weathercode[1]);

    if (
      document.getElementById("weathercode_tomorow_text").textContent ===
      "Fog" ||
      document.getElementById("weathercode_tomorow_text").textContent ===
      "Clear sky" ||
      document.getElementById("weathercode_tomorow_text").textContent ===
      "Mainly clear"
    ) {
      document.getElementById("weathercode_tomorow_text").style.paddingTop =
        "15px";
    } else {
      document.getElementById("weathercode_tomorow_text").style.paddingTop =
      "0px";
    };

    tomorow_icon.setAttribute("class", "weathercode-icon");
    tomorow_icon.setAttribute(
      "src",
      `./images/weathercode/${tomorow_weathercode}.svg`
    );
    document.getElementById("child_tomorow_weathercode").prepend(tomorow_icon);

    tomorow_date.setAttribute("id", "tomorow-date");
    tomorow_date.textContent = `${formatDate(data.daily.time[1])}`;
    tomorow_date.style.color = "#46c685";
    document.getElementById("child_tomorow_date").append(tomorow_date);

    tomorow_minmax.textContent = `${data.daily.temperature_2m_min[1]}${data.daily_units.temperature_2m_max} / ${data.daily.temperature_2m_max[1]}${data.daily_units.temperature_2m_max}`;
    document.getElementById("child_tomorow_minmax").append(tomorow_minmax);

    tomorow_precipitation.textContent = `${data.daily.precipitation_sum[1]}mm`;
    document
      .getElementById("child_tomorow_precipitation")
      .append(tomorow_precipitation);

    tomorow_windspeed.textContent = `${data.daily.windspeed_10m_max[1]} km/h`;
    document
      .getElementById("child_tomorow_windspeed")
      .append(tomorow_windspeed);
    tomorow_windspeed_icon.setAttribute(
      "src",
      `./images/wind/${getBeaufortWind(data.daily.windspeed_10m_max[1])}.svg`
    );
    document
      .getElementById("child_tomorow_windspeed")
      .prepend(tomorow_windspeed_icon);

    tomorow_sunriseSunset.textContent = `${data.daily.sunrise[1].slice(
      11
    )} am / ${data.daily.sunset[1].slice(11)} pm`;
    document
      .getElementById("child_tomorow_sunrise")
      .append(tomorow_sunriseSunset);

    // in 2 days card
    let last_weathercode = data.daily.weathercode[2];
    document.getElementById("weathercode_twodays_text").textContent =
      getWeathercodeText(data.daily.weathercode[2]);

    if (
      document.getElementById("weathercode_twodays_text").textContent ===
      "Fog" ||
      document.getElementById("weathercode_twodays_text").textContent ===
      "Clear sky" ||
      document.getElementById("weathercode_twodays_text").textContent ===
      "Mainly clear"
    ) {
      document.getElementById("weathercode_twodays_text").style.paddingTop =
        "15px";
    } else {
      document.getElementById("weathercode_twodays_text").style.paddingTop =
      "0px";
    };

    last_icon.setAttribute("class", "weathercode-icon");
    last_icon.setAttribute(
      "src",
      `./images/weathercode/${last_weathercode}.svg`
    );
    document.getElementById("child_twodays_weathercode").prepend(last_icon);

    last_date.setAttribute("id", "last-date");
    last_date.textContent = `${formatDate(data.daily.time[2])}`;
    last_date.style.color = "#46c685";
    document.getElementById("child_twodays_date").append(last_date);

    last_minmax.textContent = `${data.daily.temperature_2m_min[2]}${data.daily_units.temperature_2m_max} / ${data.daily.temperature_2m_max[2]}${data.daily_units.temperature_2m_max}`;
    document.getElementById("child_twodays_minmax").append(last_minmax);

    last_precipitation.textContent = `${data.daily.precipitation_sum[2]}mm`;
    document
      .getElementById("child_twodays_precipitation")
      .append(last_precipitation);

    last_windspeed.textContent = `${data.daily.windspeed_10m_max[2]} km/h`;
    document.getElementById("child_twodays_windspeed").append(last_windspeed);
    twodays_windspeed_icon.setAttribute(
      "src",
      `./images/wind/${getBeaufortWind(data.daily.windspeed_10m_max[2])}.svg`
    );
    document
      .getElementById("child_twodays_windspeed")
      .prepend(twodays_windspeed_icon);

    twodays_sunriseSunset.textContent = `${data.daily.sunrise[2].slice(
      11
    )} am / ${data.daily.sunset[2].slice(11)} pm`;
    document
      .getElementById("child_twodays_sunrise")
      .append(twodays_sunriseSunset);

    let hourly_title = document.getElementById("hourly_title");
    let extra_info = document.createElement("p");
    extra_info.textContent = `(At local time ${data.timezone} ${data.timezone_abbreviation})`;
    extra_info.setAttribute("id", "extra_info");
    hourly_title.textContent = `Hourly forecast`;
    hourly_title.append(extra_info);

    // ----- HOURLY weather data
    let our_hour = currentDay.getHours() + 2;
    let todaySunrise = parseInt(data.daily.sunrise[0].slice(11));
    let todaySunset = parseInt(data.daily.sunset[0].slice(11)) + 2;

    function displayHour(hourIndex, hourDiv) {
      // hourly elements
      let hour = document.createElement("p");
      let hour_weathercode = document.createElement("img");
      let hour_temp = document.createElement("p");
      let hour_precipitation = document.createElement("p");
      let hour_rain = document.createElement("p");
      let hour_wind = document.createElement("p");

      hour_weathercode.setAttribute("class", "hour-children");
      hour_weathercode.setAttribute("class", "hourcode-icon");

      hour.setAttribute("class", "hour-children");
      hour.setAttribute("id", "hourly-hour");
      hour.textContent = `${data.hourly.time[hourIndex].slice(11)}`;
      hourDiv.append(hour);

      // simplifying getting nighttime weathercodes.
      let get_hourcode_day = data.hourly.weathercode[hourIndex];
      let get_hourcode_night;

      let weathercode_night_hour =
        data.hourly.weathercode[hourIndex].toString();
      get_hourcode_night = getNightWeather(weathercode_night_hour);

      let current_hour_nighttime = parseInt(
        `${hour.textContent[0]}${hour.textContent[1]}`
      );

      // catch night-time and update icons for night
      if (
        current_hour_nighttime === todaySunset ||
        current_hour_nighttime === todaySunrise
      ) {
        // it's daytime
        hour_weathercode.setAttribute(
          "src",
          `./images/weathercode/${get_hourcode_day}.svg`
        );
        hourDiv.append(hour_weathercode);
      } else if (
        current_hour_nighttime < todaySunset &&
        current_hour_nighttime >= todaySunrise
      ) {
        // it's daytime
        hour_weathercode.setAttribute(
          "src",
          `./images/weathercode/${get_hourcode_day}.svg`
        );
        hourDiv.append(hour_weathercode);
      } else {
        // it's nighttime
        hour_weathercode.setAttribute(
          "src",
          `./images/night/${get_hourcode_night}.svg`
        );
        hourDiv.append(hour_weathercode);
      }
      hour_precipitation.setAttribute("class", "hour-children");
      hour_precipitation.textContent = `${data.hourly.precipitation_probability[hourIndex]}%`;
      hourDiv.append(hour_precipitation);

      // hide rain amount if it's equal to 0.
      hour_rain.setAttribute("class", "hour-children");
      hour_rain.textContent = `${data.hourly.rain[hourIndex]}mm`;
      hourDiv.append(hour_rain);

      hour_temp.setAttribute("class", "hour-children");
      hour_temp.setAttribute("id", "hour-children-temp");
      hour_temp.textContent = `${data.hourly.temperature_2m[hourIndex]}${data.daily_units.temperature_2m_max}`;
      hourDiv.append(hour_temp);

      hour_wind.setAttribute("class", "hour-children");
      hour_wind.textContent = `${data.hourly.windspeed_10m[hourIndex]}km/h`;
      hourDiv.append(hour_wind);
    }

    // render out hourly information
    for (let i = 1; i <= 10; i++) {
      displayHour(our_hour++, document.getElementById(`hour_${i}`));
    }

    // check if hourly data duplicates got created beacuse of the shift-tab bug which i just couldn't fix. If they have, remove them. Awful way to do things but that bug has beaten me.
    let childhourDivs = document.querySelectorAll("div.childhour");
    for (let i = 0; i < childhourDivs.length; i++) {
      if (childhourDivs[i].childNodes.length > 6) {
        for (let j = childhourDivs[i].childNodes.length - 1; j >= 6; j--) {
          childhourDivs[i].removeChild(childhourDivs[i].childNodes[j]);
        }
      }
    }
    city_info = introduction_info;
  } catch (err) {
    console.log(err);
  }
}

// Check if the user has a default location set for displaying weather. If they do, load their default city, else initialize default app.
// Also set basic functionality for smart app refreshing every 2 minutes if user is on the app.

document.addEventListener("DOMContentLoaded", () => {
  let default_user = JSON.parse(localStorage.getItem("defaultLocation"));

  if (default_user) {
    // if default exists, call getWeather() with the updates co-ords and city name. get coords and city_info from localstorage
    let defaultLocation = JSON.parse(localStorage.getItem("defaultLocation"));
    city_info = defaultLocation.city_info;
    latitude = defaultLocation.latitude;
    longitude = defaultLocation.longitude;
    introduction_info = city_info;
    let user_default_population = "";
    let user_default_elevation = "";

    // Run the geocoding api for city name, get first result, extract population and elevation and update it.
    let city_name = city_info.split(",")[0];
    fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city_name}&count=1&language=en&format=json`
    )
      .then((response_city) => response_city.json())
      .then((data_city) => {
        user_default_population = data_city.results[0].population;

        current_population.textContent = `Population: ${user_default_population}`;
        if (current_population.textContent == "Population: undefined") {
          current_population.textContent = "Couldn't find population";
        } else {
          current_population.textContent = `Population: ${user_default_population.toLocaleString(
            "en-US",
            {
              notation: "compact",
              compactDisplay: "short",
            }
          )}`;
        }
        user_default_elevation = data_city.results[0].elevation;
        current_elevation.textContent = `Elevation: ${user_default_elevation}m`;
        if (current_elevation.textContent == "Elevation: undefinedm") {
          current_elevation.textContent = "Couldn't find elevation";
        }
      });
    getWeather();
    
  } else {
    getWeather(); // default app initialization.
  }
});

// App refresh functionality.
let refreshInterval = 2 * 60 * 1000; // 2 minutes
let refreshTimeout;

function clearChildElements() { 
  document.querySelectorAll("div.childhour").forEach((child) => {
    child.innerHTML = "";
  });
}

function updateWeather() {
  if (!document.hidden) { //when document becomes visible, timer for updating starts.
    clearChildElements();
    getWeather();
    refreshTimeout = setTimeout(updateWeather, refreshInterval); // Recursive call for the next refresh
  }
}

// If user is on a different tab(not on the app) stop fetching and updating data
function handleVisibilityChange() {
  if (document.hidden) {
    clearTimeout(refreshTimeout); // Clear the timeout when the user changes tabs, ensuring no data is fetched.
  } else {
    setTimeout(() => {
      getWeather()
    }, 2000) 
    clearTimeout(refreshTimeout); // Clear any existing timeout to make sure we start from scratch.
    refreshTimeout = setTimeout(updateWeather, refreshInterval); // Start the refresh cycle if the user stays on the app.
  }
}

document.addEventListener("visibilitychange", handleVisibilityChange);

// If user minimizes or puts browser in the background, stop fetching and updating data:
function handleWindowFocus() {
  setTimeout(() => {
    getWeather()  // Refresh when the window comes into focus, after a brief delay
  }, 2000) 
  clearTimeout(refreshTimeout); // Clear any existing timeout
  refreshTimeout = setTimeout(updateWeather, refreshInterval); // Start the refresh cycle if the user stays on the app.
}

function handleWindowBlur() {
  clearTimeout(refreshTimeout); // Clear the timeout when the window loses focus, ensuring no data is fetched.
}

window.addEventListener('focus', handleWindowFocus);

window.addEventListener('blur', handleWindowBlur);

// Initial start of the refresh cycle.
refreshTimeout = setTimeout(updateWeather, refreshInterval);



// Allowing the user to select a default location for the app using localstorage. And a button to open up a map showing exact location on a map.
let default_button = document.getElementById("default_button");
let map_button = document.getElementById("map_button");

default_button.addEventListener("click", () => {
  setTimeout(() => {
    const confirmed = confirm(
      `Do you want to set ${city_info} as your default location?`
    );
    if (confirmed) {
      const defaultLocation = { city_info, latitude, longitude };
      localStorage.setItem("defaultLocation", JSON.stringify(defaultLocation));
      alert("Default location set!");
    }
    default_button.blur();
  }, 100);
});

map_button.addEventListener("click", () => {
  let map_url = `https://www.openstreetmap.org/#map=14/${latitude}/${longitude}&layers=N`;
  setTimeout(() => {
  window.open(map_url, "_blank", "noopener noreferrer");
  map_button.blur();
  }, 400)
});

let github_button = document.getElementById("github-anchor");
github_button.addEventListener("click", (e) => {
  e.preventDefault();
  github_button.blur();

  setTimeout(() => {
  window.open(github_button.href, "_blank", "noopener noreferrer");
  }, 500)
});

// checking when user input is loaded in so we know when to hide/show it.
let cityCards_exist = false;
let searchResultsLoaded = false;

// check if a user is typing in the input or not. Only fetch data once, whenever they stop typing.
let timer = undefined,
timeoutVal = 400;

const input = document.getElementById("input");
const isTyping = document.getElementById("isTyping");

input.addEventListener("keydown", handleKeyDown);
input.addEventListener("keyup", handleKeyUp);

function handleKeyDown(e) {
  // prevent tab cycles while search bar has focus. Ensure tab and shift don't count as keydown events.
  if (e.key !== "Tab" && !e.shiftKey) {
    clearTimeout(timer);

    // no city cards should be visible during this.
    document.querySelectorAll("div.city-card").forEach((city) => city.remove());
    isTyping.style.display = "block";
    isTyping.innerHTML = "Loading data...";
  }
}

function handleKeyUp(e) {
  // Exclude TAB and Shift key from counting as a keyup event which would always fire our searchbar functionality.
  clearTimeout(timer);
  if (e.key === "Tab" || e.key === "Shift") {
    return;
  }

  timer = setTimeout(() => {
    isTyping.style.display = "none";
    const searchValue = input.value.trim();
    if (searchValue.length > 0) {
      // handle user data and render results
      let prefix = input.value.toLowerCase();

      fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${prefix}&count=10&language=en&format=json`
      )
        .then((response) => response.json())
        .then((data) => {

          for (let i = 0; i < data.results.length; i++) {
            const newCity = document.createElement("div");
            const cityName_one = document.createElement("p");
            const cityName_two = document.createElement("p");

            const latitude_fromUser = data.results[i].latitude;
            const longitude_fromUser = data.results[i].longitude;
            const information_fromUser = `${data.results[i].name}, ${data.results[i].country}`;
            const timezone_fromUser = `${data.timezone} ${data.timezone_abbreviation}`;
            const elevation_fromUser = `Elevation: ${data.results[i].elevation}m`;
            const population_fromUser = data.results[i].population;

            cityName_one.textContent = `${data.results[i].name}`;
            cityName_two.textContent = `${data.results[i].admin1}, ${data.results[i].country_code}`;
            cityName_two.style.color = "gray";
            if (cityName_two.textContent.split(",")[0] === "undefined") {
              cityName_two.textContent = `${data.results[i].country_code}`;
            }

            newCity.append(cityName_one, cityName_two);
            newCity.classList.add("city-card");
            document.getElementById("city-cards").append(newCity);
            document.querySelectorAll("div.city-card").forEach((city) => {
              city.setAttribute("tabindex", "1");
            });
            document.querySelectorAll("div.city-card").forEach((city) => {
              city.setAttribute("role", "button");
            });

            // Remove cards and reset input onclick. Make the searchbar and gps icon fully accessible with only tab focus cycling and enter key.
            newCity.addEventListener("click", handleData);

            // while an element has focus on it, the following function runs, adding another event listener for enter key.
            newCity.addEventListener("focus", function () {
              // Check if Enter key was pressed while the element has focus
              newCity.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                  document
                    .querySelectorAll("div.childhour")
                    .forEach((child) => {
                      while (child.firstChild) {
                        child.removeChild(child.firstChild);
                      }
                    });
                  handleData();
                  searchResultsLoaded = false;
                }
              });
            });
            function handleData() {
              // extract info which we need from city user clicks on.
              latitude = latitude_fromUser;
              longitude = longitude_fromUser;
              introduction_info = information_fromUser;
              current_elevation.textContent = elevation_fromUser;
              timezone_para.textContent = timezone_fromUser;
              hourly_title.textContent = `Hourly forecast (At local time ${timezone_fromUser})`;

              if (current_elevation.textContent == "Elevation: undefinedm") {
                current_elevation.textContent = "Couldn't find elevation";
              }
              if (population_fromUser == undefined) {
                current_population.textContent = "Couldn't find population";
              } else {
                current_population.textContent =
                  "Population: " +
                  population_fromUser.toLocaleString("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                  });
                searchResultsLoaded = false;
              }

              // clear all cities HTML and clear the page, reset our input to empty. Also clear duplicate hour elements.
              document.querySelectorAll("div.city-card").forEach((city) => {
                city.remove();
              });
              document.querySelectorAll("div.childhour").forEach((child) => {
                while (child.firstChild) {
                  child.removeChild(child.firstChild);
                }
              });
              document.getElementById("input").value = "";

              getWeather();
              cityCards_exist = false;
            }
          }

          // below is the full functionality for hiding search bar results if input isn't focused.
          cityCards_exist = true;
          let lastFocusedElement = null;
          let input_focused = false;

          searchResultsLoaded = true;

          const cityCards = document.querySelectorAll("div.city-card");
          // functionality of the search bar to hide and show elements based on focus.
          cityCards.forEach((cityCard) => {
            cityCard.addEventListener("focus", () => {
              lastFocusedElement = cityCard;
              input_focused = true;
            });

            cityCard.addEventListener("blur", () => {
              if (lastFocusedElement === cityCard) {
                lastFocusedElement = null;
                input_focused = false;

                setTimeout(() => {
                  // Hide city cards when none of them are focused.
                  if (!lastFocusedElement) {
                    cityCards.forEach((city) => {
                      city.style.display = "none";
                    });
                  }
                }, 200);
              }
            });
          });
          // Listen for the search bar to lose focus to hide cards
          input.addEventListener("blur", () => {
            input_focused = false;
            setTimeout(() => {
              if (!input_focused) {
                cityCards.forEach((city) => {
                  city.style.display = "none";
                });
              }
            }, 100);
          });

          // Listen for the search bar to regain focus to show loaded cards.
          input.addEventListener("focus", () => {
            input_focused = true;
            // Show the search results container
            if (searchResultsLoaded) {
              cityCards.forEach((city) => {
                city.style.display = "flex";
              });
            }
          });
        })
        .catch((err) => console.error(err));
    }
  }, timeoutVal);
}
document.querySelectorAll("city-card").forEach((city) => {
  city.remove();
});

// get the location of user when he clicks on gps image element using navigator geolocation with permission
let user_location = document.getElementById("location");
user_location.addEventListener("click", getUserLocation);

function getUserLocation() {
  //navigator success callback ( if user gives permission, and browser has navigator method )
  function onSuccess(position) {
    const user_latitude = position.coords.latitude;
    const user_longitude = position.coords.longitude;

    latitude = user_latitude;
    longitude = user_longitude;
    introduction_info = `Your location at ${latitude} / ${longitude}`;
    document.querySelectorAll("div.childhour").forEach((child) => {
      while (child.firstChild) {
        child.removeChild(child.firstChild);
      }
    });

    getWeather();
    current_population.textContent = "Couldn't find population";
    current_elevation.textContent = "Couldn't find elevation";
  }

  //navigator failure callback.
  function onError() {
    alert("Error: Unable to retrieve your location.");
  }
  // if device doesn't support geolocation( geolocation isn't present in global object )
  if (!navigator.geolocation) {
    alert("Error: Geolocation is not supported by your browser");
  } else {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }
}
user_location.addEventListener("focus", () => {
  setTimeout(() => {
    user_location.blur();
  }, 1500)
})

// while gps element has focus and enter is pressed, run getUserLocation function.
user_location.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    getUserLocation();
  }
});

// Nothing should happen while search bar has focus and enter is pressed.
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
  }
});
