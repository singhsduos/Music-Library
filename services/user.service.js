const config = require('config')
const { User } = require('../models/user.model');

class UserService {
    checkRequiredFields(fields, requiredFields) {
        requiredFields.forEach(field => {
            if (!fields[field]) {
                throw new ErrorHandler(400, `Bad Request. Missing required field: ${field}`);
            }
        });
    }
    async getUsers(req) {
        try {
            const { limit, offset, role } = req.query
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

    async addUser(req) {
        try {
            const { email, password, role } = req.body
            this.checkRequiredFields({ email, password, role }, ['email', 'password', 'role']);

            if (role === 'Admin') {
                throw new ErrorHandler(403, 'Forbidden Access: Cannot create an Admin user');
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new ErrorHandler(409, 'Email already exists');
            }

            const newUser = new User({
                email,
                password,
                role
            });

            await newUser.save();
            return newUser;
        } catch (error) {
            console.error('Error in addUser service:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }
    }

}


exports.UserService = new UserService()
