// backend/middleware/errorHandler.js

// Global error handling middleware (must have 4 parameters)
const errorHandler = (err, req, res, next) => {
  // Log error to console (you could also log to a file in production)
  console.error('Error:', err);

  // Determine status code: use err.statusCode if set, otherwise 500
  const statusCode = err.statusCode || 500;

  // Determine message: use err.message if available, otherwise default
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    msg: message,
    // In development, send stack trace; in production, omit it
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;