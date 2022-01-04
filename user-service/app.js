const express = require('express');
const app = express();
var cookieParser = require('cookie-parser');

const logger = require('./config/logger');


const timelineRoute = require('./api/routes/timeline');

app.use(express.json({ limit: '3mb' }));
app.use(
    express.urlencoded({
        limit: '3mb',
        extended: true
    })
);
app.use(cookieParser());


app.use('/timeline', timelineRoute);


app.use((req, res, next) => {
    const error = new Error('Not Found !');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {

    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
