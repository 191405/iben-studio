/**
 * ============================================================================
 * IBEN STUDIO — VERCEL SERVERLESS EXPRESS API ENTRY POINT
 * ============================================================================
 * Exports the enterprise Express application as a Vercel Serverless Function
 * to handle all requests to /api/v1/* directly on Vercel Edge.
 */

const app = require('../server/src/app');

module.exports = app;
