const jwt = require('jsonwebtoken');
const sessionSecret = require('../newStudentSessionSecret');

const SESSION_COOKIE = 'newStudentSession';
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const SESSION_MAX_AGE_SECONDS = SESSION_MAX_AGE_MS / 1000;

function readCookie(request, name) {
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) return null;

    for (const cookie of cookieHeader.split(';')) {
        const separator = cookie.indexOf('=');
        if (separator < 0 || cookie.slice(0, separator).trim() !== name) continue;

        try {
            return decodeURIComponent(cookie.slice(separator + 1).trim());
        } catch {
            return null;
        }
    }

    return null;
}

function readBearerToken(request) {
    const authHeader = request.headers.authorization;
    if (typeof authHeader !== 'string') return null;

    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    return match ? match[1].trim() : null;
}

function requireNewStudentAuth(req, res, next) {
    const tokens = [readCookie(req, SESSION_COOKIE), readBearerToken(req)].filter(Boolean);
    if (tokens.length === 0) {
        return res.status(401).json({ error: 'Authorized student sign-in is required.' });
    }

    let sawValidTokenWithWrongRole = false;
    for (const token of tokens) {
        try {
            const payload = jwt.verify(token, sessionSecret);
            if (payload.role !== 'new-student-registration' || typeof payload.registrationNumber !== 'string') {
                sawValidTokenWithWrongRole = true;
                continue;
            }

            req.authorizedRegistrationNumber = payload.registrationNumber;
            if (typeof payload.exp === 'number' && payload.exp - Math.floor(Date.now() / 1000) < SESSION_MAX_AGE_SECONDS / 2) {
                const renewedToken = jwt.sign(
                    { role: payload.role, registrationNumber: payload.registrationNumber },
                    sessionSecret,
                    { expiresIn: SESSION_MAX_AGE_SECONDS }
                );
                res.cookie(SESSION_COOKIE, renewedToken, {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    maxAge: SESSION_MAX_AGE_MS,
                });
            }
            return next();
        } catch {
            continue;
        }
    }

    if (sawValidTokenWithWrongRole) {
        return res.status(403).json({ error: 'This session is not authorized for new-student registration.' });
    }
    return res.status(401).json({ error: 'Authorized student session is invalid or expired.' });
}

module.exports = { SESSION_COOKIE, requireNewStudentAuth };