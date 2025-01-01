require('dotenv').config();
require('express-async-errors');
const cookie = require('cookie-parser');
const config = require('config');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');

const App = require('./app');
const logger = require('./helpers/logger');
const sessionOpt = require('./utils/session');

const { invalidPath, error, ErrorHandler } = require('./middlewares/error-handler');
const { accessHeaderMiddleware } = require('./middlewares/accessHeader');

const { AlbumController } = require('./controllers/album.controller');
const { ArtistController } = require('./controllers/artist.controller');
const { AuthController } = require('./controllers/auth.controller');
const { FavoritesController } = require('./controllers/favorite.controller');
const { PermissionController } = require('./controllers/permisssion.controller');
const { UserController } = require('./controllers/users.controller');
const { TrackController } = require('./controllers/track.controller');


global.logger = logger;
global.ErrorHandler = ErrorHandler;

const PORT = config.SECRETCONFIGURATION.PORT || 10002;

const middlewares = [
  accessHeaderMiddleware,
  morgan('dev', { skip: avoid }),
  express.json(),
  express.urlencoded({ extended: true }),
  cookie(),
  session(sessionOpt())
];

const controllers = [
  new AlbumController(),
  new ArtistController(),
  new AuthController(),
  new FavoritesController(),
  new PermissionController(),
  new UserController(),
  new TrackController()
];

const errorHandlers = [invalidPath, error];

const app = new App({
  port: PORT,
  middleWares: middlewares,
  controllers: controllers,
  errorHandlers: errorHandlers
});

process.on('uncaughtException', (err) => {
  logger.error(err, 'Uncaught exception');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ promise, reason }, 'unhandledRejection');
  process.exit(1);
});

app.listen();


function avoid(req, res) {
  return res.statusCode === 304;
}
