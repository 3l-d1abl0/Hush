const winston = require('winston');

const { label, combine, timestamp, prettyPrint } = winston.format;
const logger = winston.createLogger({
    format: combine(
        timestamp(),
        prettyPrint(),
    ),
    transports: [
        //new winston.transports.Console(),
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/info.log', level: 'info' }),
    ],
    exitOnError: false,
});

module.exports = logger;