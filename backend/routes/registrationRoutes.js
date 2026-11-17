const express = require('express');
const router = express.Router();
const pool = require('../db');
const requireStudentAuth = require('../middleware/studentAuth');

// Register a Student for a Subject
router.post('/enroll', async (req, res) => {
    try {
        const { student_id, subject_id, academic_year } = req.body;
        const numericSubjectId = Number(subject_id);

        if (typeof student_id !== 'string' || !student_id.trim()
            || !Number.isSafeInteger(numericSubjectId) || numericSubjectId <= 0
            || academic_year === undefined || academic_year === null || !String(academic_year).trim()) {
            return res.status(400).json({ error: 'Student, subject, and academic year are required.' });
        }

        const subject = await pool.query(
            'SELECT Subject_Code FROM Subject WHERE Subject_Id = $1',
            [numericSubjectId]
        );
        if (subject.rowCount !== 1) {
            return res.status(404).json({ error: 'The selected subject was not found.' });
        }
        // Registration.Subject_Id is a legacy VARCHAR foreign key to
        // Subject.Subject_Code, while the UI correctly uses numeric Subject_Id.
        const storedSubjectId = subject.rows[0].subject_code;

        // Check if already registered
        const existing = await pool.query(
            'SELECT * FROM Registration WHERE Student_ID = $1 AND Subject_Id = $2',
            [student_id.trim(), storedSubjectId]
        );
        if (existing.rows.length > 0) {
            return res.status(200).json({ message: 'Already enrolled in this subject', registration: existing.rows[0] });
        }

        const newRegistration = await pool.query(
            'INSERT INTO Registration (Student_ID, Subject_Id, Academic_Year, Status) VALUES ($1, $2, $3, $4) RETURNING *',
            [student_id.trim(), storedSubjectId, String(academic_year).trim(), 'Enrolled']
        );

        res.status(201).json({ message: 'Enrolled successfully', registration: newRegistration.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error during enrollment' });
    }
});

// Get all registrations for a student
router.get('/student/:student_id', requireStudentAuth, async (req, res) => {
    try {
        const { student_id } = req.params;
        if (student_id !== req.studentId) {
            return res.status(403).json({ error: 'You can only view your own subject registrations.' });
        }
        const registrations = await pool.query(
            `SELECT r.Registration_ID, r.Registration_Date, r.Dropped_At, r.Academic_Year, r.Status,
                    s.Subject_Code, s.Subject_Name, s.Credit_Value, s.Course_Status
             FROM Registration r
             JOIN Subject s ON r.Subject_Id = s.Subject_Code
             WHERE r.Student_ID = $1
             ORDER BY r.Registration_Date DESC, r.Registration_ID DESC`,
            [student_id]
        );
        res.json(registrations.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while fetching registrations' });
    }
});

router.put('/:registration_id/drop', requireStudentAuth, async (req, res) => {
    const registrationId = Number(req.params.registration_id);
    if (!Number.isSafeInteger(registrationId) || registrationId <= 0) {
        return res.status(400).json({ error: 'A valid registration is required.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await client.query(
            `SELECT r.Registration_ID, r.Registration_Date, r.Status, s.Course_Status, s.Subject_Name
             FROM Registration r
             JOIN Subject s ON r.Subject_Id = s.Subject_Code
             WHERE r.Registration_ID = $1 AND r.Student_ID = $2
             FOR UPDATE`,
            [registrationId, req.studentId]
        );
        const registration = result.rows[0];
        if (!registration) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Registered subject was not found.' });
        }
        if (registration.course_status !== 'O') {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'Compulsory subjects cannot be dropped.' });
        }
        if (registration.status === 'Dropped') {
            await client.query('ROLLBACK');
            return res.status(409).json({ error: 'This optional subject has already been dropped.' });
        }

        const deadline = new Date(registration.registration_date);
        deadline.setDate(deadline.getDate() + 21);
        if (Date.now() > deadline.getTime()) {
            await client.query('ROLLBACK');
            return res.status(422).json({ error: 'The subject dropping period has ended. You can no longer drop this subject.', drop_deadline: deadline.toISOString() });
        }

        const updated = await client.query(
            `UPDATE Registration
             SET Status = 'Dropped', Dropped_At = CURRENT_TIMESTAMP
             WHERE Registration_ID = $1
             RETURNING Registration_ID, Status, Dropped_At`,
            [registrationId]
        );
        await client.query('COMMIT');
        res.json({ message: `${registration.subject_name} was dropped successfully.`, registration: updated.rows[0], drop_deadline: deadline.toISOString() });
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        console.error('Subject drop error:', err.message);
        res.status(500).json({ error: 'Unable to drop this subject.' });
    } finally {
        client.release();
    }
});

module.exports = router;
