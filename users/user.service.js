const config = require('config.json');
const jwt = require('jsonwebtoken');
const googleTrends = require('google-trends-api');

// users hardcoded for simplicity, store in a db for production applications
const users = [
    {
        id: 1,
        username: 'test',
        password: 'test',
        firstName: 'Test',
        lastName: 'User',
        deviceID: ''
    }
];

module.exports = {
    authenticate,
    getAll,
    getGoogleTrends
};

async function authenticate({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) throw 'Username or password is incorrect';

    // create a jwt token that is valid for 7 days
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '30m' });

    return {
        ...omitPassword(user),
        token
    };
}

async function getAll() {
    return users.map(u => omitPassword(u));
}

async function getGoogleTrends() {
    return googleTrends.interestOverTime({ keyword: 'Women\'s march' })
        .then(function (results) {
            console.log('These results are awesome', results);
        })
        .catch(function (err) {
            console.error('Oh no there was an error', err);
        });
}

// helper functions

function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}