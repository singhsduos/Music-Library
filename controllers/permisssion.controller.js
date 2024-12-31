const config = require('config');
const express = require('express');
const { BSPPaymentsService } = require('../services/permission.service');
const errorHandler = require('../utils/errorHandler.util');
class PermissionController {
  constructor() {
    this.path = '/permission';
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post('/add', this.addPermission);
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
