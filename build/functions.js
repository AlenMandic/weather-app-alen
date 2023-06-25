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

    switch (weathercode) {
      case 0:
        weathercode_status = "Clear sky";
        break;
      case 1:
        weathercode_status = "Mainly clear";
        break;
      case 2:
        weathercode_status = "Partly cloudy";
        break;
      case 3:
        weathercode_status = "Overcast";
        break;
      case 45:
        weathercode_status = "Fog";
        break;
      case 48:
        weathercode_status = "Depositing rime fog";
        break;
      case 51:
        weathercode_status = "Light drizzle";
        break;
      case 53:
        weathercode_status = "Moderate drizzle";
        break;
      case 55:
        weathercode_status = "Dense drizzle";
        break;
      case 56:
        weathercode_status = "Light freezing drizzle";
        break;
      case 57:
        weathercode_status = "Dense freezing drizzle";
        break;
      case 61:
        weathercode_status = "Slight rain";
        break;
      case 63:
        weathercode_status = "Moderate rain";
        break;
      case 65:
        weathercode_status = "Heavy intensity rain";
        break;
      case 66:
        weathercode_status = "Light freezing rain";
        break;
      case 67:
        weathercode_status = "Dense freezing rain";
        break;
      case 71:
        weathercode_status = "Slight snowfall";
        break;
      case 73:
        weathercode_status = "Moderate snowfall";
        break;
      case 75:
        weathercode_status = "Heavy snowfall";
        break;
      case 77:
        weathercode_status = "Snow grains";
        break;
      case 80:
        weathercode_status = "Slight rain showers";
        break;
      case 81:
        weathercode_status = "Moderate rain showers";
        break;
      case 82:
        weathercode_status = "Violent rain showers";
        break;
      case 85:
        weathercode_status = "Light snow showers";
        break;
      case 86:
        weathercode_status = "Dense snow showers";
        break;
      case 95:
        weathercode_status = "Thunderstorm";
        break;
      case 96:
        weathercode_status = "Slight hail thunderstorm";
        break;
      case 99:
        weathercode_status = "Heavy hail thunderstorm";
        break;
    }
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
