const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

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

mongoose.connect('mongodb://localhost/rest-api', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to MongoDB!');
    }
});


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
