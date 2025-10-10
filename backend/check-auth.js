const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) throw new Error('No auth token');

        const decodedToken = jwt.verify(token, "secret_string"); 
        req.user = { id: decodedToken.userId, username: decodedToken.username };
        next();
    } catch (err) {
        console.error('JWT verification error:', err);
        res.status(401).json({ message: 'Authentication failed' });
    }
};
