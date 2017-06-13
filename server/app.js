'use strict';
const express = require('express');
const routes = require('./routes');
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

cronWorker.init();

module.exports = app;