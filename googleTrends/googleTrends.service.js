const { json } = require('body-parser');
const googleTrends = require('google-trends-api');

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
    return result;
};