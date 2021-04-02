const express = require('express');
const router = express.Router();
const googleTrends = require('./googleTrends.service');
const DailyTrendsSchema = require('../models/daily-trends');

// routes
router.get('/:country/:day/', getGoogleTrends);


module.exports = router;

function getGoogleTrends(req, res, next) {
    googleTrends.getGoogleTrends(req.params.day, req.params.country)
        .then(gTrends => {
            // console.log('results in controller: ' + JSON.stringify(gTrends));
            res.json(gTrends)
        })
        .catch(next);
}
