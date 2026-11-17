const jwt = require('jsonwebtoken');

function requireAdminAuth(req, res, next) {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith('Bearer ')
        ? authorization.slice('Bearer '.length)
        : null;

    if (!token) {
        return res.status(401).json({ error: 'Admin sign-in is required.' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
        if (payload.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access is required.' });
        }

        req.admin = payload;
        next();
    } catch {
        res.status(401).json({ error: 'Admin session is invalid or expired.' });
    }
}

module.exports = requireAdminAuth;