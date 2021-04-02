//var googleTrends = require('./lib/google-trends-api.min.js');

/* ******************* Autocomplete **************************/

// googleTrends.autoComplete({keyword: 'Back to school'})
// .then((res) => {
//   console.log('this is res', res);
// })
// .catch((err) => {
//   console.log('got the error', err);
//   console.log('error message', err.message);
//   console.log('request body',  err.requestBody);
// });

/* ******************* Interest over time **************************/

// googleTrends.interestOverTime({keyword: 'Valentines Day'})
// .then((res) => {
//   console.log('this is res', res);
// })
// .catch((err) => {
//   console.log('got the error', err);
//   console.log('error message', err.message);
//   console.log('request body',  err.requestBody);
// });

// googleTrends.interestOverTime({
//   keyword: 'Valentines Day',
//   startTime: new Date(Date.now() - (4 * 60 * 60 * 1000)),
//   granularTimeResolution: true,
// }, function(err, results) {
//   if (err) console.log('oh no error!', err);
//   else console.log(results);
// });

/* ****** Interest over time - Set a custom timezone ***************/

// googleTrends.interestOverTime({
//   keyword: 'Valentines Day',
//   timezone: new Date().getTimezoneOffset() / 60,
// }, function(err, results) {
//   if (err) console.log('oh no error!', err);
//   else console.log(results);
// });

/* ****** Interest over time - Comparing multiple keywords *********/
// googleTrends.interestOverTime({keyword: ['Valentines Day', 'Christmas Day']})
// .then((res) => {
//   console.log('this is res', res);
// })
// .catch((err) => {
//   console.log('got the error', err);
// })

/* ******************* Interest by region **************************/

// googleTrends.interestByRegion({
//   keyword: 'Donald Trump',
//   startTime: new Date('2017-02-01'),
//   endTime: new Date('2017-02-06'),
//   resolution: 'CITY',
// })
// .then((res) => {
//   console.log(res);
// })
// .catch((err) => {
//   console.log(err);
// })

// googleTrends.interestByRegion({
//   keyword: 'Donald Trump',
//   startTime: new Date('2017-02-01'),
//   endTime: new Date('2017-02-06'),
//   geo: 'US-CA',
// })
// .then((res) => {
//   console.log(res);
// })
// .catch((err) => {
//   console.log(err);
// })

/* ******************* Related queries **************************/

// googleTrends.relatedQueries({keyword: 'Westminster Dog Show'})
// .then((res) => {
//   console.log(res);
// })
// .catch((err) => {
//   console.log(err);
// })

/* ******************* Related topics **************************/

// googleTrends.relatedTopics({
//   keyword: 'Chipotle',
//   startTime: new Date('2015-01-01'),
//   endTime: new Date('2017-02-10'),
// })
// .then((res) => {
//   console.log(res);
// })
// .catch((err) => {
//   console.log(err);
// });

/* ************************* RealTime Trending Searches  ******************/
// googleTrends.realTimeTrends({
//   geo: 'US',
//   category: 'all',
// }, function(err, results) {
//    if (err) console.log('oh no error!', err);
//    else console.log(results);
// });

/* ***********************  Daily Trends *******************************/
// Please note that google only keeps around T-15 days of daily trends information.
// TrendDate designation that go too far back in the past will result in an error.
// Note: TrendDate is optional and will default to currentDate

// googleTrends.dailyTrends({
//    trendDate: new Date('2019-01-10'),
//    geo: 'US',
// }, function(err, results) {
//    if (err) {
//      console.log('oh no error!', err);
//    }else{
//      console.log(results);
//    }
// }); 

// ****** OUTPUT *******************// 
// {
//     default : [Object]{
//       trendingSearchesDays : [Array]
//         [0] : [Object]{
//           date : String
//           formattedDate: String
//           trendingSearches : [Array]{
//             [0] : [Object] //First trending result
//           }
//         [1] : [Object]{
//           date : String
//           formattedDate: String
//           trendingSearches : [Array]{
//             [0] : [Object] //first trending result
//             ...
//             [19] : [Object] //20th trending result
//           }
//         }
//       }
//       endDateForNextRequest : String,
//       rssFeedPageUrl : String,
//     }
//   }
/* ***********************  END Daily Trends *******************************/
//OPTION 0
// app.get('/:country/:day/:remove/:doubleRemove', (req, res) => {
//     var result = [];
//     const path = 'response.txt' // where to save a file
//     const pathRes = 'result.json';

//     var file = fs.createWriteStream(path);

//     const request = http.get(gTrendsUrl, function (response) {
//         if (response.statusCode === 200) {
//             var file = fs.createWriteStream(path);
//             response.pipe(file);

//         }
//         else {
//             console.log('ERROR in get from link: ' + response);
//             var file = fs.createWriteStream(path);
//             response.pipe(file);
//         }
//         // request.setTimeout(60000, function () { // if after 60s file not downlaoded, we abort a request 
//         //     request.abort();
//         // });
//     });

//     /* Check if the file is created and filled before reading it */
//     const checkTime = 1000;

//     const timerId1 = setInterval(() => {
//         const isExists = fs.existsSync(path, 'utf8')
//         if (isExists) {
//             // do something here
//             var data = fs.readFileSync(path, 'utf-8');
//             // console.log('data: ' + data.toString());
//             var newValue = data.substring(6, data.length);

//             fs.writeFileSync(pathRes, newValue, 'utf-8');

//             clearInterval(timerId1)

//         }
//     }, checkTime)

//     const timerId2 = setInterval(() => {
//         const isExists = fs.existsSync(pathRes, 'utf8')
//         if (isExists) {
//             // do something here
//             var data = fs.readFileSync(pathRes, 'utf-8');
//             // console.log('data: ' + data);

//             var arr = JSON.parse(data).default.trendingSearchesDays[req.params.day].trendingSearches
//             for (var i = 0; i < arr.length; i++) {
//                 // result.push(arr[i].title.query)
//                 result.push(arr[i]);
//             }
//             // console.log('result: ' + JSON.stringify(result));
//             res.json(result);
//             clearInterval(timerId2)

//         }
//     }, checkTime)
// });
// =================================================================================
// app.get("/:keyword/:keyword2", async (req, res) => {
//     try {
//         //console.log('reached')	        
//         var result = [];
//         var result2 = [];
//         var result3 = [];

//         googleTrends.interestOverTime({ keyword: req.params.keyword })
//             .then(function (results) {
//                 // console.log((JSON.parse(results).default.timelineData[0]));	
//                 JSON.parse(results).default.timelineData.map((data, i) => {
//                     result.push({
//                         'date': data.formattedTime,
//                         'value': data.value[0]
//                     })
//                 })
//             }).then(function () {
//                 googleTrends.interestOverTime({ keyword: req.params.keyword2 }).then(function (results) {	                        // console.log((JSON.parse(results).default.timelineData[0]));	
//                     JSON.parse(results).default.timelineData.map((data, i) => {
//                         result2.push({ 'date': data.formattedTime, 'value': data.value[0] })
//                     })
//                 }).then(function () {
//                     googleTrends.interestOverTime({ keyword: req.params.keyword + " " + req.params.keyword2 })
//                         .then(function (results) {
//                             // console.log((JSON.parse(results).default.timelineData[0]));	
//                             JSON.parse(results).default.timelineData.map((data, i) => {
//                                 result3.push({
//                                     'date': data.formattedTime,
//                                     'value': data.value[0]
//                                 })
//                             })
//                             var final = new Array(result.length + 1);
//                             final[0] = new Array(4);
//                             final[0][0] = "Timeline";
//                             final[0][1] = req.params.keyword;
//                             final[0][2] = req.params.keyword2
//                             final[0][3] = req.params.keyword + " " + req.params.keyword2;
//                             for (var i = 1; i < final.length; i++) {
//                                 final[i] = new Array(4);
//                                 final[i][0] = result[i - 1] && result[i - 1].date ? result[i - 1].date : "";
//                                 final[i][1] = result[i - 1] && result[i - 1].value;
//                                 final[i][2] = result2 && result2.length && result2[i - 1].value ? result2[i - 1].value : 0;
//                                 final[i][3] = result3 && result3.length && result3[i - 1].value ? result3[i - 1].value : 0;
//                             }
//                             res.json(final);
//                         })
//                 })
//             })
//     } catch (err) { console.log(err) }
// })

// app.get('/:region/:keyword', async (req, res) => {
//     try {
//         var result = [];
//         await googleTrends.interestByRegion({
//             keyword: req.params.keyword,
//             startTime: new Date('2017-02-01'),
//             endTime: new Date('2017-02-01'),
//             resolution: req.params.keyword
//         })
//             .then((results) => {
//                 var arr = JSON.parse(results).default.trendingSearchesDays.trendingSearches
//                 for (var i = 0; i < arr.length; i++) {
//                     // result.push(arr[i].title.query)
//                     result.push(arr[i])
//                 }
//                 res.json(result)
//                 console.log(res);
//             })
//     } catch (err) { console.log(err) }
// });
// ==============================================================================
