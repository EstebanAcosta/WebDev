/**
  Logging utility (using winston).

  Defaults to debug level logging

  Configure two logs:
    1. a log with all standard messages (application.log)
    1. an exception message log (exceptions.log)
*/

const winston = require('winston');
const fs = require('fs');
const path = require('path');

// Define the log directory and make sure it exists
var logDirectory = path.resolve('logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Create a logger and setup transports
const logger = winston.createLogger({
  level: 'debug',
  levels: winston.config.syslog.levels,
  format: winston.format.combine(winston.format.timestamp(),
    winston.format.json()),
  exitOnError: false,
  transports: [
    // Write to all logs with level `debug` and below to `combined.log`
    // Write unhandled exceptions to exceptions.log
    new winston.transports.File({ filename: `${logDirectory}/error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${logDirectory}/info.log` , level: 'info'}),
    new winston.transports.File({ filename: `${logDirectory}/combined.log` })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: `${logDirectory}/exceptions.log` })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports.logger = logger;
