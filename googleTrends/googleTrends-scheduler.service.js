require('dotenv').config();
const express = require('express');
const { json } = require('body-parser');
const googleTrends = require('google-trends-api');
const intervalPromise = require('interval-promise');
var mongo = require('mongodb');
const mongoose = require('mongoose');
/* we want the router portion from express */
const router = express.Router();

const dailyTrendsSchema = require('../models/daily-trends');

module.exports = {
    getGoogleTrends
};

const myPromise = new Promise((resolve, reject) => {

    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', (error) => console.error(error));
    db.once('open', () => console.log('Database connected!'));

    // if (db.once('open'))
        resolve('connected');
    reject('problem, boy..');
});

setInterval(() => {
    myPromise.then(getGoogleTrends('2021-04-06', 'RO'))
}, 5000)



// getGoogleTrends('2021-04-06', 'RO');

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
    // console.log('res' + JSON.stringify(result));
    // setInterval(() => {
    //     refreshMongoDB(day, country, result).then(res => {
    //         // console.log(res);
    //         // return result;
    //     });
    // }, 60000)

    // Run a function 10 times with 1 second between each iteration
    // intervalPromise(async () => {
    //     await refreshMongoDB(day, country, result);
    // }, 60000, { iterations: 10 })

    await refreshMongoDB(day, country, result).then(res => {
        // console.log(res);
        // return result;
    });
    // return result;
};

async function refreshMongoDB(day, country, gTrends) {
    // return 'I am here' + gTrends.length;
    try {
        if (gTrends.length !== 0) {
            let arr = gTrends;
            for (let i = 0; i < arr.length; i++) {

                const dailyTrendsObject = new dailyTrendsSchema({
                    dailyTrends: {
                        date: day,
                        country: country,
                        title: {
                            query: gTrends[i].title.query ? gTrends[i].title.query : undefined,
                            exploreLink: gTrends[i].title.exploreLink ? gTrends[i].title.exploreLink : undefined
                        },
                        formattedTraffic: gTrends[i].formattedTraffic ? gTrends[i].formattedTraffic : undefined,
                        // relatedQueries: [{
                        //     query: gTrends[0].relatedQueries[0].query ? gTrends[0].relatedQueries[0].query : undefined,
                        //     exploreLink: gTrends[0].relatedQueries[0].exploreLink ? gTrends[0].relatedQueries[0].exploreLink : undefined
                        // }],
                        image: {
                            newsUrl: gTrends[i].image.newsUrl ? gTrends[i].image.newsUrl : undefined,
                            source: gTrends[i].image.source ? gTrends[i].image.source : undefined,
                            imageUrl: gTrends[i].image.imageUrl ? gTrends[i].image.imageUrl : undefined
                        },
                        shareUrl: gTrends[i].shareUrl ? gTrends[i].shareUrl : undefined
                    }
                });
                console.log('Ddaily-trend: ' + ' - ' + i + ' - ' + gTrends[i].title.query + ' article length: ' + gTrends[i].articles.length)
                //DELETE ALL RECORDS IN THE DOCUMENT
                // dailyTrendsSchema.deleteMany(/*{ 'dailyTrends.date': day  '2021-04-04'  },*/ function (err) {
                //     if(err) console.log(err);
                //     console.log("Successful deletion");
                //   });

                // CREATE IF IT DOES NOT EXIST
                let docs = await dailyTrendsSchema.findOne({
                    'dailyTrends.date': day,
                    'dailyTrends.country': country,
                    'dailyTrends.title.query': gTrends[i].title.query ? gTrends[i].title.query : 'notitlequery'
                }, function (err, dailyTrendsDBExists) {
                    if (err) {
                        console.log('ERROR again1: ' + err);
                    }

                    if (dailyTrendsDBExists === null) {
                        dailyTrendsObject.save();
                        console.log('Saved new daily-trend: ' + gTrends[i].title.query);
                    }
                    else {

                        if (gTrends[i].articles) {
                            for (let i2 = 0; i2 < gTrends[i].articles.length; i2++) {

                                let articleToInsert =
                                {
                                    title: gTrends[i].articles[i2].title ? gTrends[i].articles[i2].title : undefined,
                                    timeAgo: gTrends[i].articles[i2].timeAgo ? gTrends[i].articles[i2].timeAgo : undefined,
                                    source: gTrends[i].articles[i2].source ? gTrends[i].articles[i2].source : undefined,
                                    image: {
                                        newsUrl: gTrends[i].articles[i2].image ? gTrends[i].articles[i2].image.newsUrl : undefined,
                                        source: gTrends[i].articles[i2].image ? gTrends[i].articles[i2].image.source : undefined,
                                        imageUrl: gTrends[i].articles[i2].image ? gTrends[i].articles[i2].image.imageUrl : undefined

                                    },
                                    url: gTrends[i].articles[0].url ? gTrends[i].articles[0].url : undefined,
                                    snippet: gTrends[i].articles[0].snippet ? gTrends[i].articles[0].snippet : undefined
                                };
                                // console.log('article to insert: ' + JSON.stringify(articleToInsert));
                                dailyTrendsSchema.findOneAndUpdate(
                                    {
                                        'dailyTrends.date': day,
                                        'dailyTrends.country': country,
                                        'dailyTrends.title.query': gTrends[i].title.query ? gTrends[i].title.query : 'notitlequery'
                                    },
                                    {   /* addToSet only pushes items if they do not exist */
                                        $addToSet: {
                                            'dailyTrends.articles': articleToInsert
                                        },
                                        $set: {
                                            'dailyTrends.formattedTraffic': '123K'
                                        }
                                    },
                                    { upsert: false, new: true },
                                    function (err, docs) {
                                        if (err) {
                                            console.log('ERROR again2: ' + err);
                                        }
                                        else {
                                            //console.log("Updated Docs : " + docs);
                                        }
                                    }
                                )
                            }
                        }
                    }

                });
            }
        }
    }


    catch (err) {
        console.log('mongo failure: ' + err);
    }
}