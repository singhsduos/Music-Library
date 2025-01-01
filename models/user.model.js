const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'Editor', 'Viewer'],
        default: 'Viewer'
    },
}, 
{
  timestamps: true
});


module.exports = {
    User: mongoose.model('User', UserSchema)
}
