const redisClient = require('../../models/redis');

module.exports = function () {
    return async function secured(req, res, next) {
        //check if no auth token
        if (req.headers["authorization"] == undefined) {
            return res.status(403).json({
                error: true,
                message: "Unauthorized"
            });
        }

        let authHeader = req.headers["authorization"].replace("Bearer ", "");
        //get user via auth token
        let authDetails = await redisClient.hgetall(authHeader);
        if (Object.keys(authDetails).length === 0) {
            return res.status(403).json({
                error: true,
                message: "User not found!"
            });
        }

        req.authDetails = authDetails;

        return next();
    };
};