const config = require('config')
const bcrypt = require('bcryptjs');
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

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                email,
                password:hashedPassword ,
                role
            });

            await newUser.save();
            return newUser;
        } catch (error) {
            console.error('Error in addUser service:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }
    }

    async deleteUser(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new ErrorHandler(404, 'User not found');
            }
            if (user.role === 'Admin') {
                throw new ErrorHandler(403, 'Forbidden Access/Operation not allowed.');
            }

            await User.findByIdAndDelete(userId);

            return true;
        } catch (error) {
            console.error('Error deleting user:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }
    }

    async updatePassword(req) {
        try {
            const { old_password, new_password } = req.body;
            this.checkRequiredFields(req.body, ['old_password', 'new_password']);

            if (!old_password || !new_password) {
                throw new ErrorHandler(400, 'Bad Request: Missing required fields (old_password or new_password).');
            }

            const userId = req.user.userId;
            const user = await User.findById(userId);
            if (!user) {
                throw new ErrorHandler(404, 'User not found');
            }

            const isMatch = await bcrypt.compare(old_password, user.password);
            if (!isMatch) {
                throw new ErrorHandler(403, 'Forbidden Access: Old password is incorrect');
            }
            const hashedPassword = await bcrypt.hash(new_password, 10);
            user.password = hashedPassword;

            await user.save();
            return true;
        } catch (error) {
            console.error('Error updating password:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }
    }

}


exports.UserService = new UserService()
