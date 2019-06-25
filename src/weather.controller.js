import { Controller } from 'stimulus';
import { config } from '../package.json';
import skycons from 'skycons';

const promisfy = (fn, ctx) => () => new Promise((resolve, reject) => fn.call(ctx, resolve, reject));

const getCurrentPosition = promisfy(navigator.geolocation.getCurrentPosition, navigator.geolocation);
const capitalize = str => str.toUpperCase();
const snakecase = str => str.replace(/-/g, '_');

const Skycons = skycons(window);
const TemperatureUnit = {
  Celsius: 'celsius',
  Fahrenheit: 'fahrenheit'
};
const TemperatureUnitSymbol = {
  [TemperatureUnit.Celsius]: '°C',
  [TemperatureUnit.Fahrenheit]: '°F'
};

export default class extends Controller {
  static get targets() {
    return [
      'timezone',
      'skycons',
      'temperature',
      'temperatureUnit',
      'conditions'
    ];
  }

  initialize() {
    if (!('geolocation' in navigator)) {
      this.timezoneTarget.textContent = 'Your browser does not support Geolocation API :(';
      return;
    }
    return getCurrentPosition()
      .then(position => fetchWeatherInfo(position))
      .then(info => this.displayWeatherInfo(info))
      .catch(err => (this.timezoneTarget.textContent = err.message));
  }

  displayWeatherInfo({ currently: data, timezone } = {}) {
    const { temperature, summary, icon } = data;
    this.temperature = {
      [TemperatureUnit.Celsius]: toCelsius(temperature),
      [TemperatureUnit.Fahrenheit]: temperature
    };

    this.timezoneTarget.textContent = timezone;
    this.conditionsTarget.textContent = summary;
    this.displayWeatherIcon(icon);
    this.toggleTemperatureUnit();
  }

  displayWeatherIcon(icon, options = { color: 'white' }) {
    icon = capitalize(snakecase(icon));
    const skycons = new Skycons(options);
    skycons.set(this.skyconsTarget, Skycons[icon]);
    return skycons.play();
  }

  toggleTemperatureUnit() {
    if (this.temperature.units === TemperatureUnit.Celsius) {
      this.temperature.units = TemperatureUnit.Fahrenheit;
    } else {
      this.temperature.units = TemperatureUnit.Celsius;
    }
    this.temperatureUnitTarget.textContent = TemperatureUnitSymbol[this.temperature.units];
    this.temperatureTarget.textContent = this.temperature[this.temperature.units];
  }
}

function fetchWeatherInfo(position) {
  const { latitude: lat, longitude: long } = position.coords;
  const url = `${config.corsProxy}/${config.apiUrl}/${lat},${long}`;
  return fetch(url).then(response => response.json());
}

function toCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5 / 9).toFixed(2);
}
