/**
 * middleware/errorMiddleware.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Global error handler – must be the LAST middleware registered in app.js.
 * Catches any error passed via next(error) from route handlers / controllers.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * 404 Not Found – catches requests that didn't match any route.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found – ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Global error handler.
 * Returns a consistent JSON error envelope:
 * {
 *   success : false,
 *   message : string,
 *   stack   : string   // only in development
 * }
 */
// eslint-disable-next-line no-unused-vars
export const globalErrorHandler = (err, req, res, next) => {
  // Default to 500 if no status code was set
  const statusCode = err.statusCode || err.status || 500;

  // Log every server error for debugging
  if (statusCode >= 500) {
    console.error('🔴 Server Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Include stack trace only during local development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Small helper – create an error with a custom status code.
 * @param {string}  message
 * @param {number}  statusCode
 */
export const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};
