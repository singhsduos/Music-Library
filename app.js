const express = require('express')
const path = require('path')
const cors = require('cors')
const config = require('config')
const url = ""
module.exports = class App {
  constructor (appInit) {
    this.app = express()
    this.middleWare(appInit.middleWares)
    this.port = appInit.port
    this.routes(appInit.controllers)
    this.errorHandler(appInit.errorHandlers)
  }
  middleWare (middleWares) {
    middleWares.forEach(middleware => {
      if (typeof middleware === 'function') {
        this.app.use((req, res, next) => {
          middleware(req, res, err => {
            next()
          })
        })
      }
    })
    this.app.use(cors(url))
  }


  routes (controllers) {
    controllers.forEach(controller => {
      this.app.use(controller.path, controller.router)
    })
  }

  errorHandler (errorHandlers) {
    errorHandlers.forEach(errorHandler => {
      this.app.use(errorHandler)
    })
  }

  initDatabse () {
    const { dbConnect } = require('./db/mongodb')
    // dbConnect();
  }

  listen () {
    this.app.listen(this.port, () => {
      logger.info(`App listening on the http://localhost:${this.port}`)
      logger.info(`NODE_ENV: ${process.env.NODE_ENV}`)
    })
  }
}
