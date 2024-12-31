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
            throw new ErrorHandler(401, "Unauthorized");
        }
        return super.handle(request);
    }
}

class AuthorizationHandler extends Handler {
    async handle(request) {
        if (request.user.role === 'Admin') {
            console.log("dddddddd")
            return true;
        }

        const permissions = await Permission.findOne({ role: request.user.role });

        if (
            !permissions ||
            !permissions.permissions.get(request.route)?.includes(request.operation)
        ) {
            throw new ErrorHandler(403, "Forbidden");
        }

        return super.handle(request);
    }
}

module.exports = {
    Handler,
    AuthenticationHandler,
    AuthorizationHandler,
};
