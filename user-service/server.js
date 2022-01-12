const http = require('http');
const app = require('./app');
const logger = require('../../config/logger');

const port = process.env.PORT || 8000;

const server = http.createServer(app); //pass in a listner

server.on('listening', function () {
    logger.error('Server is Running !');
    console.log('Server is Running !');
}).on('error', function (err) {
    logger.error('Server Error : ', err);
}).on('end', function(err){
    logger.error('Server End : ', err);
});
server.listen(port);
