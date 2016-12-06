const AuthenticationController = require('./controllers/authentication'),
      DataController = require('./controllers/data'),
      express = require('express'),
      passportService = require('./config/passport'),
      passport = require('passport'),
      execFile = require('child_process').execFile;

const requireAuth = passport.authenticate('jwt', { session: false });  
const requireLogin = passport.authenticate('local', { session: false });
const logUserIn = AuthenticationController.login("Member");

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
  // Namespacing Route SubGroups
  //=========================
      
      
  // Set auth routes as subgroup/middleware to apiRoutes
  app.use('/auth', authRoutes);
  app.use('/api/v1', apiRoutes);  // create api/v1 namespace for data routes 

  //=========================
  // Auth Routes
  //=========================


  // Authentication Routes: Registration and Login
  // Here the server's response to post requests for the /auth/register and the /auth/login routes are defined
  authRoutes.post('/register', AuthenticationController.register);
  authRoutes.post('/login', requireLogin, logUserIn); // TODO: figure out if role authorization should be done after the login

  //=========================
  // Data Routes
  //=========================
  
  apiRoutes.get('/dashboard', passport.authenticate('jwt', { session: false }), function(req,res){
    res.send('It worked! User id is: ' + req.user._id + '.');
  });

  // route to seed data compiled from excel files into json into the mongo db
  apiRoutes.get('/seed', passport.authenticate('jwt', { session: false }), DataController.seedData );

  apiRoutes.get('/mutations', passport.authenticate('jwt', { session: false }), DataController.mutations);
  apiRoutes.get('/snps', passport.authenticate('jwt', { session: false }), DataController.snps); 
  apiRoutes.get('/interactions', passport.authenticate('jwt', { session: false }), DataController.interactions);
  

};
