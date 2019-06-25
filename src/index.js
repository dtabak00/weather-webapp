import { Application } from 'stimulus';
import WeatherController from './weather.controller';

import './style.css';

const app = Application.start();
app.register('weather', WeatherController);
