const jwt = require("jsonwebtoken");
const { ErrorHandler } = require('./error-handler');
const { User } = require('../models/user.model');
const { AuthenticationHandler, AuthorizationHandler } = require("../utils/handler");

const JWTPRIVATEKEY = process.env.JWTPRIVATERESETKEY;

const authenticateRequest = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            throw new ErrorHandler(400, 'Token is Required.');
        }

        const token = authHeader.replace("Bearer ", "");
        let decodedToken;

        try {
            decodedToken = jwt.verify(token, JWTPRIVATEKEY);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                throw new ErrorHandler(400, 'Token is Expired.');
            }
            throw new ErrorHandler(400, 'Token is Invalid, please use a valid token.');
        }
        const user = await User.findById(decodedToken.userId);
        if (!user) {
            throw new ErrorHandler(401, 'Unauthorized Access, User does not exist.');
        }

        req.user = user;
        
        const request = {
            user,
            route: req.originalUrl,
            operation: req.method.toLowerCase(),
        };

        const authChain = new AuthenticationHandler();
        authChain.setNext(new AuthorizationHandler());

        await authChain.handle(request);

        next();
    } catch (error) {
        if (error instanceof ErrorHandler) {
            return res.status(error.statusCode).json({
                status: error.statusCode,
                data: null,
                message: error.message,
                error: null,
            });
        }

        console.error('Unexpected error in authentication:', error.message);
        next(error);
    }
};

module.exports = authenticateRequest;
