const config = require('config')
const { User } = require('../models/user.model');

class UserService {
    async getUsers(req) {
        try {
            const {limit, offset, role} = req.query
            let matchFilter = {};

            if (role) {
                matchFilter.role = role;
            }
            
            const users = await User.aggregate([
                { $match: matchFilter },
                { $skip: parseInt(offset) || 0 },
                { $limit: parseInt(limit) || 5 },
                { $project: { password: 0 } }
            ]);

            return users;
        } catch (error) {
            console.error('Error fetching users:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }
    }


}


exports.UserService = new UserService()
