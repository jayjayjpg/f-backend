const express = require('express');
const app = express();
const portNum = 4100;
const fs = require('fs');
var cnt = 0;

app.listen(portNum, function(){
  console.log("listening on port " + portNum);
});



  // var globSync   = require('glob').sync;
  const execFile = require('child_process').execFile;
  const jsonFromExcel = require('./server/createjsonfromexcel');
  var mutJson;
  const formatJson = require('./server/createjson');
  const mainEmitter = formatJson.mEvents;
  // var mocks      = globSync('./mocks/**/*.js', { cwd: __dirname }).map(require);
  // var proxies    = globSync('./proxies/**/*.js', { cwd: __dirname }).map(require); 

  // Log proxy requests
  // var morgan  = require('morgan');
  // app.use(morgan('dev'));

  app.on('listening', function(){
    if (cnt < 1){
      console.log("started up express!!");
      console.log("loaded " + cnt + " times.");
      jsonFromExcel.create(formatJson.create);
    // mainEmitter.on('hola', () => {
    // });
      cnt +=1;
    }
    next();
  });

  app.get('/api/mutations', function(req, res) {
    /*const preprocessData = execFile('./createjsonfromexcel.js', (error, stdout, stderr) => {
      if (error){
        throw error;
      }
      console.log(stdout);
    });*/
    res.header("Content-Type","application/vnd.api+json"); 
    mutJson = JSON.parse(fs.readFileSync('server/data/excelmod.json'));
    res.send(mutJson);

   // formatJson.create();

  });

  app.get('/api/interactions', function(req,res) {
    const inst = fs.readFileSync('server/data/interactions.tsv');
    res.send(inst);
  });
  
  

  // mocks.forEach(function(route) { route(app); });
  // proxies.forEach(function(route) { route(app); });



