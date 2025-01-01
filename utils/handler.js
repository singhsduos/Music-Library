const { Permission } = require('../models/permission.model');

class Handler {
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }

    async handle(request) {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        return true;
    }
}

class AuthenticationHandler extends Handler {
    async handle(request) {
        if (!request.user) {
            throw new ErrorHandler(401, "Unauthorized Access");
        }
        return super.handle(request);
    }
}

class AuthorizationHandler extends Handler {
    async handle(request) {
        if (request.user.role === 'Admin') {
            return true;
        }

        const permissions = await Permission.findOne({ role: request.user.role });
        if (!permissions || !(permissions.permissions instanceof Map)) {
            throw new ErrorHandler(401, "Unauthorized Access");
        }

        const splitRoute = request.route.split("/");
        const baseRoute = `/${splitRoute[1]}`;

        const allowedOperations = permissions.permissions.get(baseRoute);

        if (!allowedOperations || !allowedOperations.includes(request.operation)) {
            throw new ErrorHandler(401, "Unauthorized Access");
        }

        return super.handle(request);
    }
}


module.exports = {
    Handler,
    AuthenticationHandler,
    AuthorizationHandler,
};
