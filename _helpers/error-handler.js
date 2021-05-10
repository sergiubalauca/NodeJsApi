module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    console.log(err);
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ message: err });
    }

    if (err.code === 'invalid_token') {
        // jwt authentication error
        return res.status(401).json({
            code: 'INVALID_TOKEN',
            message: 'Token expired'
        });
    }

    if (err.code === 'INVALID_LOGIN') {
        // jwt authentication error
        return res.status(400).json({
            code: 'INVALID_LOGIN',
            message: 'Invalid credentials'
        });
    }

    if (err.code === 'INVALID_SECRET') {
        // jwt authentication error
        return res.status(400).json({
            code: 'INVALID_SECRET',
            message: 'Invalid secret'
        });
    }

    // default to 500 server error
    return res.status(500).json({ message: err.message });
}