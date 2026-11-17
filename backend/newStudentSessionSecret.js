const crypto = require('crypto');

const configuredSecret = process.env.NEW_STUDENT_SESSION_SECRET || process.env.JWT_SECRET;

if (process.env.NODE_ENV === 'production' && !configuredSecret) {
    throw new Error('NEW_STUDENT_SESSION_SECRET or JWT_SECRET must be configured in production.');
}

module.exports = configuredSecret || crypto.randomBytes(64).toString('base64url');