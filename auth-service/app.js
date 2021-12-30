const express = require('express');
const app = express();
const morgan = require('morgan');
var cookieParser = require('cookie-parser');

const logger = require('./config/logger');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    //res.header('Access-Control-Allow-Origin','www.ownwebsite.com');
    res.header('Access-Control_allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === "OPTIONS") {
        res.header('Access-Con  trol-Allow-Methods', 'PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});


const authRoutes = require('./api/routes/auth');

app.use(express.json({ limit: '3mb' }));
app.use(
    express.urlencoded({
        limit: '3mb',
        extended: true
    })
);
app.use(cookieParser());


app.use('/auth', authRoutes);


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
