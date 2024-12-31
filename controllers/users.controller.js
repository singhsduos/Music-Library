const config = require('config');
const express = require('express');
const { UserService } = require('../services/user.service');
const authenticateRequest = require("../middlewares/authenticateRequest");

class UserController {
  constructor() {
    this.path = '';
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
     this.router.get('/users', authenticateRequest, this.getUsers);
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
      next(error);
    }
  }

}



exports.UserController = UserController
