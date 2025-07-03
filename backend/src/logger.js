const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs.txt');

function logToFile(message) {
  fs.appendFileSync(logFile, message + '\n');
}

function logger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMsg = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
    logToFile(logMsg);
  });
  req.log = logToFile;
  next();
}

module.exports = logger; 