require('rootpath')();
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const googleTrends = require('google-trends-api');
const http = require('https');
const $ = require('cheerio');
const rp = require('request-promise');
const axios = require('axios');
const fs = require('fs');
var mongo = require('mongodb');
const mongoose = require('mongoose');

console.log('DB URL: ' + process.env.MONGODB_URI);
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.options('*', cors());

// use JWT auth to secure the api 
app.use(jwt());

// api routes 
app.use('/users', require('./users/users.controller'));
app.use('/googleTrends', require('./googleTrends/googleTrends.controller'));

// global error handler
app.use(errorHandler);

/* === connect to Mongo DB === */
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Database connected!'));
/* === end connect to Mongo DB === */

const gTrendsUrl = 'https://trends.google.com/trends/api/dailytrends?hl=en-US&tz=0&geo=RO&cat=all&ed=20210326&ns=15';
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

//extra cors stuff with origins allowed
// var allowedOrigins = [
//     'http://localhost:8100',
//     'http://localhost:8101',
//     'http://localhost:4200',
//     '*'];
// app.use(cors({
//     origin: function (origin, callback) {
//         // allow requests with no origin 
//         // (like mobile apps or curl requests)
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.indexOf(origin) === -1) {
//             var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//             return callback(new Error(msg), false);
//         }
//         return callback(null, true);
//     }
// }));

// OPTION 1 with second param in googleTrends method as a callback function. Otherwise, it
// will return a promise as in case OPTION 2
// app.get('/:country/:day', async (req, res) => {
//     try {
//         var result = [];

//         await googleTrends.dailyTrends({
//             trendDate: new Date(req.params.day),
//             geo: req.params.country,
//         }, function (err, results) {
//             if (err) {
//                 console.log('oh no error!', err);
//             } else {
//                 console.log('RAW result: ' + results);
//                 console.log('Sending results for day: ' + req.params.day);
//                 try {
//                     var arr = JSON.parse(results).default.trendingSearchesDays[0].trendingSearches
//                     for (var i = 0; i < arr.length; i++) {
//                         // result.push(arr[i].title.query)
//                         result.push(arr[i]);
//                     }

//                     res.json(result);
//                 } catch (error) {
//                     console.log('THE ERROR: ' + error);
//                 }
//             }
//         });
//     }
//     catch (err) {
//         console.log(err)
//     }
// });



// start server
// const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
// has to be PORT, not port
const port = process.env.PORT || 4000;

const server = app.listen(port, function () {
    console.log('Gsb server listening on port ' + port);
});

module.exports = app;
