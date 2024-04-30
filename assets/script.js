// configure our cities as a local storage array
var API_KEY = "526e004ee12b1a0053e1fd9487c7d999"

function logStart(functionName) {
  console.log(`=========================${functionName} running=====================`)
}


// render Cities() - iterate through our array, create a button, append it, and make it clickable to call searchAPI(clickedCity)
function renderCities() {
  logStart("render Cities")
  var savedCities = JSON.parse(localStorage.getItem("savedCities"))
  console.log("saved Cities: ", savedCities)
  if (savedCities == null) {
    console.log("We don't have it!")
    localStorage.setItem("savedCities", JSON.stringify([]))
    return
  }
  console.log("Moving on!!!")
  //before we render we empty the container
  // we need to target the container
  const historyContainer = document.getElementById("history-container");
  // empty it
  historyContainer.innerHTML = "";
  // populate it
  // container.innerHTML += `<div></div>`
  // Loop through saved cities and create buttons
  savedCities.forEach(function (city) {
    const cityButton = document.createElement("button");
    cityButton.textContent = city;

    // Add click event listener to call searchAPI with the clicked city
    cityButton.addEventListener("click", function () {
      searchAPI(city); // Replace with your function to call the OpenWeather API
    });

    // Append the button to the history container
    historyContainer.appendChild(cityButton);
  });
}

function saveCities(newCity) {
  var savedCities = JSON.parse(localStorage.getItem("savedCities")) || []; // Initialize as empty array if not found
  savedCities = savedCities.slice(-8); // Keep only the last 8 entries
  savedCities.push(newCity);
  localStorage.setItem("savedCities", JSON.stringify(savedCities));
  renderCities();
}

function searchAPI(city) {
  console.log("Searching API with city: ", city);
  var url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;
  console.log("URL: ", url);
  fetch(url).then(response => {
    console.log("Response: ", response);
    return response.json();
  }).then(data => {
    console.log("Data: ");
    saveCities(data.city.name);
    updateMainCard(data); // Call new function to update card
    updateForecastCards(data.list);
  });
}

function convertKelvinToFahrenheit(kelvin) {
  return Math.floor((kelvin - 273.15) * 1.8 + 32);
}

function updateMainCard(data) {
  const mainCard = document.getElementById("main-card");
  const cityName = data.city.name;
  const temperature = convertKelvinToFahrenheit(data.list[0].main.temp);
  const description = data.list[0].weather[0].description;
  const windSpeed = data.list[0].wind.speed;
  const humidity = data.list[0].main.humidity;
  const currentDate = new Date().toLocaleDateString();

  mainCard.innerHTML = `
    <h2>Weather in ${cityName} - ${currentDate}</h2>
    <p>Looks like ${description} today!</p>
    <p>Temperature: ${temperature} &deg;F</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
    <p>Humidity: ${humidity}%</p>
  `;
}

function updateForecastCards(data) {
  const forecastCardsContainer = document.getElementById("forecast-cards");
  forecastCardsContainer.innerHTML = ""; // Clear previous content

  for (let i = 0; i < data.length; i += 8) { // Every 8th element represents a new day
    const forecastDay = data[i];
    const forecastDate = new Date(forecastDay.dt * 1000).toLocaleDateString();
    const forecastTemp = convertKelvinToFahrenheit(forecastDay.main.temp);
    const forecastWindSpeed = forecastDay.wind.speed;
    const forecastHumidity = forecastDay.main.humidity;
    const forecastDescription = forecastDay.weather[0].description;

    const card = document.createElement("div");
    card.classList.add("forecast-card"); // Add CSS class for styling

    card.innerHTML = `
      <h3>${forecastDate}</h3>
      <p>Temp: ${forecastTemp} &deg;F</p>
      <p>Wind: ${forecastWindSpeed} m/s</p>
      <p>Humidity: ${forecastHumidity}%</p>
      <p>Watch for ${forecastDescription}!</p>
    `;

    forecastCardsContainer.appendChild(card);
  }
}

function renderForecast(array) {
  logStart("renderForecast")
  console.log(array)
  // container and we also need to empty it
  //innerHTML
  const forecastCardsContainer = document.getElementById("forecast-cards");
  // Clear any previous content
  forecastCardsContainer.innerHTML = "";
  // Basic placeholder content using innerHTML
  forecastCardsContainer.innerHTML = `
     <h2>Weather Forecast for ${array[0].dt_txt.split(' ')[0]}</h2>
     <p>Five Day Weather Forecast: Fetching detailed weather information...</p>
  `;
  for (let i = 0; i < array.length; i += 8) {
    console.log(array[i])
  }
}

// Add event listener to the form
document.addEventListener("DOMContentLoaded", function() {
  const searchForm = document.getElementById("search-form");
  searchForm.addEventListener("submit", handleFormSubmit);
});

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission behavior

  // Get the input element for city search
  const cityInput = document.getElementById("city-input");
  const cityName = cityInput.value;

  // Call searchAPI with the validated city name
  searchAPI(cityName);
}

