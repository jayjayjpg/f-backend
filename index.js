const express = require('express');
const app = express();
const portNum = 4100;
const MongoClient = require('mongodb').MongoClient,
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      logger = require('morgan');
const fs = require('fs');
var cnt = 0;
var db;
var mutJson;
var entityData = {};
var snpData = {};
var interactionsData = {};
var dataPile = [];
var router = express.Router();
var config = require('./config/main');
const router = require('./router'); 

// var auth = require('./server/auth.js');

// var globSync   = require('glob').sync;
const execFile = require('child_process').execFile;
app.locals.jsonFromExcel = require('./server/createjsonfromexcel');
app.locals.formatJson = require('./server/createjson');
app.locals.jsonApiFormatter = require('./server/jsonApiFormatter');


const mainEmitter = app.locals.formatJson.mEvents;


mongoose.connect(config.database);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* function(err, database){
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
    interactionsData.data = require('./server/data/interact.json');
    interactionsData.name = "interactions";
    dataPile.push(entityData);
    dataPile.push(snpData);
    dataPile.push(interactionsData);
  });
}); */
  // var mocks      = globSync('./mocks/**/*.js', { cwd: __dirname }).map(require);
  // var proxies    = globSync('./proxies/**/*.js', { cwd: __dirname }).map(require); 

  // Log proxy requests
  // var morgan  = require('morgan');
  // app.use(morgan('dev'));

  if(process.env.NODE_ENV === 'development') {
    app.use(function(req, res, next){
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
      next();
    });
  };

  if(process.env.NODE_ENV === 'production') {
    app.use(function(req, res, next){
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
      if (req.method == 'OPTIONS') {
        res.status(200).end();
      } else {
        next();
      }
    });
  };
 // authentication middleware
 // app.all('/api/v1/*', [require('./middlewares/validateRequest')]);
  
  // router.post('/login', auth.login);

  app.get('/api/v1/mutations', function(req, res) {
      // can now filter for single snp by rsId. E.g /api/mutations?rsId=rs2425019
      // can now query for several rsIds in one call: /api/mutations?rs2425019,rs6088765
      var queryObj = {};
      if (req.query.rsId != undefined){
        var rsParam = req.query.rsId.split(","); // sample rsIds: rs2425019 rs6088765 rs7404095
        queryObj = {rsId: { $in: rsParam } };
      }
      res.header("Content-Type","application/vnd.api+json"); 
      db.collection('entities').find(queryObj).toArray(function(err, response){
       // console.log("app.get mutations response: " + JSON.stringify(response));
        var jsonApiResponse = app.locals.jsonApiFormatter.jsonToJsonApi(response, "mutation");
        res.send(jsonApiResponse); 
       // res.send(rsParam);
      });
  });
  

  app.get('/api/v1/snps', function(req, res){
      var queryObj = {};
      if (req.query.region != undefined){
        var regionType = req.query.region.split(","); // sample rsIds: rs2425019 rs6088765 rs7404095
        queryObj = {genomicRegion: { $in: regionType } };
      }
      if (req.query.rsId != undefined){
        var rsId = req.query.rsId.split(",");
        queryObj.rsId = { $in: rsId };
      }
    res.header("Content-Type","application/vdn.api+json");
    db.collection('snps').find(queryObj).toArray(function(err, response){
      var jsonSnpRes = app.locals.jsonApiFormatter.jsonToJsonApi(response, "snp");
      res.send(jsonSnpRes);
    });
  });
  
  app.get('/api/v1/interactions', function(req, res){
    var queryObj = {};
    if (req.query.rsId != undefined){
      var rsIds = req.query.rsId.split(",");
      queryObj.targetSnp = { $in: rsIds };
    }
    res.header("Content-Type","application/vdn.api+json");
    db.collection('interactions').find(queryObj).toArray(function(err, response){
      var jsonIntRes = app.locals.jsonApiFormatter.jsonToJsonApi(response, "interaction");
      res.send(jsonIntRes);
    });
  });

  app.get('/api/v1/seed', function(req, res){
    var dataSetName;
    db.collection('entities').remove({}); // drop all collections before reseed
    db.collection('snps').remove({});
    db.collection('interactions').remove({});
    dataPile.forEach(function(dataSet){
      dataSetName = dataSet.name;
      dataSet.data.forEach(function(currentJson, index){
        db.collection(dataSetName).save(currentJson, function(err, res){
          if (err){
            return console.log(err);
          }
        });
      });
      console.log(dataSetName + " has been successfully saved in the db.");
    });

    res.redirect('/');
  });

  /* app.get('/api/interactions', function(req,res) {
     jsonFromExcel.create(formatJson.create);
     mainEmitter.on('hola', () => {
        const inst = fs.readFileSync('./server/data/interactions.tsv');
        res.send(inst);
     });
  }); */
  
  

  // mocks.forEach(function(route) { route(app); });
  // proxies.forEach(function(route) { route(app); });



