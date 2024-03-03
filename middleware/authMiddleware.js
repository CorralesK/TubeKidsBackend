require('dotenv').config();
const jwt = require('jsonwebtoken');


function VerifyToken(req, res, next) {
    if (req.headers["authorization"]) {
        const token = req.headers['authorization'].split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Access denied' });
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.userId = decoded.id;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
    } else {
        res.status(401);
        res.json({error: "Unauthorized "});
    }
};

module.exports = VerifyToken;