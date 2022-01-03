const neo4j = require('neo4j-driver');
var dotenv = require('dotenv');

dotenv.config({
    path: __dirname + '/../../' + '.env'
});

const driver = neo4j.driver(process.env.NEO4JURI, neo4j.auth.basic(process.env.NEO4JUSERNAME, process.env.NEO4JPASSWORD));

module.exports = driver.session();
