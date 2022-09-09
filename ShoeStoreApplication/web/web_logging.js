/**
  Web logging middleware utility (using morgan).

  Defaults to configuring two logs:
    1. a combined format (access.log)
    1. a dev format (dev.log)
*/

// Load the morgan library - common name for variable is morgan
const morgan = require('morgan');

// Load the filesystem library - common name for variable is fs
const fs = require('fs');

// Load the path library - common name for variable is path
const path = require('path');

// Load the rotating-file-stream library - common name for variable is rfs
const rfs = require('rotating-file-stream');

// The relative directory containing the log files
const log_directory = "logs";

module.exports.setupWebLog = (app) => {
  // Define the log directory and make sure it exists
  var logDirectory = path.resolve(log_directory);
  console.log(`web log dir: ${logDirectory}`);
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

  // create a rotating write stream for standard logging
  var accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
  });

  // create a rotating write stream for dev logging
  var devLogStream = rfs('dev.log', {
    interval: '1d', // rotate daily
    path: logDirectory
  });

  // setup dev info log
  app.use(morgan('combined', {stream: accessLogStream}));

  // setup Apache standard log format
  app.use(morgan('dev', { stream: devLogStream }));
};
