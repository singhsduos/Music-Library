const logger = require('../utils/logger'); 
module.exports.invalidPath = (
  '*',
  (req, res, next) => {
    next(new ErrorHandler(404, `Invalid API :: ${req.method} : ${req.url}`, 'Error:may be Controller file not included in server.js file'));
  }
);

module.exports.error = (err, req, res, next) => {
  const { statusCode, message, actualError } = err;

  if (actualError) {
    logger.warn(actualError);
  }

  const responseStatus = statusCode || 500;

  logger.error(message || 'Internal server error.');

  res.status(responseStatus)
  .setHeader('Content-Type', 'application/json')
  .json({
    status: 'error',
    message: message || 'Internal server error.',
    data: [],
  });
};

class ErrorHandler extends Error {
  constructor(statusCode, message, actualError = null) {
    super(message); 
    this.statusCode = statusCode;
    this.message = message;
    this.actualError = actualError;
  }
}

module.exports.ErrorHandler = ErrorHandler;
