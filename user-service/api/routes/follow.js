const express = require('express');
const router = express.Router();


const logger = require('../../config/logger');
var secured = require('../lib/middleware/secured');
const neo4jSession = require('../models/neo4j');
const redisClient = require('../models/redis');


router.post('/', secured(), async (req, res, next) => {

    const usernameToFollow = req.body.username;
    const username = req.authDetails.username;

    //Make the requesting user follow the requested 
    const followQuery = `MATCH (u1:User{ username: '${username}'}), (u2:User{ username: '${usernameToFollow}'}) MERGE (u1)-[r:FOLLOWS]->(u2)`;

    try{
        let result = await neo4jSession.run(followQuery);
        //console.log(result);

        //Fetch followed user's posts from DB
        const getUserPosts = `MATCH (user:User {username: '${usernameToFollow}' })-[:PUBLISHED]->(post:Post) RETURN post.text as text, post.timestamp as timestamp, user.username AS username ORDER BY post.timestamp DESC LIMIT 10`;
        const userPostsResponse = await neo4jSession.run(getUserPosts);
        //Filter and conver to timeline format
        let userPosts = new Array();
        userPostsResponse.records.forEach( (record) => {
            const StringifyPost = JSON.stringify(record._fields[0]);    //to escape new lines
            const post = StringifyPost.toString().replace(/"/g, '');    //remove " added at front and back"
            userPosts.push('{ "username":"' + record._fields[2] +' ", "post": "' +post+ '","timestamp": ' +record._fields[1]+' }');
        });
        //console.log(userPosts);

        //Fetch the timeline of the requesting user
        let usertimeline = await redisClient.lrange(`${username}#timeline`, 0, -1);
        
        userPosts.push(...usertimeline);
        ///Create ne timeline posts
        userPosts.sort((a,b) => JSON.parse(a)["timestamp"]- JSON.parse(b)["timestamp"]);
        //console.log(userPosts);

        //Clear timeline posts of requesting user
        await redisClient.del(`${username}#timeline`);

        //Create new timeline
        userPosts.forEach( async (record) => {
            await redisClient.rpush(`${username}#timeline`, record);
        });

        //New Timeline
        let newtimeline = await redisClient.lrange(`${username}#timeline`, 0, -1);

        return res.status(200).json({
            error: false,
            message: 'Followed'
        });

    }catch(error){

        logger.error('/follow', error);
        console.log('/follow', error);
        
        return res.status(500).json({
            error: true,
            message: 'Error while following'
        });
    }
});

module.exports = router;