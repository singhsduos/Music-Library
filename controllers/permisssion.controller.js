const config = require('config');
const express = require('express');
const { PermissionsService } = require('../services/permission.service');
const authenticateRequest = require("../middlewares/authenticateRequest");

class PermissionController {
  constructor() {
    this.path = '/permission';
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post('/add', authenticateRequest, this.addPermission);
  }

  async addPermission(req, res, next) {
    try {
      const result = await PermissionsService.addPermission(req);

      return res.status(result.status).json({
        status: result.status,
        data: result.data,
        message: result.message,
        error: null,
      });
    } catch (error) {
      console.log('Permission error: ', error);

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



exports.PermissionController = PermissionController
