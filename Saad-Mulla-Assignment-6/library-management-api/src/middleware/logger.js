const logger = (req, res, next) => {
  console.log('[' + new Date().toISOString() + '] ' + req.method + ' ' + req.originalUrl + ' - User: ' + (req.user ? req.user.email : 'Guest'));
  next();
};
module.exports = logger;