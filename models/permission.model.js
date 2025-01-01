const mongoose = require('mongoose')

const permissionSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true
  },
  permissions: {
    type: Map,
    of: [String],
    required: true
  }
},
{
  timestamps: true
});

module.exports = {
  Permission: mongoose.model('Permission', permissionSchema)
}
