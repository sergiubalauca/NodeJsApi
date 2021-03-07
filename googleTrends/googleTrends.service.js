const googleTrends = require('google-trends-api');

module.exports = {
    getGoogleTrends
};

async function getGoogleTrends() {
    return await googleTrends.dailyTrends({
        trendDate: new Date('2021-03-07'),
        geo: 'RO',
    }, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
        }
    });
}