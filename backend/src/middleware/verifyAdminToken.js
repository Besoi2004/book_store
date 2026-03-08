const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY

const verifyAdminToken =  (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    console.log('Token received:', token ? 'Token exists' : 'No token');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided' });
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification error:', err.message);
            return res.status(403).json({ message: 'Invalid credentials or token expired' });
        }
        console.log('Token verified successfully for user:', user.username);
        req.user = user;
        next();
    })

}

module.exports = verifyAdminToken;