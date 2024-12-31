const config = require('config');
const express = require('express');
const { UserService } = require('../services/user.service');
const authenticateRequest = require("../middlewares/authenticateRequest");

class UserController {
    constructor() {
        this.path = '/users';
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/', authenticateRequest, this.getUsers);
        this.router.post('/add-user', authenticateRequest, this.addUser);
    }

    async getUsers(req, res, next) {
        try {
            const users = await UserService.getUsers(req);
            res.status(200).json({
                status: 200,
                data: users,
                message: "Users retrieved successfully.",
                error: null,
            });
        } catch (error) {
            console.log('User List error: ', error.message);
            if (error instanceof ErrorHandler) {
                return res.status(error.statusCode).json(
                    {
                        "status": error.statusCode,
                        "data": null,
                        "message": error.message,
                        "error": null
                    }
                );
            }
            next(error);
        }
    }

    async addUser(req, res, next) {
        try {
            const user = await UserService.addUser(req);

            res.status(201).json({
                status: 201,
                data: null,
                message: 'User created successfully.',
                error: null
            });
        } catch (error) {
            console.log('Error Creating User: ', error.message);
            if (error instanceof ErrorHandler) {
                return res.status(error.statusCode).json(
                    {
                        "status": error.statusCode,
                        "data": null,
                        "message": error.message,
                        "error": null
                    }
                );
            }
            next(error);
        }
    }

}



exports.UserController = UserController
