const googleTrends = require('google-trends-api');
var express = require('express')
var cors = require('cors')
var app = express()
app.use(cors())

app.get("/", async (req, res) => { res.json({ 'Ping': 'Pong' }) })

app.get('/:country', async (req, res) => {
    try {
        var result = []
        await googleTrends.dailyTrends({
            geo: req.params.country
        })
            .then(function (results) {
                var arr = JSON.parse(results).default.trendingSearchesDays[0].trendingSearches
                for (var i = 0; i < arr.length; i++) {
                    result.push(arr[i].title.query)
                    console.log('result: ' + arr[i].title.query);
                } 
                
                res.json(result)
            })
        //res.json({ 'trend1': trend1, 'trend2': trend2 })
    } catch (err) {
        console.log(err)
    }
})
app.listen(process.env.PORT || '3001', function () { console.log("Server started!!") })