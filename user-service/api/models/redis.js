const Redis = require('ioredis');
const logger = require('../../config/logger');

    let client = new Redis({
        host: 'localhost',
        port: 6379,
        maxRetriesPerRequest: 1,
        retryStrategy: function(times) {
            return 2000; // reconnect after 2 seconds
        },
        enable_offline_queue: true
    });

    client.on('error', (e) => {
        console.log('ERRRRRR!',e);
        if(e.code == 'ECONNREFUSED'){
            logger.error('ECONNREFUSED',e);
        }
    });

module.exports = client;