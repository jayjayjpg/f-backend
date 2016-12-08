# Facade Backend

This is the backend app for the facade project. You can run it locally or find access to the latest
deployed version at ....

## Installation

1. Download the latest source from the github repo:

``git clone SOMETHING SOMETHING``

2. Get [MongoDB](https://docs.mongodb.com/manual/installation/) installed
  If MongoDB is setup properly you should be able to connect to it, by running an db instance via
``mongod`` and connecting to it with your mongo client by ``mongo``
You can shutdown the MongoDB server instance with the command
``mongod --shutdown``

3. Install the backend app
Move into the directory where you have downloaded the github repo and install all dependencies via npm:
      cd f-backend/
      npm install
Running into trouble? Try upgrading to the latest version of node or switching to the latest version using
``nvm`` or ``n`` and running in the root of the project directory:
      rm -rf node_modules/
      npm cache clean
      npm install

4. Spin up the backend
  Spin up your mongodb instance as described in step 2.
  In the root directory of the project run
  ``npm run dev``
  You can now reach the locally running app on (http://localhost:4100)[http://localhost:4100]
Running into trouble? Check if your mongodb instance is running properly at ``mongodb://localhost:27017``

## Heroku config variables

The following config variables are setup in Heroku to distinguish between configurations of test and production environment. All config variables defined in Heroku can be accessed via the process.env object in this app. 
Example: 
      // Setting the Heroku config variable FOO to the value "bar" via the heroku client 
      heroku config:set FOO=bar 
      // Accessing the config variable FOO in the ExpressJS app
      process.env.FOO // "bar"

* HEROKUENV_FBE_SECRET - secret needed in JWT token encryption






