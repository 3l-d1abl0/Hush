const express = require('express');
const router = express.Router();

const logger = require('../../config/logger');

const neo4jSession = require('../models/neo4j');

const generateToken = require('../libs/accessToken');

var crypto = require('crypto');


router.post('/signup', (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;

        neo4jSession.run(`CREATE(n:User {username: '${username}', password: '${password}' } ) RETURN n`)
            .then(function (result) {

                res.status(200).json({
                    error: false,
                    message: "User created"
                });

            })
            .catch(function (error) {
                logger.error('signup',error);

                res.status(500).json({
                    error: true,
                    message: "Unable to perform"
                });
            });

});


router.post('/login', (req, res, next) => {

    const redisClient = require('../models/redis');

    const username = req.body.username;
    const password = req.body.password;

    const cypher = `MATCH(n:User {username: '${username}', password: '${password}' } ) RETURN n LIMIT 1`;
    neo4jSession.run(cypher)
        .then(async function (result) {

            if (result.records.length == 0) {   //user not found with the combination
                return res.status(401).json({
                    error: true,
                    message: "Check your Combination !"
                });
            }

            const passwordComb = password + crypto.randomBytes(16).toString("hex");
            const token = await generateToken(passwordComb);

            await redisClient.hset(token, { "username": username, "timeout": 900, "issuedAt": new Date() });
            await redisClient.set(username, token);

            return res.status(200).json({
                error: false,
                message: "Logged in successfully !",
                token: token
            });



        })
        .catch(function (error) {
            logger.error('login',error);
            return res.status(500).json({
                error: true,
                message: "Error"
            });
        });

});


module.exports = router;
