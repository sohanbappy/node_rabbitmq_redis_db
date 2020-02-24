
var winston = require('winston');
require('winston-daily-rotate-file');
var now = new Date();
var formattedDate = now.getFullYear() + "-" + (parseInt(now.getMonth()) + 1) + "-" + now.getDate()+ now.getHours() ;



var transport_new = new (winston.transports.DailyRotateFile)({
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '1m',
  maxFiles: '1d'
});



const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.json()
),
  //  // defaultMeta: { service: 'tcp server' },
    transports: [
      
      transport_new,
      //
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
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

  module.exports=logger;
