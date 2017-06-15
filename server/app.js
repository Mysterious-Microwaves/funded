'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const redis = require('../redis');
const psql = require('../psql');
const utils = require('../utils');
const cronWorker = require('../workers/cron.js');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/getFunding', (req, res) => {
  utils.retrieve.readAll(req.query.data, res);
});

app.get('/getNearlyFunded', (req, res) => {
  utils.retrieve.getNearlyFunded(res);
});

cronWorker.init();

module.exports = app;