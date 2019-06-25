'use strict';

const path = require('path');

/** @type {import('poi').Config} */
const config = {
  entry: path.join(__dirname, './index.js'),
  output: {
    dir: path.join(__dirname, './dist'),
    html: {
      template: path.join(__dirname, './index.html')
    }
  }
};

module.exports = config;
