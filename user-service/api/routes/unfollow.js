const express = require('express');
const router = express.Router();


const logger = require('../../config/logger');
var secured = require('../lib/middleware/secured');
const neo4jSession = require('../models/neo4j');
const redisClient = require('../models/redis');


router.post('/', secured(), async (req, res, next) => {

    const usernameToUnFollow = req.body.username;
    const username = req.authDetails.username;

    //Make the requesting user unfollow the requested  user
    const unfollowQuery = `MATCH (u1:User{ username: '${username}'})-[r:FOLLOWS]->(u2: User{ username: '${usernameToUnFollow}'}) DELETE r;`;
    
    try{

        let result = await neo4jSession.run(unfollowQuery);
        //console.log(result);

        //Fetch the timeline of the requesting user
        let usertimeline = await redisClient.lrange(`${username}#timeline`, 0, -1);

        //Clear timeline posts of requesting user
        await redisClient.del(`${username}#timeline`);

        //Create new timeline
        usertimeline.forEach( async (record) => {
            if(JSON.parse(record).username !== usernameToUnFollow){
                await redisClient.rpush(`${username}#timeline`, record);
            }
        });

        //New Timeline
        //let newtimeline = await redisClient.lrange(`${username}#timeline`, 0, -1);

        return res.status(200).json({
            error: false,
            message: 'unfollowed'
        });

    }catch(error){

        logger.error('/unfollow', error);
        console.log('/unfollow', error);
        
        return res.status(500).json({
            error: true,
            message: 'Error while Unfollowing'
        });
    }
});

module.exports = router;