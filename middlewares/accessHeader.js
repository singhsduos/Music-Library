const config = require('config');
const env_url = config.get('CONFIGURATION.APIURL');

exports.accessHeaderMiddleware = (req, res, next) => {
  try {
    if (!env_url) {
      throw new Error('Site URL not configured in environment');
    }

    const allowedOrigins = [env_url];
    const origin = req.headers.origin;

    // if (allowedOrigins.includes(origin)) {
    //   res.setHeader('Access-Control-Allow-Origin', origin);
    // }
    // res.setHeader(
    //   'Access-Control-Allow-Headers',
    //   'Origin, X-Requested-With, Content-Type, Accept'
    // );
    // res.setHeader(
    //   'Access-Control-Allow-Methods',
    //   'GET, POST, PATCH, DELETE, OPTIONS, PUT'
    // );

    next();
  } catch (error) {
    console.error('Error setting CORS headers:', error);
    res.status(500).send('Internal Server Error');
  }
};
