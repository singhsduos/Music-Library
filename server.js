require('express-async-errors')
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const App = require('./app')
const config = require('config')
const morgan = require('morgan')
const logger = require('./helpers/logger')
const ErrorHandler = require('./helpers/error')
const cookie = require('cookie-parser')
const session = require('express-session')
const sessionOpt = require('./utils/session')()
global.logger = logger
global.ErrorHandler = ErrorHandler
const { accessHeaderMiddleware } = require('./middlewares/accessHeader')
const { invalidPath, error } = require('./middlewares/error-handler')
const { PermissionController } = require('./controllers/permisssion.controller')
const { AuthController } = require('./controllers/auth.controller')

const app = new App({
  port: config.SECRETCONFIGURATION.PORT || 10002,
  middleWares: [
    accessHeaderMiddleware,
    morgan('dev', { skip: avoid }),
    express.json(),
    express.urlencoded({ extended: true }),
    cookie(),
    session(sessionOpt)
  ],
  controllers: [new PermissionController(), new AuthController()],
  errorHandlers: [invalidPath, error]
})

process.on('uncaughtException', err => {
  logger.error(err, 'Uncaught exception')
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    {
      promise,
      reason
    },
    'unhandledRejection'
  )
  process.exit(1)
})


app.listen()


function avoid(req, res) {
  return res.statusCode === 304
}

async function flashSettings(req, res, next) {
  try {
    res.locals.COOKIES = req.cookies
    res.locals.SESSION = req.session
    next()
  } catch (error) {
    console.error('Error in flashSettings middleware:', error)
    next(error)
  }
}
