const jwt = require('jsonwebtoken');

const jwtExpirySeconds = 15 * 60;
let jwtKey = process.env.JWT_SECRET_KEY;

exports.checkToken = (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).redirect('/');
    }
    var payload;
    try {
        payload = jwt.verify(token, jwtKey);
        req.body.userId = payload.id;
        var newToken = jwt.sign({id : payload.id}, jwtKey, {
            algorithm : "HS256",
            expiresIn : jwtExpirySeconds,
        })
        res.setHeader('token', newToken);
        return next();
    }
    catch(e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end();
        }
        return res.status(400).end();
    }
}
