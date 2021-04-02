const express = require('express');
/* we want the router portion from express */
const router = express.Router();

const googleTrends = require('./googleTrends.service');
const TestChema = require('../models/daily-trends');

// routes
router.get('/:country/:day/', getGoogleTrends);

module.exports = router;

function getGoogleTrends(req, res, next) {
    googleTrends.getGoogleTrends(req.params.day, req.params.country)
        .then(gTrends => {
            const testSchema = new TestChema({
                name: 'name',
                firstName: 'firstname'
            })
            try {
                const mongoDBRes = testSchema.save();
            }
            catch (err) {
                console.log('mongo failure');
            }
            // console.log('results in controller: ' + JSON.stringify(gTrends));
            res.json(gTrends)
        })
        .catch(next);
}
