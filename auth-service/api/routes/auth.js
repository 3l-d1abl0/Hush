const express = require('express');
const router = express.Router();

const logger = require('../../config/logger');

const redisClient = require('../models/redis');
const neo4jSession = require('../models/neo4j');

const generateToken = require('../libs/accessToken');

var crypto = require('crypto');


router.post('/signup', (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;


    neo4jSession.run(`CREATE(n:User {username: '${username}', password: '${password}' } ) RETURN n`)
        .then(function (result) {
            //console.info(result);
            //neo4jModel.close();

            res.status(200).json({
                error: false,
                message: "User created"
            });

        })
        .catch(function (error) {
            console.error(`/signup ${error}`);
            res.status(200).json({
                error: true,
                message: "Unable to perform"
            });
        });


});


router.post('/login', (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;

    console.log(req.body);

    const cypher = `MATCH(n:User {username: '${username}', password: '${password}' } ) RETURN n LIMIT 1`;
    neo4jSession.run(cypher)
        .then(async function (result) {

            if (result.records.length == 0) {   //user not found with the combination
                return res.status(200).json({
                    error: true,
                    message: "Check your Combination !"
                });
            }

            const passwordComb = password + crypto.randomBytes(16).toString("hex");
            console.log(password + ' , ' + passwordComb);
            const token = await generateToken(passwordComb);
            console.log(password + ' => ' + token);
            const timestamp = new Date();
            console.log(timestamp);

            redisClient.hset(token, { "username": username, "timeout": 900, "issuedAt": timestamp });

            return res.status(200).json({
                error: false,
                message: "Logged in successfully !",
                token: token
            });



        })
        .catch(function (error) {
            console.error('error', `${error}`);

            return res.status(200).json({
                error: true,
                message: "Error"
            });
        }).finally(function (data) {
            //neo4jSession.close();
        });

});


module.exports = router;
