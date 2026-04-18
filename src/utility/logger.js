/*
 * Logger configuration for the application using Bunyan.
 * Supports rotating file and stdout logging.
 *
 * Author: Rohan Pawar
 */

const bunyan = require('bunyan');
require('dotenv').config();

const logRequestSerializer = (req) => {
  if (!req) return {};

  return {
    type: 'REQUEST',
    method: req?.method?.toUpperCase(),
    path: req?.path,
    // headers: req?.headers, // Uncomment if needed
  };
};

const logStreams = [];

// STDOUT Logging
if (process.env.LOG_TO_STDOUT === 'true') {
  logStreams.push({ stream: process.stdout });
}

// File Logging
if (process.env.LOG_TO_FILE === 'true') {
  logStreams.push({
    type: 'rotating-file',
    path: process.env.LOG_FILE || './logs/server.log',
    period: process.env.LOG_ROTATION_PERIOD || '1d',
    count: 7, // keep 7 rotated logs
  });
}

const loggerConfig = {
  name: process.env.LOGGER_NAME || 'app-logger',
  streams: logStreams,
  src: true,
  serializers: {
    req: logRequestSerializer,
  },
};

const log = bunyan.createLogger(loggerConfig);
const logger = log.child({ module: 'default' });

module.exports = {
  logRequestSerializer,
  log,
  logger,
};