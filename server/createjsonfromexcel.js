const fs = require('fs');
const Excel = require('exceljs');
const dataFiles = {
  'mutations': './server/interactions2.xlsx',
  'snps': './server/SNPannotation.xlsx',
  'interactions': './server/isnpnetwork.xlsx'
};

const EventEmitter = require('events');

exports.create = function (processCallback){
  console.log("Step 1: try to create json from raw excel");
  var workbook = new Excel.Workbook();
  var emitter = new EventEmitter();
  var processingFunc = {};
  
  function getDataFromWorkbook(dataFile, eventName, dataCallback){
    var resArray = [];
    workbook.xlsx.readFile(dataFile)
    .then(function(){
        dataCallback(resArray, eventName);
    });
  }
  
  processingFunc.getmutations  = function(dataArr, evName){
    var worksheet = workbook.getWorksheet(1);
    var col = worksheet.getColumn(1);
    var colScore = worksheet.getColumn(2);
    var resultFilePath = "./server/data/excel.json";

    worksheet.eachRow(function(row, rowNumber){
      for (var i = 0; i < 58; i += 1){
        var labelVal = worksheet.getRow(1).values[i+2];
        
        if (rowNumber > 1){
          var obj = {};
          obj.entityId = "mutMatrix";
          obj.patientId = labelVal;
          obj.rsId = row.getCell(1).value;
          obj.score = row.getCell(i+2).value;
          dataArr.push(obj);
        }   
      }
    });
    emitter.emit(evName);
    saveDataToJSON(dataArr, resultFilePath, evName);
  }
  
  processingFunc.getsnps = function(dataArr, evName){
    var worksheet = workbook.getWorksheet(1);
    var colSnp = worksheet.getColumn(1);
    var colFunc = worksheet.getColumn(2);
    var resultFilePath = "./server/data/snps.json";
    var row;

    for (var i = 1; i < 197; i += 1){
      var obj = {};
      row = worksheet.getRow(i);
      obj.rsId = row.getCell(1).value;
      obj.genomicRegion = row.getCell(2).value.toLowerCase();
      dataArr.push(obj);
    }
    emitter.emit(evName);
    saveDataToJSON(dataArr, resultFilePath, evName);
  }

 processingFunc.getinteractions = function(dataArr, evName){
    var worksheet = workbook.getWorksheet(1);
    var resultFilePath = "./server/data/interact.json";

    worksheet.eachRow(function(row, rowNumber){
        if (rowNumber === 1){
          return false;
        }
        var obj = {};
        obj.entityId = "interactMatrix";
        obj.actor = row.getCell(3).value;
        obj.actorId = row.getCell(2).value;
        obj.target = row.getCell(6).value;
        obj.targetSnp = row.getCell(1).value;
        dataArr.push(obj);
        
        if(rowNumber % 50 === 0){
          console.log("interaction object: " + JSON.stringify(obj));
        }
   
      
    });
    emitter.emit(evName);
    saveDataToJSON(dataArr, resultFilePath, evName);
  }
  
    for (var fileRef in dataFiles){
      getDataFromWorkbook(dataFiles[fileRef], fileRef+'Ready', processingFunc['get'+fileRef]); // oh wow, is this for real?
      emitter.on(fileRef+'Ready', function(){
        console.log("processed " + fileRef + ".");
      });
    }
  
  function saveDataToJSON(inputArr, path, processName){
    var resultJSON = JSON.stringify(inputArr);
    var resFilePath = path;
    fs.writeFile(resFilePath, resultJSON, function(err){
      if (err) {
        return console.log(err);
      }
      console.log(processName + "JSON file successfully saved: " + resFilePath);
    }); 
  }
}