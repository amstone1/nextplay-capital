const errorHandler = (err, req, res, next) => {
  console.error('Detailed error information:');
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  console.error('Error stack:', err.stack);
  console.error('Request method:', req.method);
  console.error('Request URL:', req.originalUrl);
  console.error('Request body:', JSON.stringify(req.body, null, 2));
  console.error('Request headers:', JSON.stringify(req.headers, null, 2));

  // Check if headers have already been sent
  if (res.headersSent) {
    console.error('Headers already sent. Unable to send error response.');
    return next(err);
  }

  // Check if the error has a specific status code
  const statusCode = err.statusCode || 500;

  // Prepare the error response
  const errorResponse = {
    message: err.message || 'An unexpected error occurred.',
    status: statusCode
  };

  // In development, include the stack trace
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;