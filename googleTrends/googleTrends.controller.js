const express = require('express');
/* we want the router portion from express */
const router = express.Router();

const googleTrends = require('./googleTrends.service');
// const TestChema = require('../models/daily-trends');
const dailyTrendsSchema = require('../models/daily-trends');
const db = require('../models/daily-trends');

// routes
router.get('/:country/:day/', getGoogleTrends);

module.exports = router;

async function getGoogleTrends(req, res, next) {
    await googleTrends.getGoogleTrendsFromDB(req.params.day, req.params.country)
        .then(gTrends => {
            console.log('results in controller: ' + JSON.stringify(gTrends[0].title.query));
            res.json(gTrends)
        })
        .catch(next);
}
