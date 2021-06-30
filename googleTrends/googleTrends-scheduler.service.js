require('dotenv').config();
const express = require('express');
// const mongoDbConnection = require('../server');
const googleTrends = require('google-trends-api');
const mongoose = require('mongoose');
/* we want the router portion from express */
const router = express.Router();
const intervalPromise = require('interval-promise');
const dailyTrendsSchema = require('../models/daily-trends');

const countries = ['US', 'RO', 'NL'];

module.exports = {
    getGoogleTrends
};

const myPromise = new Promise((resolve, reject) => {

    if (mongoose.connection.readyState == 0) {
        mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = mongoose.connection;
        db.on('error', (error) => console.error(error));
        db.once('open', () => console.log('Database connected by scheduler!'));
    }
    else {
        console.log('Database already connected for scheduler')
    }
    // if (db.once('open'))
    resolve('connected');
    reject('problem, boy..');
});

var dbQueryCounter = 0;
var maxDbIdleTime = 5000; //maximum db idle time

var closeIdleDb = function (connection) {
    var previousCounter = 0;
    var checker = setInterval(function () {
        if (previousCounter == dbQueryCounter && dbQueryCounter != 0) {
            connection.disconnect().finally(() => {
                console.log('Disconnecting from DB...');
                process.exit();
            })
            clearInterval(closeIdleDb);
        } else {
            previousCounter = dbQueryCounter;
        }
    }, maxDbIdleTime);
};


let dayString1;
let day = 0;
const today1 = new Date();

dayString1 =
    today1.getFullYear() + '-' +
    String(today1.getMonth() + 1).padStart(2, '0') + '-' +
    String(today1.getDate() - (day === 0 ? 0 : 1)).padStart(2, '0');

async function runScheduler() {
    countries.forEach(async (country) => {
        await getGoogleTrends(dayString1, country).then(console.log('Country: ' + country));
    });
};

runScheduler();

async function getGoogleTrends(day, country) {
    try {
        var result = [];

        await googleTrends.dailyTrends({
            trendDate: new Date(day),
            geo: country,
        }, async function (err, results) {
            if (err) {
                console.log('oh no error!', err);
            } else {
                //console.log('RAW result: ' + results);
                console.log('Sending results for day: ' + day + ' | country: ' + country + ' in scheduler');
                try {
                    var arr = JSON.parse(results).default.trendingSearchesDays[0].trendingSearches
                    for (var i = 0; i < arr.length; i++) {
                        result.push(arr[i]);
                    }
                    await refreshMongoDB(day, country, result).then(res => {
                        console.log('Finished performing db actions for country:' + country);

                    });
                } catch (error) {
                    console.log('THE ERROR: ' + error);
                }
            }
        });
    }
    catch (err) {
        console.log(err)
    }


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
                        articles: [{
                            title: gTrends[i].articles[0].title ? gTrends[i].articles[0].title : undefined/*,
                            timeAgo: gTrends[i].articles[0].timeAgo ? gTrends[i].articles[0].timeAgo : undefined*/,
                            source: gTrends[i].articles[0].source ? gTrends[i].articles[0].source : undefined,
                            image: {
                                newsUrl: gTrends[i].articles[0].image ? gTrends[i].articles[0].image.newsUrl : undefined,
                                source: gTrends[i].articles[0].image ? gTrends[i].articles[0].image.source : undefined,
                                imageUrl: gTrends[i].articles[0].image ? gTrends[i].articles[0].image.imageUrl : undefined

                            },
                            url: gTrends[i].articles[0].url ? gTrends[i].articles[0].url : undefined,
                            snippet: gTrends[i].articles[0].snippet ? gTrends[i].articles[0].snippet : undefined
                        }],
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
                console.log('Daily-trend: ' + ' - ' + i + ' - (' + country + ') ' + gTrends[i].title.query + ' article length: ' + gTrends[i].articles.length)
                //DELETE ALL RECORDS IN THE DOCUMENT
                // dailyTrendsSchema.deleteMany(/*{ 'dailyTrends.date': day  '2021-04-04'  },*/ function (err) {
                //     if(err) console.log(err);
                //     console.log("Successful deletion");
                //     dbQueryCounter ++;
                //   });


                // CREATE IF IT DOES NOT EXIST
                let docs = await dailyTrendsSchema.findOne(
                    {
                        'dailyTrends.date': day,
                        'dailyTrends.country': country,
                        'dailyTrends.title.query': gTrends[i].title.query ? /.*gTrends[i].title.query.*/ : '',
                        'dailyTrends.shareUrl': gTrends[i].shareUrl ? gTrends[i].shareUrl : ''
                    }, async function (err, dailyTrendsDBExists) {
                        dbQueryCounter++;
                        if (err) {
                            console.log('ERROR again1: ' + err);
                        }

                        if (dailyTrendsDBExists === null) {
                            await dailyTrendsObject.save();
                            console.log('Saved new daily-trend: ' + gTrends[i].title.query + ' for country: ' + country);
                            dbQueryCounter++;
                        }
                    });

                if (gTrends[i].articles) {
                    for (let i2 = 0; i2 < gTrends[i].articles.length; i2++) {

                        let articleToInsert =
                        {
                            title: gTrends[i].articles[i2].title ? gTrends[i].articles[i2].title : undefined/*,
                                timeAgo: gTrends[i].articles[i2].timeAgo ? gTrends[i].articles[i2].timeAgo : undefined*/,
                            source: gTrends[i].articles[i2].source ? gTrends[i].articles[i2].source : undefined,
                            image: {
                                newsUrl: gTrends[i].articles[i2].image ? gTrends[i].articles[i2].image.newsUrl : undefined,
                                source: gTrends[i].articles[i2].image ? gTrends[i].articles[i2].image.source : undefined,
                                imageUrl: gTrends[i].articles[i2].image ? gTrends[i].articles[i2].image.imageUrl : undefined

                            },
                            url: gTrends[i].articles[i2].url ? gTrends[i].articles[i2].url : undefined,
                            snippet: gTrends[i].articles[i2].snippet ? gTrends[i].articles[i2].snippet : undefined
                        };
                        // console.log('article to insert: ' + JSON.stringify(articleToInsert));
                        let docs2 = await dailyTrendsSchema.findOneAndUpdate(
                            {
                                'dailyTrends.date': day,
                                'dailyTrends.country': country,
                                'dailyTrends.title.query': gTrends[i].title.query ? gTrends[i].title.query : 'notitlequery'/*,
                                    'dailyTrends.url': gTrends[i].articles[i2].url,
                                    'dailyTrends.snippet': gTrends[i].articles[i2].snippet ,
                                    'dailyTrends.articles.title': gTrends[i].articles[i2].title,
                                    'dailyTrends.articles.title': gTrends[i].articles[i2].source*/
                            },
                            {   /* addToSet only pushes items if they do not exist */
                                $addToSet: {
                                    'dailyTrends.articles': articleToInsert
                                },
                                $set: {
                                    'dailyTrends.formattedTraffic': gTrends[i].formattedTraffic
                                }
                            },
                            { upsert: false, new: true },
                            function (err, doc2) {
                                if (err) {
                                    console.log('ERROR again2: ' + err);
                                }
                                // if (doc2 === null) {
                                //     console.log('Saved new article: ' + gTrends[i].articles[i2].snippet);
                                // }
                                // else {
                                //     console.log('bla bla car' + gTrends[i].articles[i2].snippet);
                                // }
                                dbQueryCounter++;
                            }
                        )
                    }
                }

            }

            closeIdleDb(mongoose);
        }

    }

    catch (err) {
        console.log('mongo failure: ' + err);
    }
}