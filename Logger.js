var winston = require('winston');

module.exports = function Logger(LogPath) {
  // body...
  return new winston.Logger({
      level: 'info',
      transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: LogPath })
      ]
    });
}
