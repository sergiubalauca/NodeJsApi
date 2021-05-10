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
    getAll
};

async function authenticate({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) throw {code: 'INVALID_LOGIN', message: ''};

    // create a jwt token that is valid for 7 days
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '2h' });

    return {
        ...omitPassword(user),
        token
    };
}

async function getAll() {
    return users.map(u => omitPassword(u));
}

// helper functions

function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}