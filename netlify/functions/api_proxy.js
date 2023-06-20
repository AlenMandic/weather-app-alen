import fetch from "node-fetch";

export async function handler(event, context) {
    const path = event.path

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
            body: JSON.stringify(
                data,
            ),
        };

    } else if (path === "/.netlify/functions/api_proxy/route2") {
        const response = await fetch(API_URL_AIR);
        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(
                data,
            ),
        };

    } else if (path === "/.netlify/functions/api_proxy/route3") {

        const response = await fetch(API_DEFAULT_CITY);
        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(
                data,
            ),
        };

    } else if (path === "/.netlify/functions/api_proxy/route4") {

        const response = await fetch(API_USER_INPUT);
        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(
                data,
            ),
        };

    } else {

        return {
            statusCode: 404,
            body: JSON.stringify({
                error: "Route not found."
            })
        }
    }

}