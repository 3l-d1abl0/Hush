const express = require('express');
const router = express.Router();


const logger = require('../../config/logger');
var secured = require('../lib/middleware/secured');
const neo4jSession = require('../models/neo4j');

router.get('/:username', secured(), async (req, res, next) => {

    let username = req.params.username;

    const getUserPosts = `MATCH (user:User {username: '${username}' })-[:PUBLISHED]->(post:Post) RETURN post.text as text, post.timestamp as timestamp, user.username AS username ORDER BY post.timestamp DESC LIMIT 10`;
    
    try{

        const userPost = await neo4jSession.run(getUserPosts);
        return res.status(200).json({
            error: false,
            posts: userPost.records.map(function (record) {
                return record._fields;
            })
        });

    }catch (error){
        console.log(error);
        logger.error(error);
        return res.status(500).json({
            error: true,
            posts: 'Error in getting post'
        });
    }

});

module.exports = router;