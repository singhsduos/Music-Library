const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('./error-handler');
const JWTPRIVATEKEY = process.env.JWTPRIVATERESETKEY;

module.exports = {
  validateToken: async (req, res, next) => {
    try {
      const authHeader = req.header("Authorization");
      if (!authHeader) {
        return next(new ErrorHandler(400, 'Token is Required.'));
      }

      const token = authHeader.replace("Bearer ", "");

      jwt.verify(token, JWTPRIVATEKEY, (err, decodedToken) => {
        if (err) {
          console.log("Token Error:", err);
          return next(new ErrorHandler(400, 'Token is Invalid or Expired.'));
        }

        req.user = decodedToken;
        next();
      });
    } catch (error) {
      next(error);
    }
  }
};
