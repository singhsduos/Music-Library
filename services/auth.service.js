const config = require('config')
const { ErrorLog } = require('../models/errorLogs.model')
const { User } = require('../models/user.model');
const { ErrorHandler } = require('../middlewares/error-handler');

class AuthService {
  async signUp (req) {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ErrorHandler(400, `Bad Request, Reason: ${!email ? 'Missing email' : 'Missing password'}`);
    }

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        throw new ErrorHandler(409, 'Email already exists.');
      }

      const isAdmin = (await User.countDocuments()) === 0;
      const role = isAdmin ? 'Admin' : 'Viewer';

      const newUser = new User({
        email,
        password,
        role,
      });

      await newUser.save();
      return true;
    } catch (error) {
      console.error('Error initializing user:', error.message);
      throw new ErrorHandler(error.statusCode || 500, error.message, error);
    }
  }

}


exports.AuthService = new AuthService()
