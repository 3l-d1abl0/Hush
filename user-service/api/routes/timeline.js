const express = require('express');
const router = express.Router();

const logger = require('../../config/logger');
const redisClient = require('../models/redis');
var secured = require('../lib/middleware/secured');
const neo4jSession = require('../models/neo4j');

var uuid = require('uuid');


router.get('/', secured(), async (req, res, next) => {

    try {
        const usertimeline = await redisClient.lrange(`${req.authDetails['username']}#timeline`, 0, 20);
        return res.status(200).json({
            error: false,
            posts: usertimeline.map(function (post) {
                console.log(post);
                return JSON.parse(post);
            })
        });

    } catch (error) {
        console.log(error);
        logger.error(error);
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
                        logger.info(record);
                        const result = await redisClient.rpush(`${record._fields[0]}#timeline`, `{ "username": "${req.authDetails['username']}", "post": "${post}", "timestamp": ${Math.floor(timestamp / 1000)} }`);
                    });
                })
                .catch(function (error) {
                    logger.error(error);
                    return res.status(500).json({
                        error: true,
                        message: error
                    });
                })

            return res.status(200).json({
                error: false,
                message: "Created"
            });
        })
        .catch(function (error) {
            logger.error(error);
            return res.status(500).json({
                error: true,
                message: error
            });
        });

});

module.exports = router;
