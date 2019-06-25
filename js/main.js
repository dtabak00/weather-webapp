/* global Skycons */

const $query = (selector, ctx = document) => ctx.querySelector(selector);

const temperatureDescription = $query('.temperature-description');
const temperatureDegree = $query('.temperature-degree');
const locationTimezone = $query('.location-timezone');
const temperatureSection = $query('.temperature');
const temperatureSpan = $query('.temperature span');

const promisfy = (fn, ctx) => () => new Promise((resolve, reject) => fn.call(ctx, resolve, reject));
const getCurrentPosition = promisfy(navigator.geolocation.getCurrentPosition, navigator.geolocation);

window.addEventListener('DOMContentLoaded', () => {
  if (!('geolocation' in navigator)) {
    locationTimezone.textContent = 'Your browser does not support Geolocation API :(';
    return;
  }

  return getCurrentPosition()
    .then(position => fetchWeatherInfo(position))
    .then(data => setDomElementValues(data))
    .catch(err => (locationTimezone.textContent = err.message));
});

function fetchWeatherInfo(position) {
  const { latitude: lat, longitude: long } = position.coords;
  const proxy = 'https://cors-anywhere.herokuapp.com/'; // Get around the cors-issue (localhost)
  const api = `${proxy}https://api.darksky.net/forecast/91cec39d0f1e57c746c1a0a806aa1f1a/${lat},${long}`; // API call url

  // Makes http request that fetches the response from a url
  return fetch(api).then(response => response.json());
}

function setDomElementValues(data) {
  const { temperature, summary, icon } = data.currently;

  // Set DOM Element values with the data from the API
  temperatureDegree.textContent = calculateCelsius(temperature);
  temperatureDescription.textContent = summary;
  locationTimezone.textContent = data.timezone;
  setIcons(icon, document.querySelector('.icon'));
}

function setIcons(icon, iconId) {
  // Declare and initialize the skycons class
  const skycons = new Skycons({ color: 'white' });

  // Per instructions on https://darkskyapp.github.io/skycons/
  // We must capitalize all letters and replace all "-" with "_"
  const currentIcon = icon.replace(/-/g, '_').toUpperCase();
  // Start animation
  skycons.play();

  return skycons.set(iconId, Skycons[currentIcon]);
}

temperatureSection.addEventListener('click', () => {
  if (temperatureSpan.textContent === '°C') {
    temperatureDegree.textContent = calculateFahrenheit(parseFloat(temperatureDegree.textContent));
    temperatureSpan.textContent = '°F';
  } else {
    temperatureDegree.textContent = calculateCelsius(parseFloat(temperatureDegree.textContent));
    temperatureSpan.textContent = '°C';
  }
});

function calculateCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5/9).toFixed(2);
}

function calculateFahrenheit(celsius) {
  return (celsius * 9 / 5 + 32).toFixed(2);
}
