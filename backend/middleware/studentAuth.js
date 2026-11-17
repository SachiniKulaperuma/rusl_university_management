const jwt = require('jsonwebtoken');

function requireStudentAuth(req, res, next) {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith('Bearer ')
        ? authorization.slice('Bearer '.length)
        : null;
    if (!token) return res.status(401).json({ error: 'Student sign-in is required.' });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
        if (payload.role !== 'student' || typeof payload.id !== 'string') {
            return res.status(403).json({ error: 'Student access is required.' });
        }
        req.studentId = payload.id;
        next();
    } catch {
        return res.status(401).json({ error: 'Student session is invalid or expired.' });
    }
}

module.exports = requireStudentAuth;
