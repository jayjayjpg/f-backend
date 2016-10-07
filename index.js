const express = require('express');
const app = express();
const portNum = 4100;
const fs = require('fs');
var cnt = 0;
var db;
// var globSync   = require('glob').sync;
const execFile = require('child_process').execFile;
const jsonFromExcel = require('./server/createjsonfromexcel');
var mutJson;
const formatJson = require('./server/createjson');
const mainEmitter = formatJson.mEvents;
const MongoClient = require('mongodb').MongoClient;
var entityData;

MongoClient.connect('mongodb://localhost:27017', function(err, database){
  if (err) {
    return console.log(err);
  }
  db = database;
  app.listen(portNum, function(){
    console.log("listening on port " + portNum);
    jsonFromExcel.create(formatJson.create);
  });
});
  // var mocks      = globSync('./mocks/**/*.js', { cwd: __dirname }).map(require);
  // var proxies    = globSync('./proxies/**/*.js', { cwd: __dirname }).map(require); 

  // Log proxy requests
  // var morgan  = require('morgan');
  // app.use(morgan('dev'));

  app.on('listening', function(){
    if (cnt < 1){
      console.log("started up express!!");
      console.log("loaded " + cnt + " times.");
    // mainEmitter.on('hola', () => {
    // });
      cnt +=1;
    }
    next();
  });

  app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    entityData = require('./server/data/excel.json');
    next();
  });

  app.get('/api/mutations', function(req, res) {
    /*const preprocessData = execFile('./createjsonfromexcel.js', (error, stdout, stderr) => {
      if (error){
        throw error;
      }
      console.log(stdout);
    });*/
   // mainEmitter.on('hola', () => {
      res.header("Content-Type","application/vnd.api+json"); 
      mutJson = JSON.parse(fs.readFileSync('./server/data/excelmod.json'));
      res.send(mutJson);
   // });


   // formatJson.create();

  });
  app.get('/api/seed', function(req, res){
    entityData.forEach(function(currentJson){
      db.collection('entities').save(currentJson, function(err, res){
        if (err){
          return console.log(err);
        }
        console.log('saved to database');
      });
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



