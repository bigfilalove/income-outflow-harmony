
const morgan = require('morgan');

// Custom token for adding request body to logs
morgan.token('body', (req) => {
  // Don't log passwords or sensitive info
  const body = {...req.body};
  if (body.password) body.password = '[REDACTED]';
  return JSON.stringify(body);
});

// Create different logging formats for development and production
const developmentFormat = ':method :url :status :response-time ms - :body';
const productionFormat = ':remote-addr - :method :url :status :response-time ms';

// Export middleware based on environment
const logger = (req, res, next) => {
  const format = process.env.NODE_ENV === 'production' ? productionFormat : developmentFormat;
  return morgan(format)(req, res, next);
};

module.exports = logger;
