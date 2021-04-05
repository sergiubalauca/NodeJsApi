const express = require('express');
const { json } = require('body-parser');
const googleTrends = require('google-trends-api');

/* we want the router portion from express */
const router = express.Router();

const dailyTrendsSchema = require('../models/daily-trends');
const db = require('../models/daily-trends');

module.exports = {
    getGoogleTrends
};

async function getGoogleTrends(day, country) {
    try {
        var result = [];

        await googleTrends.dailyTrends({
            trendDate: new Date(day),
            geo: country,
        }, function (err, results) {
            if (err) {
                console.log('oh no error!', err);
            } else {
                //console.log('RAW result: ' + results);
                console.log('Sending results for day: ' + day + ' in service');
                try {
                    var arr = JSON.parse(results).default.trendingSearchesDays[0].trendingSearches
                    for (var i = 0; i < arr.length; i++) {
                        result.push(arr[i]);
                    }

                    // res.json(result);
                    // console.log('RAW result: ' + result.length);
                    //return json(result);
                } catch (error) {
                    console.log('THE ERROR: ' + error);
                }
            }
        });
    }
    catch (err) {
        console.log(err)
    }

    // await refreshMongoDB(req.params.day, req.params.country).then(res => console.log(res));
    return result;
};

async function refreshMongoDB(day, country) {
    try {
        let docs = dailyTrendsSchema.findOne({
            'dailyTrends.date': day,
            'dailyTrends.country': country,
            'dailyTrends.title.query': gTrends[i].title.query ? gTrends[i].title.query : 'notitlequery'
        }, function (err, dailyTrendsDBExists) {
            if (err) {
                console.log('ERROR again1: ' + err);
            }
            else {
                console.log('dailyTrendsDBExists? ' + JSON.stringify(dailyTrendsDBExists.dailyTrends));
            }

            // return dailyTrendsDBExists;
        }
        )
    }
    catch (err) {
        console.log('mongo failure: ' + err);
    }
}