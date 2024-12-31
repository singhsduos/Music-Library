const jwt = require("jsonwebtoken");
const config = require('config')
const { ErrorHandler } = require('./error-handler')
const { User } = require('../models/user.model')
const { AuthenticationHandler, AuthorizationHandler } = require("../utils/handler");
const JWTPRIVATEKEY = process.env.JWTPRIVATERESETKEY

const authenticateRequest = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
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

                    const user = await User.findById(userId);

                    if (!user) throw new Error("Unauthorized");

                    const request = {
                        user,
                        route: req.originalUrl,
                        operation: req.method.toLowerCase(),
                    };

                    const authChain = new AuthenticationHandler();
                    authChain.setNext(new AuthorizationHandler());

                    await authChain.handle(request);

                    next()
                } catch (error) {
                    next(error)
                }
            }
        })
    } catch (error) {
        res.status(403).send({ error: error.message });
    }
};

module.exports = authenticateRequest;
