var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// netlify/functions/api_proxy.js
var api_proxy_exports = {};
__export(api_proxy_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(api_proxy_exports);
async function handler(event, context) {
  const path = event.path;
  const latitude = event.queryStringParameters.latitude;
  const longitude = event.queryStringParameters.longitude;
  const user_timezone = event.queryStringParameters.user_timezone;
  const city_name = event.queryStringParameters.city_name;
  const prefix = event.queryStringParameters.prefix;
  const API_URL_MAIN = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,rain,snowfall,weathercode,windspeed_10m&daily=weathercode,windspeed_10m_max,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,snowfall_sum&&current_weather=true&forecast_days=3&${user_timezone}`;
  const API_URL_AIR = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=european_aqi&${user_timezone}`;
  const API_DEFAULT_CITY = `https://geocoding-api.open-meteo.com/v1/search?name=${city_name}&count=1&language=en&format=json`;
  const API_USER_INPUT = `https://geocoding-api.open-meteo.com/v1/search?name=${prefix}&count=10&language=en&format=json`;
  if (path === "/.netlify/functions/api_proxy/route1") {
    const response = await fetch(API_URL_MAIN);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } else if (path === "/.netlify/functions/api_proxy/route2") {
    const response = await fetch(API_URL_AIR);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } else if (path === "/.netlify/functions/api_proxy/route3") {
    const response = await fetch(API_DEFAULT_CITY);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } else if (path === "/.netlify/functions/api_proxy/route4") {
    const response = await fetch(API_USER_INPUT);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: "Route not found."
      })
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=api_proxy.js.map
