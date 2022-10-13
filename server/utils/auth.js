const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
    signToken: function({ username, email, _id }) {
        const payload = { username, email, _id };

        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
    authMiddleware: function({ req }) {
        let token = req.body.token || req.query.token || req.headers.authorization;

        // separate 'Bearer' from token value
        if (req.headers.authorization) {
            token = token
                .split(' ')
                .pop()
                .trim();
        }

        // if no token return object as is
        if (!token) {
            return req;
        }

        try {
            // decode and attach user data to req object
            const { data } = jwt.verify(token, secret, { maxAve: expiration });
            req.user = data;
        } catch {
            console.log('Invalid token');
        }

        return req;
    }
};