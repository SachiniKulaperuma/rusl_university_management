const REGISTRATION_NUMBER_PATTERN = /^ITT\/(\d{4})\/(\d{3})$/i;

function getAcademicPeriod(studentId, now = new Date()) {
    const match = typeof studentId === 'string'
        ? REGISTRATION_NUMBER_PATTERN.exec(studentId.trim())
        : null;

    if (!match) {
        const error = new Error('Invalid registration number. Expected format ITT/YYYY/XXX.');
        error.statusCode = 400;
        throw error;
    }

    const intakeYear = Number(match[1]);
    const academicYear = now.getFullYear() - intakeYear + 1;

    if (academicYear < 1 || academicYear > 4) {
        const error = new Error('This registration number does not map to Academic Year 1-4.');
        error.statusCode = 422;
        throw error;
    }

    return {
        intakeYear,
        academicYear,
        semester: now.getMonth() < 6 ? 1 : 2,
    };
}

module.exports = { getAcademicPeriod };