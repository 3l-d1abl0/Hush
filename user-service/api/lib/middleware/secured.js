module.exports = function () {
    return function secured(req, res, next) {
        //check if no auth token
        if (req.headers["authorization"] == undefined) {
            return res.status(403).json({
                error: true,
                message: "Unauthorized"
            });
        }

        return next();
    };
};