const mongoose = require('mongoose');

const dailyTrendsSchema = new mongoose.Schema({
    dailyTrends: {
        type: 'object',
        properties: {
            date: 'date',
            country: 'string',
            title: {
                type: 'object',
                properties: {
                    query: { type: 'string' },
                    exploreLink: { type: 'string', required: true }
                }
            },
            formattedTraffic: {
                type: 'object',
            },
            relatedQueries: {
                type: 'array',
                items: {
                    query: {
                        type: 'string',
                    },
                    exploreLink: {
                        type: 'string'
                    }
                }
            },
            image: {
                type: 'object',
                properties: {
                    newsUrl: {
                        type: 'string'
                    },
                    source: {
                        type: 'string'
                    },
                    imageUrl: {
                        type: 'string'
                    }
                }
            },
            articles: {
                type: 'array',
                items: {
                    title: {
                        type: 'string'
                    },
                    timeAgo: {
                        type: 'string'
                    },
                    source: {
                        type: 'string'
                    },
                    image: {
                        type: 'object',
                        properties: {
                            newsUrl: {
                                type: 'string'
                            },
                            source: {
                                type: 'string'
                            },
                            imageUrl: {
                                type: 'string'
                            }
                        }
                    },
                    url: {
                        type: 'string'
                    },
                    snippet: {
                        type: 'string'
                    }
                }
            },
            shareUrl: {
                type: 'string'
            },
        },
        indexes: ['date', 'country', 'title'],
    }
});

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('testSchema', testSchema);
module.exports = mongoose.model('dailyTrendsSchema', dailyTrendsSchema);
