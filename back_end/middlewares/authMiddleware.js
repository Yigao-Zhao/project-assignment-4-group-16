const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Verify JWT token
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.isAdmin !== 'Y') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};