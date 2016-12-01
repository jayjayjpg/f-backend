const AuthenticationController = require('./controllers/authentication'),
      DataController = require('./controllers/data'),
      express = require('express'),
      passportService = require('./config/passport'),
      passport = require('passport'),
      execFile = require('child_process').execFile;

const requireAuth = passport.authenticate('jwt', { session: false });  
const requireLogin = passport.authenticate('local', { session: false });

const REQUIRE_ADMIN = "Admin",  
      REQUIRE_OWNER = "Owner",
      REQUIRE_CLIENT = "Client",
      REQUIRE_MEMBER = "Member";

module.exports = function(app, data) {  
  // Initializing route groups
  const authRoutes = express.Router(),
        apiRoutes = express.Router();

      app.locals.jsonFromExcel = require('./server/createjsonfromexcel');
      app.locals.formatJson = require('./server/createjson');
      app.locals.jsonApiFormatter = require('./server/jsonApiFormatter');
      const mainEmitter = app.locals.formatJson.mEvents;

  //=========================
  // Auth Routes
  //=========================

  // Set auth routes as subgroup/middleware to apiRoutes
  app.use('/auth', authRoutes);
  app.use('/api/v1', apiRoutes);  // create api/v1 namespace for data routes 

  // Authentication Routes: Registration and Login
  authRoutes.post('/register', AuthenticationController.register);
  /* authRoutes.get('/register', function(req, res){
    res.send("register route works");
  }); */
  authRoutes.post('/login', requireLogin, AuthenticationController.login);
  
  apiRoutes.get('/dashboard', passport.authenticate('jwt', { session: false }), function(req,res){
    res.send('It worked! User id is: ' + req.user._id + '.');
  });

  apiRoutes.get('/seed', passport.authenticate('jwt', { session: false }), DataController.seedData );

  apiRoutes.get('/mutations', passport.authenticate('jwt', { session: false }), DataController.mutations);
  apiRoutes.get('/snps', passport.authenticate('jwt', { session: false }), DataController.snps); // TODO: activate controller method for queryng snps

  /* apiRoutes.get('/snps', function(req, res){
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
  }); */
  
  apiRoutes.get('/interactions', function(req, res){
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

 /* apiRoutes.get('/seed', function(req, res){
    var dataSetName;
    db.collection('entities').remove({}); // drop all collections before reseed
    db.collection('snps').remove({});
    db.collection('interactions').remove({});
    data.forEach(function(dataSet){
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
    res.send();
  });  */ // TODO: reactivate seed route once everything is rewritten for mongoose data handling

  // Login route


// Set url for API group routes
// TODO: Get all routes over into the router file
};
