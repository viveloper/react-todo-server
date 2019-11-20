const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.token;
    if (!token) {
        const error = new Error('missing token');
        error.statusCode = 401;
        return next(error);
    }

    const { secretKey } = req.config;

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            err.statusCode = 401;
            return next(err);
        }

        req.user = { 
            email: decoded.email,
            username: decoded.username
        };
        return next();
    });
}

module.exports = verifyToken;