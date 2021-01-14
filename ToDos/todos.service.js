const config = require('config.json');
const jwt = require('jsonwebtoken');

var sql = require('mssql');
var dbConfig = require('../ToDos/dbConnection');
// users hardcoded for simplicity, store in a db for production applications
const users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

module.exports = {
    authenticate,
    getAll
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
    return sql.connect(dbConfig.dbConnection()).then(() => {
        return sql.query("SELECT * FROM ToDos;");
    }).then(result => {
        res.send(result.recordset);
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
    })
}
