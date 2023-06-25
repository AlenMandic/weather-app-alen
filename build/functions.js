// Turn open-meteo date format into shorter more readable info. --(Turns "2023-04-05" into April 05).
export function formatDate(date) {
  let parts = date.split("-");
  let month = parts[1];
  let day = parts[2];

  const monthLookupTable = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December"
  };

  return `${monthLookupTable[month]} ${day}`;
}

// Creating textual information about current weather status.
export function getWeathercodeText(weathercode) {
  let weathercode_status = "";

  const weatherLookupTable = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy intensity rain",
    66: "Light freezing rain",
    67: "Dense freezing rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Light snow showers",
    86: "Dense snow showers",
    95: "Thunderstorm",
    96: "Slight hail thunderstorm",
    99: "Heavy hail thunderstorm"
  };

  weathercode_status = weatherLookupTable[weathercode] || "";

  return weathercode_status;
}

  // simplify getting nighttime weathercodes.
  export function getNightWeather(weathercode) {
    let result = "";
    switch (weathercode[0]) {
      case "0":
        result = "clear-night";
        break;
      case "1":
      case "2":
        result = "partly-cloudy-night";
        break;
      case "3":
        result = "overcast-night";
        break;
      case "4":
        result = "fog-night";
        break;
      case "5":
      case "6":
      case "8":
        result = "partly-cloudy-night-rain";
        break;
      case "7":
        result = "partly-cloudy-night-snow";
        break;
      case "9":
        result = "thunderstorms-night";
        break;
    }
    return result;
  }

// get current wind speed on the beaufort scale so we can set appropriate wind image
export function getBeaufortWind(windSpeed) {
  let result;
  if (windSpeed < 1) {
    result = 0;
  } else if (windSpeed >= 1.01 && windSpeed <= 6.98) {
    result =  1;
  } else if (windSpeed >= 6.99 && windSpeed <= 12.98) {
    result =  2;
  } else if (windSpeed >= 12.99 && windSpeed <= 20.98) {
    result =  3;
  } else if (windSpeed >= 20.99 && windSpeed <= 29.98) {
    result =  4;
  } else if (windSpeed >= 29.99 && windSpeed <= 39.98) {
    result =  5;
  } else if (windSpeed >= 39.99 && windSpeed <= 50.98) {
    result =  6;
  } else if (windSpeed >= 50.99 && windSpeed <= 62.98) {
    result =  7;
  } else if (windSpeed >= 62.99 && windSpeed <= 75.98) {
    result =  8;
  } else if (windSpeed >= 75.99 && windSpeed <= 88.98) {
    result =  9;
  } else if (windSpeed >= 89.99 && windSpeed <= 103.98) {
    result =  10;
  } else if (windSpeed >= 103.99 && windSpeed <= 117.99) {
    result =  11;
  } else {
    result =  12;
  }
  return result;
}

// Creating current air quality information. Simplified version.
export function getAirQuality(aqi) {
  let result = '',
  circle_color = '';

   if (aqi >= 0 && aqi <= 20) {
    result =  "Air quality: Good"
    circle_color = "lightblue";
  } else if (aqi >= 20 && aqi <= 40) {
    result =  "Air quality: Fair";
    circle_color = "lightgreen";
  } else if (aqi >= 40 && aqi <= 60) {
    result =  "Air quality: Moderate";
    circle_color = "yellow";
  } else if (aqi >= 60 && aqi <= 80) {
    result =  "Air quality: Poor";
    circle_color = "#954040";
  } else if (aqi >= 80 && aqi <= 100) {  
    result =  "Air quality: Very Poor";
    circle_color = "red";
  } else {
    result = "Air quality: Extremely poor"
    circle_color = "purple";
  }
  return {result, circle_color}
}
