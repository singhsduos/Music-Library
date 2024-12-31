const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('config');
const uri = config.get('SECRETCONFIGURATION').MONGODB.MONGO_URL;
module.exports = async function() {
  return mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(m => {
      logger.info('connected to db..');
      return m.connection.getClient();
    })
    .catch(err => {
      logger.error(err);
    });
};



