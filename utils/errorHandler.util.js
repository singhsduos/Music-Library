module.exports = function errorHandler (
  req,
  res,
  url,
  message = 'Server Unavailable.'
) {

  return res.redirect('/error')
}
