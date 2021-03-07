const express = require('express');
const router = express.Router();
const googleTrends = require('./googleTrends.service');

// routes
router.get('/googleTrends', getGoogleTrends);

module.exports = router;

function getGoogleTrends(req, res, next) {
    googleTrends.getGoogleTrends()
        // .then(gTrends => res.json(gTrends))
        .then(gTrends => {
            console.log(gTrends);
            res.json("test")
        })
        .catch(next);
}
