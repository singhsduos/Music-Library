module.exports.invalidPath = (
  '*',
  (req, res, next) => {
    // next(new ErrorHandler(404, `Invalid API :: ${req.method} : ${req.url}`, 'Error:may be Controller file not included in server.js file'))
    res.render('pages/notfound', { layout: 'layouts/login' })
  }
)

module.exports.error = (err, req, res, next) => {
  const { statusCode, message } = err
  if (err.actualError) console.error(err.actualError)
  logger.warn(err)
  res.status(statusCode || 500)
  res.setHeader('Content-Type', 'application/json')
  return res.json({
    status: 'error',
    message: message || 'Internal server error.',
    data: []
  })
}

class ErrorHandler extends Error {
  constructor (statusCode, message, actualError) {
    super()
    this.statusCode = statusCode
    this.message = message
    this.actualError = actualError
  }
}

module.exports.ErrorHandler = ErrorHandler
