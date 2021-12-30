const bcrypt = require("bcrypt");
var dotenv = require('dotenv');

dotenv.config({
    path: __dirname + '/../../' + '.env'
});



const saltRounds = Number(process.env.SALTROUNDS)

const generateToken = async (password) => {

    const hash = await bcrypt.hash(password, saltRounds);
    console.info(hash);

    return hash;
};

module.exports = generateToken;