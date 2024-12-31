const jwt = require('jsonwebtoken')
const config = require('config')
const { ErrorHandler } = require('./error-handler')
const { AuthUser } = require('../models/authUser.model')
const JWTPRIVATEKEY = process.env.JWTPRIVATERESETKEY

module.exports = {
  validateAdmin: async (req, res, next) => {
    const token = req.headers.authorization || req.headers.guest
    if (!token) throw new ErrorHandler(403, 'Token is Required')

    jwt.verify(token, JWTPRIVATEKEY, async (err, decodedToken) => {
      if (err) {
        throw new ErrorHandler(
          401,
          'Token is Invalid, please use a valid token'
        )
      } else {
        try {
          const userId = decodedToken.id
          req.user = decodedToken

          const user = await AuthUser.findOne({ _id: userId })

          if (!user) {
            throw new ErrorHandler(401, 'User not found')
          }

          if (user.superAdmin === false) {
            throw new ErrorHandler(403, 'Access denied')
          }

          next()
        } catch (error) {
          next(error)
        }
      }
    })
  }
}
