const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const { UserService } = require('../services/user.service');
const authenticateRequest = require("../middlewares/authenticateRequest");
const { validateToken } = require('../middlewares/validateToken');


class UserController {
    constructor() {
        this.path = '/users';
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/', authenticateRequest, this.getUsers);
        this.router.post('/add-user', authenticateRequest, this.addUser);
        this.router.delete('/:id', authenticateRequest, this.deleteUser);
        this.router.put('/update-password', validateToken, this.updatePassword);
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

    async deleteUser(req, res, next) {
        try {
            const { id: userId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                throw new ErrorHandler(400, 'Bad Request: Invalid User ID.');
            }

            const response = await UserService.deleteUser(userId);

            res.status(200).json({
                status: 200,
                data: null,
                message: 'User deleted successfully',
                error: null
            });
        } catch (error) {
            console.log('Error Deleting User: ', error.message);
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

    async updatePassword(req, res, next) {
        try {

            const response = await UserService.updatePassword(req);

            res.status(204).json({
                status: 204,
                data: null,
                message: 'User updated password successfully',
                error: null
            });
        } catch (error) {
            console.log('Error Updating Password: ', error.message);
            if (error instanceof ErrorHandler) {
                return res.status(error.statusCode).json({
                    status: error.statusCode,
                    data: null,
                    message: error.message,
                    error: null
                });
            }
            next(error);
        }
    }

}



exports.UserController = UserController
