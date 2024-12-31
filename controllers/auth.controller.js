const config = require('config');
const express = require('express');
const { AuthService } = require('../services/auth.service');
const authenticateRequest = require("../middlewares/authenticateRequest");
const { ErrorHandler } = require('../middlewares/error-handler');

class AuthController {
  constructor() {
    this.path = '';
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post('/signup', this.signUpUser);
    this.router.post('/login', this.signInUser);
  }

  async signUpUser(req, res, next) {
    try {
      const userCreated = await AuthService.signUp(req);
      if (userCreated) {
        return res.status(201).json({
          status: 201,
          data: null,
          message: 'User created successfully.',
          error: null,
        });
      }
      next(new ErrorHandler(400, 'Failed to create user.'));
    } catch (error) {
      console.log('User Sign-Up error: ', error.message);
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
  async signInUser(req, res, next) {
    try {
      const { token } = await AuthService.signIn(req);
      return res.status(200).json({
        status: 200,
        data: { token },
        message: 'Login successful.',
        error: null,
      });
    } catch (error) {
      console.log('User Login error: ', error.message);

      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({
          status: error.statusCode,
          data: null,
          message: error.message,
          error: null,
        });
      }

      next(error);
    }
  }
}



exports.AuthController = AuthController
