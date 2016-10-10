const express = require('express');
const app = express();
const portNum = 4100;
const fs = require('fs');
var cnt = 0;
var db;
var mutJson;
const MongoClient = require('mongodb').MongoClient;
var entityData = {};
var snpData = {};
var dataPile = [];

// var globSync   = require('glob').sync;
const execFile = require('child_process').execFile;
app.locals.jsonFromExcel = require('./server/createjsonfromexcel');
app.locals.formatJson = require('./server/createjson');
app.locals.jsonApiFormatter = require('./server/jsonApiFormatter');


const mainEmitter = app.locals.formatJson.mEvents;


MongoClient.connect('mongodb://localhost:27017', function(err, database){
  if (err) {
    return console.log(err);
  }
  db = database;
  app.listen(portNum, function(){
    dataPile = [];
    console.log("listening on port " + portNum);
    app.locals.jsonFromExcel.create();
    entityData.data = require('./server/data/excel.json');
    entityData.name = "entities";
    snpData.data = require('./server/data/snps.json');
    snpData.name = "snps";
    dataPile.push(entityData);
    dataPile.push(snpData);
  });
});
  // var mocks      = globSync('./mocks/**/*.js', { cwd: __dirname }).map(require);
  // var proxies    = globSync('./proxies/**/*.js', { cwd: __dirname }).map(require); 

  // Log proxy requests
  // var morgan  = require('morgan');
  // app.use(morgan('dev'));


  app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
  });

  app.get('/api/mutations', function(req, res) {
      res.header("Content-Type","application/vnd.api+json"); 
      app.locals.jsonApiFormatter.jsonToJsonApi({"id": 1}, "mutation");
      app.locals.jsonApiFormatter.jsonToJsonApi([{"id": 1},{"id": 2}], "aspiration");
      // mutJson = JSON.parse(fs.readFileSync('./server/data/excelmod.json'));
      // res.send(mutJson);
      db.collection('entities').find().toArray(function(err, response){
       // console.log("app.get mutations response: " + JSON.stringify(response));
        var jsonApiResponse = app.locals.jsonApiFormatter.jsonToJsonApi(response, "mutation");
        res.send(jsonApiResponse); // TODO: send the response in seperate function in component desired format
      });
  });

  app.get('/api/seed', function(req, res){
    var dataSetName;
    db.collection('entities').remove({}); // drop all collections before reseed
    db.collection('snps').remove({});
    dataPile.forEach(function(dataSet){
      dataSetName = dataSet.name;
      dataSet.data.forEach(function(currentJson, index){
        db.collection(dataSetName).save(currentJson, function(err, res){
          if (err){
            return console.log(err);
          }
         /* if (index % 20 === 0){
            console.log("index" + index + ": saves to database " + JSON.stringify(currentJson));
          } */
        });
      });
      console.log(dataSetName + " has been successfully saved in the db.");
    });

    res.redirect('/');
  });

  app.get('/api/interactions', function(req,res) {
     jsonFromExcel.create(formatJson.create);
     mainEmitter.on('hola', () => {
        const inst = fs.readFileSync('./server/data/interactions.tsv');
        res.send(inst);
     });
  });
  
  

  // mocks.forEach(function(route) { route(app); });
  // proxies.forEach(function(route) { route(app); });



