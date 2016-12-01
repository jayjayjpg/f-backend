module.exports = {  
  // Secret key for JWT signing and encryption
  'secret': 'super secret passphrase', // TODO: check where to save the secret in production
  // Database connection information
  'database': 'mongodb://localhost:27017', // TODO: check for process env variable in production
  // Setting port for server
  'port': process.env.PORT || 4100
} 
