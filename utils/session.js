const MongoStore = require('connect-mongo')
const mongoClient = require('../db/mongodb')()
const config = require('config')
const dbConfig = config.get('SECRETCONFIGURATION.MONGODB')

const fiveMinutes = 5 * 60 * 1000 

module.exports = function () {
  return {
    secret: process.env.SESSION_SECRET || 'default_secret',
    cookie: {
      maxAge: fiveMinutes,
      httpOnly: true,
      secure: true,
      sameSite: 'None' 
    },
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      clientPromise: mongoClient,
      collectionName: 'sessions',
      dbName: dbConfig.DB_NAME,
      stringify: false,
      autoRemove: 'interval',
      autoRemoveInterval: 1
    })
  }
}
