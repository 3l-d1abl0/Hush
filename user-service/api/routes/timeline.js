const express = require('express');
const router = express.Router();

const logger = require('../../config/logger');
const redisClient = require('../models/redis');
let secured = require('../lib/middleware/secured');
const neo4jSession = require('../models/neo4j');
let uuid = require('uuid');

router.get('/', secured(), async (req, res, next) => {

    try {
        const usertimeline = await redisClient.lrange(`${req.authDetails['username']}#timeline`, 0, 20);
        return res.status(200).json({
            error: false,
            posts: usertimeline.map(function (post) {
                return JSON.parse(post);
            })
        });

    } catch (error) {
        console.log('/timeline', error);
        logger.error('/timeline', error);
        return res.status(500).json({
            error: true,
            posts: 'Error in fetching timeline'
        });
    }

});


router.post('/addPost', secured(), (req, res, next) => {

    const post = req.body.post;
    const tags = req.body.tags;

    const uuid4 = uuid.v4();
    const timestamp = Date.now();

    const querytocreatePost = `MATCH(a:User {username: '${req.authDetails['username']}'})
        CREATE(p:Post {id: '${uuid4}', text: '${post}', timestamp: '${Math.floor(timestamp / 1000)}'})<-[:PUBLISHED]-(a)
        RETURN p`;


    neo4jSession.run(querytocreatePost)
        .then(function (result) {

            const queryGetFollowers = `MATCH (u1:User{username: '${req.authDetails['username']}'})<-[r:FOLLOWS]-(u2:User) RETURN u2.username;`;
            neo4jSession.run(queryGetFollowers)
                .then(function (followers) {

                    followers.records.forEach(async function (record) {

                        let timelinePost = '{ "username":"' + req.authDetails.username +' ", "post": "' +post+ '","timestamp": ' +Math.floor(timestamp / 1000)+' }';
                        await redisClient.rpush(`${record._fields[0]}#timeline`, timelinePost);
                        
                    });
                })
                .catch(function (error) {
                    logger.error('/addPost', error);
                    console.log('/addPost', error);
                    
                    return res.status(500).json({
                        error: true,
                        message: 'Error while adding Post'
                    });
                });

            return res.status(200).json({
                error: false,
                message: "Created"
            });
        })
        .catch(function (error) {
            logger.error('/addPost', error);
            console.log('/addPost', error);
            
            return res.status(500).json({
                error: true,
                message: 'Error while adding Post'
            });
        });

});


module.exports = router;
