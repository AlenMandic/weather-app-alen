# Weather-app
NOT FINISHED OR DEPLOYED YET. NEED TO CREATE A PROXY SERVER WITH NODE, THEN I WILL HOST IT.

A personal project of a weather app i made. Uses vanilla JavaScript, CSS and HTML.

# Features:
- Fully responsive.
- Offers current conditions, 3-day forecast and hourly forecast.
- Weather icons show if it's day or night
- Search through any city in the world and display weather, air and general data about it.
- Fetch and display data only when the user stopped typing in the searchbar to reduce api calls.
- Show/hide search results based on the searchbar or search results being focused or not.
- Set any city/location as your default homepage, or open that location on a map.
- Gps button which get's your current device location and displays weather data for it.
- All buttons, searchbar and search results can be navigated with keyboard only ( tab forwards and backwards + enter ).
- Different button animations for mobile and desktop.

# Smart app refresh: 
The app refreshes data every 2 minutes if the user is on the app, if the user enters a different browser  tab or minimizes the browser, no data will be fetched. When the user jumps back in the app will auto refresh immediately once, then continue with the regular refresh cycle as long as the user is present.
- I achieve this by having an updateWeather() function which constantly calls itself every 2 minutes using a recursive setTimeout.
- However, if the user isn't on the app tab or minimizes the browser etc, i use window and document event listeners to clear the timeout,
  and no further data fetching is made. If the user is detected back onto the app, (window object gains focus or !document.hidden), we just reset the timeout cycle.
