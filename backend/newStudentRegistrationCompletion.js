const bcrypt = require('bcrypt');

const REQUIRED_FORM_KEYS = [
    'student-personal-info',
    'identity-card',
    'residentials',
    'sports',
    'skill',
    'medical',
];

const OFFLINE_FORM_KEYS = new Set(['bursary', 'mahapola']);

async function completeRegistrationIfReady(client, registrationNumber) {
    const result = await client.query(
        `SELECT Form_Key, Form_Data, Submission_Status
         FROM New_Student_Form_Submission
         WHERE Registration_Number = $1`,
        [registrationNumber]
    );
    const submissions = new Map(result.rows.map(row => [row.form_key, row]));

    const allFormsReady = REQUIRED_FORM_KEYS.every((formKey) => {
        const submission = submissions.get(formKey);
        if (!submission) return false;
        return OFFLINE_FORM_KEYS.has(formKey)
            ? submission.submission_status === 'staff_verified'
            : submission.submission_status === 'submitted';
    });
    if (!allFormsReady) return false;

    // Personal information is persisted in Student so that every dedicated
    // application table can reference it before registration is finalized.
    // Older staged records may have an empty Form_Data object, therefore the
    // authoritative source at completion is the Student row, not that cache.
    const studentRecord = await client.query(
        'SELECT NIC_No FROM Student WHERE Student_ID = $1 FOR UPDATE',
        [registrationNumber]
    );
    const student = studentRecord.rows[0];
    if (!student?.nic_no) {
        const error = new Error('Student personal information must be saved before completion.');
        error.status = 400;
        throw error;
    }

    const finalPassword = student.nic_no;
    const hashedPassword = await bcrypt.hash(finalPassword, await bcrypt.genSalt(10));
    const passwordUpdate = await client.query(
        'UPDATE Student SET Password = $2 WHERE Student_ID = $1',
        [registrationNumber, hashedPassword]
    );
    if (passwordUpdate.rowCount !== 1) {
        const error = new Error('Student personal information must be saved before completion.');
        error.status = 400;
        throw error;
    }

    await client.query(
        `UPDATE Authorized_New_Student
         SET Registration_Completed = TRUE, Completed_At = CURRENT_TIMESTAMP, Draft_Data = '{}'::jsonb
         WHERE Registration_Number = $1`,
        [registrationNumber]
    );
    return true;
}

module.exports = { REQUIRED_FORM_KEYS, OFFLINE_FORM_KEYS, completeRegistrationIfReady };
