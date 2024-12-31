const config = require('config')
const { Permission } = require('../models/permission.model')

class Permissions {
  async addPermission(req) {
    const { role, permissions } = req.body;

    if (!role || !permissions) {
      throw new ErrorHandler(400, `Bad Request, Reason: ${!role ? 'Missing role' : 'Missing permissions'}`);
    }

    try {
      if (role === 'Admin') {
        return {
          status: 200,
          message: "Admin role already has all permissions.",
          data: null,
        };
      }

      const existingPermission = await Permission.findOne({ role });

      if (existingPermission) {
        existingPermission.permissions = permissions;
        await existingPermission.save();
      } else {
        await new Permission({ role, permissions }).save();
      }

      return {
        status: 200,
        message: "Permissions updated successfully.",
        data: null,
      };
    } catch (error) {
      console.error('Error adding/updating permissions:', error.message);
      throw new ErrorHandler(500, 'Failed to update permissions.', error);
    }
  }

}


exports.PermissionsService = new Permissions()
