const config = require('config')
const { ErrorLog } = require('../models/errorLogs.model')
const env_url = config.get('CONFIGURATION.APIURL')

class Permissions {
  async initializeBSPPayment (req, res) {

    try {

    } catch (error) {
      console.error('Error initializing', error.message)

      const errorLog = new ErrorLog({
        apiName: '',
        route: req.originalUrl,
        statusCode: 500,
        message: error.message,
        orderId: orderID || null,
        customerDetails: {
          email: email || null,
          Amount: totalPrice || null,
          Desc: Desc || null,
          orderTime: orderTime || null
        },
        timestamp: new Date(),
        additionalData: {
          requestBody: req.body
        }
      })

      
      await errorLog
        .save()
        .then(() => {
          console.log('Error logged successfully')
        })
        .catch(saveError => {
          console.error('Failed to save error log:', saveError.message)
        })

      throw new Error('Failed')
    }
  }

}


exports.PermissionsService = new Permissions()
