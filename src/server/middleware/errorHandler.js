
// Central error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log error to console
  console.error('\x1b[31m%s\x1b[0m', 'Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Determine status code
  const statusCode = err.statusCode || 500;
  
  // Format error response
  const errorResponse = {
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL_ERROR'
    }
  };
  
  // Add stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.error.stack = err.stack;
  }
  
  res.status(statusCode).json(errorResponse);
};

// 404 handler middleware
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      message: 'Resource not found',
      code: 'NOT_FOUND'
    }
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
