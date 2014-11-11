'use strict';

var config = require('./config');
var database = require('./services/database');
var express = require('express');
var app = express();

module.exports = app;
app.db = database;
require('./routes/index')(app);

app.listen(config.express.port_num, function (error) {
  if (error) {
    console.log(error);
  }
  console.log("listening on port: %d",config.express.port_num);
});