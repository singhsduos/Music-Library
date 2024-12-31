const jwt = require('jsonwebtoken')
const config = require('config')
const { ErrorHandler } = require('./error-handler')
const JWTPRIVATEKEY = config.get('SECRETCONFIGURATION.JWTPRIVATEKEY')

module.exports = {
  validateToken: async (req, res, next) => {
    let token = req.headers.authorization || req.headers.guest
    if (!token) throw new ErrorHandler(403, 'Token is Required')
    jwt.verify(token, JWTPRIVATEKEY, function (err, decodedToken) {
      if (err) {
        throw new ErrorHandler(
          401,
          'Token is Invalid, please use a valid token',
          err
        )
      } else {
        req.user = decodedToken
        next()
      }
    })
  }
}
