import './style.css';
import { config } from './package.json';
import skycons from 'skycons';

const Skycons = skycons(window);
const $query = (selector, ctx = document) => ctx.querySelector(selector);

const temperatureDescription = $query('.temperature-description');
const temperatureDegree = $query('.temperature-degree');
const locationTimezone = $query('.location-timezone');
const temperatureSection = $query('.temperature');
const temperatureSpan = $query('.temperature span');

const TemperatureUnit = {
  Celsius: 'celsius',
  Fahrenheit: 'fahrenheit'
};

const snakecase = str => str.replace(/-/g, '_');
const capitalize = str => str.toUpperCase();

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
  const url = `${config.corsProxy}/${config.apiUrl}/${lat},${long}`;
  return fetch(url).then(response => response.json());
}

function setDomElementValues(data) {
  const { temperature, summary, icon } = data.currently;

  // Set DOM Element values with the data from the API
  Object.assign(temperatureDegree.dataset, {
    [TemperatureUnit.Celsius]: calculateCelsius(temperature),
    [TemperatureUnit.Fahrenheit]: calculateFahrenheit(temperature)
  });
  toggleTemperatureUnit();
  temperatureSection.style.opacity = 1;

  temperatureDescription.textContent = summary;
  locationTimezone.textContent = data.timezone;
  setIcons(icon, document.querySelector('.icon'));
}

function setIcons(icon, iconId) {
  const skycons = new Skycons({ color: 'white' });
  const currentIcon = capitalize(snakecase(icon));
  skycons.play();
  return skycons.set(iconId, Skycons[currentIcon]);
}

temperatureSection.addEventListener('click', toggleTemperatureUnit);

function toggleTemperatureUnit() {
  if (temperatureDegree.dataset.current === TemperatureUnit.Celsius) {
    temperatureDegree.dataset.current = TemperatureUnit.Fahrenheit;
    temperatureSpan.textContent = '°F';
  } else {
    temperatureDegree.dataset.current = TemperatureUnit.Celsius;
    temperatureSpan.textContent = '°C';
  }
  temperatureDegree.textContent = temperatureDegree.dataset[temperatureDegree.dataset.current];
}

function calculateCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5 / 9).toFixed(2);
}

function calculateFahrenheit(celsius) {
  return (celsius * 9 / 5 + 32).toFixed(2);
}
