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

function getGoogleTrends(req, res, next) {
    googleTrends.getGoogleTrends(req.params.day, req.params.country)
        .then(gTrends => {
            // const testSchema = new TestChema({
            //     name: 'name',
            //     firstName: 'firstname'
            // });

            // const dailyTrendsSchema = new DailyTrendsSchema({
            //     title: {
            //         query: 'query1',
            //         exploreLink: 'exploreLink1'
            //     },
            //     formattedTraffic: '1K',
            //     relatedQueries: [{
            //         query: 'queryRelated',
            //         exploreLink: 'exploreLinkRelated'
            //     }]
            // });

            try {
                // const mongoDBRes1 = testSchema.save();
                console.log('1: ' + gTrends[0].title.query);
                console.log('2: ' + gTrends[0].title.exploreLink);
                console.log('3: ' + gTrends[0].formattedTraffic);
                // console.log('4: ' + gTrends[0].relatedQueries[0].query ? gTrends[0].relatedQueries[0].query : 'empty');
                // console.log('5: ' + gTrends[0].relatedQueries[0].exploreLink ? gTrends[0].relatedQueries[0].exploreLink : 'empty');
                console.log('6: ' + gTrends[0].image.source);
                console.log('7: ' + gTrends[0].image.imageUrl);
                console.log('7: ' + gTrends[0].image.newsUrl);
                console.log('8: ' + gTrends[0].articles[0].title);
                console.log('9: ' + gTrends[0].articles[0].timeAgo);
                console.log('10: ' + gTrends[0].articles[0].source);
                console.log('11: ' + gTrends[0].articles[0].image.newsUrl);
                console.log('12: ' + gTrends[0].articles[0].image.source);
                console.log('13: ' + gTrends[0].articles[0].image.imageUrl);
                console.log('14: ' + gTrends[0].articles[0].url);
                console.log('15: ' + gTrends[0].articles[0].snippet);
                console.log('16: ' + gTrends[0].shareUrl);

                const dailyTrendsObject = new dailyTrendsSchema({
                    dailyTrends: {
                        date: req.params.day,
                        country: req.params.country,
                        title: {
                            query: gTrends[0].title.query ? gTrends[0].title.query : undefined,
                            exploreLink: gTrends[0].title.exploreLink ? gTrends[0].title.exploreLink : undefined
                        },
                        formattedTraffic: gTrends[0].formattedTraffic ? gTrends[0].formattedTraffic : undefined,
                        relatedQueries: [{
                            query: 'empty', //gTrends[0].relatedQueries[0].query ? gTrends[0].relatedQueries[0].query : undefined,
                            exploreLink: 'empty' // gTrends[0].relatedQueries[0].exploreLink ? gTrends[0].relatedQueries[0].exploreLink : undefined
                        }],
                        image: {
                            newsUrl: gTrends[0].image.newsUrl ? gTrends[0].image.newsUrl : undefined,
                            source: gTrends[0].image.source ? gTrends[0].image.source : undefined,
                            imageUrl: gTrends[0].image.imageUrl ? gTrends[0].image.imageUrl : undefined
                        },
                        articles: [{
                            title: gTrends[0].articles[0].title ? gTrends[0].articles[0].title : undefined,
                            timeAgo: gTrends[0].articles[0].timeAgo ? gTrends[0].articles[0].timeAgo : undefined,
                            source: gTrends[0].articles[0].source ? gTrends[0].articles[0].source : undefined,
                            image: {
                                newsUrl: gTrends[0].articles[0].image.newsUrl ? gTrends[0].articles[0].image.newsUrl : undefined,
                                source: gTrends[0].articles[0].image.source ? gTrends[0].articles[0].image.source : undefined,
                                imageUrl: gTrends[0].articles[0].image.imageUrl ? gTrends[0].articles[0].image.imageUrl : undefined

                            },
                            url: gTrends[0].articles[0].url ? gTrends[0].articles[0].url : undefined,
                            snippet: gTrends[0].articles[0].snippet ? gTrends[0].articles[0].snippet : undefined
                        }],
                        shareUrl: gTrends[0].shareUrl ? gTrends[0].shareUrl : undefined
                    }
                });

                // find a document

                const docs = dailyTrendsSchema.find({
                    'dailyTrends.date': req.params.day,
                    'dailyTrends.country': req.params.country,
                    'dailyTrends.title.query': 'PSG - Lille'
                }, function (err, person) {
                    if (err) {
                        const mongoDBRes2 = dailyTrendsObject.save();

                        const docs2 = dailyTrendsSchema.find({
                            'dailyTrends.date': req.params.day,
                            'dailyTrends.country': req.params.country,
                            'dailyTrends.title.query': 'PSG - Lille'
                        }, function (err, person) {
                            if (err) {
                                return handleError(err);
                            }
                            // Prints "Space Ghost is a talk show host".
                            console.log('response after create is %s: ', JSON.stringify(person[0].dailyTrends.date));
                        });

                        return;
                        //return handleError(err);
                    }
                    // Prints "Space Ghost is a talk show host".
                    console.log('response already created is %s: ', JSON.stringify(person[0].dailyTrends.date));
                });

                // MongoDB may return the docs in any order unless you explicitly sort
                // docs.map(doc => doc.date).sort();
            }
            catch (err) {
                console.log('mongo failure: ' + err);
            }
            // console.log('results in controller: ' + JSON.stringify(gTrends));
            res.json(gTrends)
        })
        .catch(next);
}
