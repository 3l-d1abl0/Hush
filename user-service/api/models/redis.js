const Redis = require('ioredis');
const logger = require('../../config/logger');

var dotenv = require('dotenv');

dotenv.config({
    path: __dirname + '/../../' + '.env'
});

    let client = new Redis({
        host: process.env.REDISURI,
        port: process.env.REDISPORT,
        maxRetriesPerRequest: 2,
        retryStrategy: function(times) {
            console.warn(`Retrying redis connection: attempt ${times}`);
            return 2000; // reconnect after 2 seconds
        },
        enable_offline_queue: true
    });

    client.on('error', (e) => {
        
        if(e.code == 'ECONNREFUSED'){
            logger.error('ECONNREFUSED',e);
        }
    }).on('end', (e) => {
        logger.error(e);
    });

module.exports = client;