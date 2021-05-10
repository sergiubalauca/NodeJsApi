const express = require('express');
/* we want the router portion from express */
const router = express.Router();

const googleTrends = require('./googleTrends.service');
// const TestChema = require('../models/daily-trends');
const dailyTrendsSchema = require('../models/daily-trends');
const db = require('../models/daily-trends');

const jwt = require('jsonwebtoken');

// routes
router.get('/:country/:day/', getGoogleTrends);

module.exports = router;

async function getGoogleTrends(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    await googleTrends.getGoogleTrendsFromDB(req.params.day, req.params.country)
        .then(gTrends => {

            if (token === null) return res.sendStatus(401);
            // console.log(token);
            jwt.verify(token, 'gsb', (err, verifiedToken) => {
                if (err) {
                    throw { code: 'INVALID_TOKEN', message: 'Secret check token fail' };
                }

                next();
            });

            res.json(gTrends);
        })
        .catch(next);
}
