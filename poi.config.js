'use strict';

const path = require('path');

/** @type {import('poi').Config} */
const config = {
  entry: path.join(__dirname, './src/index.js'),
  output: {
    dir: path.join(__dirname, './dist'),
    html: {
      template: path.join(__dirname, './public/index.html')
    }
  }
};

module.exports = config;
