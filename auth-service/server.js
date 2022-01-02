const http = require('http');
const app = require('./app');

const port = process.env.PORT || 9090;

const server = http.createServer(app); //pass in a listner

server.on('listening', function () {
    console.log('Server is Running !');
});
server.listen(port);
