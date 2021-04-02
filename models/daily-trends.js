const mongoose = require('mongoose');

const dailyTrendsSchema = new mongoose.Schema({
    // details of the response to be added here
})

module.exports = mongoose.model('DailyTrends', dailyTrendsSchema);
