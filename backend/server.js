/**
 * server.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Entry point – boots the HTTP server.
 * Imports the Express app from app.js (single-responsibility principle).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('─────────────────────────────────────────');
  console.log(`🚀  Server running on port ${PORT}`);
  console.log(`📦  Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗  Health check : http://localhost:${PORT}/health`);
  console.log('─────────────────────────────────────────');
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
// Handles SIGTERM (e.g. from Docker / process managers) cleanly.
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM received – shutting down gracefully...');
  server.close(() => {
    console.log('✅  HTTP server closed.');
    process.exit(0);
  });
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('🔴 Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => process.exit(1));
});

export default server;
