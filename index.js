const express = require('express');
const app = express();
const mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      logger = require('morgan');
const fs = require('fs');
var cnt = 0;
var db;
var mutJson;




var config = require('./config/main');
const router = require('./router'); 
const dataPile = require('./server/dataAccumulate');
const jsonFromExcel = require('./server/createjsonfromexcel');

const server = app.listen(config.port, jsonFromExcel.create);
const dataCollected = dataPile.create();
console.log('Your server is running on port ' + config.port + '.'); 

// Setting up basic middleware for all Express requests
app.use(logger('dev')); // Log requests to API using morgan

// Enable CORS from client-side
app.use(function(req, res, next) {  
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});



mongoose.connect(config.database);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

  
router(app, dataCollected);

