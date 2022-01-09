const Redis = require('ioredis');
const logger = require('../../config/logger');

    let client = new Redis({
        host: 'localhost',
        port: 6379,
        maxRetriesPerRequest: 1,
        retryStrategy: function(times) {
            return 2000; // reconnect after 2 seconds
        }
    });

    client.on('error', (e) => {
        if(e.code == 'ECONNREFUSED'){
            logger.error(e);
        }
      })
      .on('end', (e) => {
            logger.error(e);
      });

module.exports = client;