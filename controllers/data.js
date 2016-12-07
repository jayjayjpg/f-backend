const Mutation = require('../models/mutation'),
      Snp = require('../models/snp'),
      Interaction = require('../models/interaction'),
      config = require('../config/main'); 

  const jsonFromExcel = require('../server/createjsonfromexcel');
  const formatJson = require('../server/createjson');
  const jsonApiFormatter = require('../server/jsonApiFormatter');
  const mainEmitter = formatJson.mEvents;
  const dataPile = require('../server/dataAccumulate');
  const data = dataPile.create();

//========================================
// Mutations Route /apiNameSpace/mutations
//========================================
exports.mutations = function(req, res, next) {
  // can now filter for single snp by rsId. E.g /api/mutations?rsId=rs2425019
  // can now query for several rsIds in one call: /api/mutations?rs2425019,rs6088765
  var queryObj = {};
  var mutArr = [];
  if (req.query.rsId != undefined){
    var rsParam = req.query.rsId.split(","); // sample rsIds: rs2425019 rs6088765 rs7404095
    queryObj = {rsId: { $in: rsParam } }; // TODO: reactivate SNP queries in the url now using mongoose
  }

  Mutation.find(queryObj, function(err, muts){
    if (err) { 
      return next(err); 
    }
    muts.forEach(function(mut, index){
      mutArr.push({
        id: index,
        patientId: mut.patientId,
        rsId: mut.rsId,
        score: mut.score
      });
    });
    let jsonRes = jsonApiFormatter.jsonToJsonApi(mutArr, "mutation");
    res.header("Content-Type","application/vnd.api+json");
    res.status(200).send(jsonRes);
  
  });

};

//========================================
// Snps Route /apiNameSpace/snps
//========================================
exports.snps = function(req, res, next) {
  var queryObj = {};
  var snpArr = [];
  if (req.query.rsId != undefined){
    var rsParam = req.query.rsId.split(","); // sample rsIds: rs2425019 rs6088765 rs7404095
    queryObj = {rsId: { $in: rsParam } }; // TODO: reactivate SNP queries in the url now using mongoose
  }
  if (req.query.region != undefined){
    var rsParam = req.query.region.split(","); // sample rsIds: rs2425019 rs6088765 rs7404095
    queryObj = {genomicRegion: { $in: rsParam } }; // TODO: reactivate SNP queries in the url now using mongoose
  }

  Snp.find(queryObj, function(err, snps){
    if (err) { 
      return next(err); 
    }

    snps.forEach(function(snp, index){
      snpArr.push({
        id: index,
        rsId: snp.rsId,
        genomicRegion: snp.genomicRegion
      });
    });
    let jsonRes = jsonApiFormatter.jsonToJsonApi(snpArr, "snp");
    res.header("Content-Type","application/vnd.api+json");
    res.status(200).send(jsonRes);
  
  });

};

//========================================
// Snps Route /apiNameSpace/snps
//========================================
exports.interactions = function(req, res, next) {

  var queryObj = {};
  var intArr = [];
  if (req.query.rsId != undefined){
    var rsParam = req.query.rsId.split(","); // sample rsIds: rs2425019 rs6088765 rs7404095
    queryObj = {targetSnp: { $in: rsParam } }; // TODO: reactivate SNP queries in the url now using mongoose
  }

  Interaction.find(queryObj, function(err, interactions){
    if (err) { 
      return next(err); 
    }

    interactions.forEach(function(interaction, index){
      intArr.push({
        id: index,
        actor: interaction.actor,
        actorId: interaction.actorId,
        target: interaction.target,
        targetSnp: interaction.targetSnp
      });
    });
    let jsonRes = jsonApiFormatter.jsonToJsonApi(intArr, "interaction");
    res.header("Content-Type","application/vnd.api+json");
    res.status(200).send(jsonRes);
  
  });

};


exports.seedData = function(req, res){
  seedMutations(req,res);
  seedSnps(req,res);
  seedInteractions(req,res);
  res.status(200).send("succesfully saved mutations + snps data in database.");
};

function seedMutations(req, res){
  let dataSetName = "mutation";
  Mutation.db.db.dropCollection('mutations'); // dropping collections only works with colllection name in plural 
  let dataSet = data[0];
  let mut;
  dataSet.data.forEach(function(currentJson, index){
    // onsole.log("JSON current mut: " + JSON.stringify(currentJson));
    // example json: {"entityId":"mutMatrix","patientId":"IW3157131","rsId":"rs6940798","score":1}
    mut = new Mutation({
      entityId: currentJson.entityId,
      patientId: currentJson.patientId,
      rsId: currentJson.rsId,
      score: currentJson.score
    }); 
    mut.save(function(err, mut){
      if (err){
        return console.log(err);
      }
    });
  }); 
  // res.status(200).send("succesfully saved mutations data in database.");
};

function seedSnps(req, res){
  let dataSetName = "snp";
  Snp.db.db.dropCollection('snps'); // dropping collections only works with colllection name in plural 
  let dataSet = data[1];
  let snp;
  dataSet.data.forEach(function(currentJson, index){
    // onsole.log("JSON current mut: " + JSON.stringify(currentJson));
    // example json: {"entityId":"mutMatrix","patientId":"IW3157131","rsId":"rs6940798","score":1}
    snp = new Snp({
      rsId: currentJson.rsId,
      genomicRegion: currentJson.genomicRegion
    }); 
    // console.log("mut model: " + JSON.stringify(mut));
    snp.save(function(err, snp){
      if (err){
        return console.log(err);
      }
      // console.log(dataSetName + " has been successfully saved in the db.");
    });
  });
};

function seedInteractions(req, res){
  let dataSetName = "interaction";
  Snp.db.db.dropCollection('interactions'); // dropping collections only works with colllection name in plural 
  let dataSet = data[2];
  let interact;
  dataSet.data.forEach(function(currentJson, index){
    // onsole.log("JSON current mut: " + JSON.stringify(currentJson));
    // example json: {"entityId":"mutMatrix","patientId":"IW3157131","rsId":"rs6940798","score":1}
    interact = new Interaction({
      actorId: currentJson.actorId,
      actor: currentJson.actor,
      target: currentJson.target,
      targetSnp: currentJson.targetSnp
    }); 
    // console.log("mut model: " + JSON.stringify(mut));
    interact.save(function(err, interact){
      if (err){
        return console.log(err);
      }
      // console.log(dataSetName + " has been successfully saved in the db.");
    });
  });
};




