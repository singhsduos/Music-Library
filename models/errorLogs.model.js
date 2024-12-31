const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const errorLogSchema = new mongoose.Schema({
  apiName: {
    type: String,
    required: true,
    description: 'Name of the API or endpoint where the error occurred'
  },
  route: {
    type: String,
    required: true,
    description: 'Route of the API that triggered the error'
  },
  statusCode: {
    type: Number,
    required: true,
    description: 'HTTP status code of the error response'
  },
  message: {
    type: String,
    required: true,
    description: 'Error message or stack trace for debugging'
  },
  customerDetails: {
    type: Object,
    description: 'Details of the customer associated with the error'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    description: 'Timestamp of when the error occurred'
  },
  additionalData: {
    type: Object,
    description: 'Any additional data related to the error for context'
  }
})

module.exports = {
  ErrorLog: mongoose.model('ErrorLog', errorLogSchema)
}
