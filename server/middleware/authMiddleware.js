const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided.', redirectToLogin: true });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired.', redirectToLogin: true });
        }

        return res.status(401).json({ message: 'Invalid token.', redirectToLogin: true });
    }
};

module.exports = authMiddleware;