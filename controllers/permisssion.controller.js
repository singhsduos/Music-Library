const config = require('config');
const express = require('express');
const { PermissionsService } = require('../services/permission.service');
const errorHandler = require('../utils/errorHandler.util');
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
      
    } catch (error) {
      console.log('Permission error: ', error);
      return errorHandler(req, res);
    }
  }
}



exports.PermissionController = PermissionController
