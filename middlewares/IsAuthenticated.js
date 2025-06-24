const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error(err);
        res.clearCookie('token');
        res.redirect('/login');
    }
};

module.exports = isAuthenticated;