const config = require('config')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
const TokenExpiryTime = config.get("EXPIRYTIME")

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
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        password:hashedPassword,
        role,
      });

      await newUser.save();
      return true;
    } catch (error) {
      console.error('Error initializing user:', error.message);
      throw new ErrorHandler(error.statusCode || 500, error.message, error);
    }
  }
  async signIn(req) {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ErrorHandler(400, `Bad Request, Reason: ${!email ? 'Missing email' : 'Missing password'}`);
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new ErrorHandler(404, 'User not found.');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new ErrorHandler(400, 'Invalid password.');
      }

      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWTPRIVATERESETKEY, { expiresIn: TokenExpiryTime });

      return { token };
    } catch (error) {
      console.error('Error during login:', error.message);
      throw new ErrorHandler(error.statusCode || 500, error.message, error);
    }
  }
  async logout(req) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ErrorHandler(400, 'Bad Request, Missing Authorization Token.');
    }

    try {
      // we can add logic here, whatever requirement of ours like if we are using ejs then can destroy it
      // or if we can store token in DB mark them as blacklisted so that same token can't be used agaian
      return true;
    } catch (error) {
      console.error('Error during logout:', error.message);
      throw new ErrorHandler(500, error.message, error);
    }
  }

}


exports.AuthService = new AuthService()
