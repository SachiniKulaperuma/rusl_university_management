const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const requireAdminAuth = require('../middleware/adminAuth');
const { completeRegistrationIfReady } = require('../newStudentRegistrationCompletion');
const { saveOfflineVerification } = require('../newStudentFormTablePersistence');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const result = await pool.query(
            'SELECT Admin_Id, Name, Email, Password, Role FROM Administrator WHERE Email = $1',
            [email.trim()]
        );
        const admin = result.rows[0];
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: admin.admin_id, role: 'admin' },
            process.env.JWT_SECRET || 'supersecret',
            { expiresIn: '2h' }
        );

        res.json({
            token,
            admin: {
                id: admin.admin_id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (err) {
        console.error('Admin login error:', err.message);
        res.status(500).json({ error: 'Unable to sign in right now.' });
    }
});

router.use(requireAdminAuth);

const NEW_STUDENT_REGISTRATION_PATTERN = /^(ITT|ENT|BST)\/\d{4}\/\d{3}$/;

router.get('/new-student-authorizations', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT Registration_Number, Is_Active, Registration_Completed, Created_At, Completed_At
             FROM Authorized_New_Student
             ORDER BY Registration_Number`
        );
        const statusResult = await pool.query(
            `SELECT Registration_Number,
                    COALESCE(jsonb_object_agg(Form_Key, Submission_Status), '{}'::jsonb) AS Form_Statuses
             FROM New_Student_Form_Submission
             GROUP BY Registration_Number`
        );
        const statuses = new Map(statusResult.rows.map(row => [row.registration_number, row.form_statuses]));
        res.json({ accounts: result.rows.map(account => ({
            ...account,
            form_statuses: statuses.get(account.registration_number) || {},
        })) });
    } catch (err) {
        console.error('Error fetching authorized new students:', err.message);
        res.status(500).json({ error: 'Unable to load authorized new students.' });
    }
});

router.put('/new-student-authorizations/forms/:formKey/verify', async (req, res) => {
    const registrationNumber = typeof req.body?.registration_number === 'string'
        ? req.body.registration_number.trim().toUpperCase()
        : '';
    const { formKey } = req.params;
    if (!NEW_STUDENT_REGISTRATION_PATTERN.test(registrationNumber) || !['bursary', 'mahapola'].includes(formKey)) {
        return res.status(400).json({ error: 'A valid registration number and offline form are required.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const authorization = await client.query(
            `SELECT Is_Active, Registration_Completed
             FROM Authorized_New_Student
             WHERE Registration_Number = $1
             FOR UPDATE`,
            [registrationNumber]
        );
        const account = authorization.rows[0];
        if (!account || !account.is_active) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Authorized new-student account was not found.' });
        }
        if (account.registration_completed) {
            await client.query('ROLLBACK');
            return res.status(409).json({ error: 'This registration is already completed.' });
        }

        await saveOfflineVerification(client, registrationNumber, formKey);
        await client.query(
            `INSERT INTO New_Student_Form_Submission (
                Registration_Number, Form_Key, Form_Data, Submission_Status, Verified_By, Verified_At
             ) VALUES ($1, $2, '{}'::jsonb, 'staff_verified', $3, CURRENT_TIMESTAMP)
             ON CONFLICT (Registration_Number, Form_Key) DO UPDATE
             SET Submission_Status = 'staff_verified', Verified_By = EXCLUDED.Verified_By,
                 Verified_At = CURRENT_TIMESTAMP`,
            [registrationNumber, formKey, req.admin.id]
        );
        const completed = await completeRegistrationIfReady(client, registrationNumber);
        await client.query('COMMIT');
        res.json({ verified: true, registration_number: registrationNumber, form_key: formKey, registration_completed: completed });
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        console.error('Offline new-student form verification error:', err.message);
        res.status(err.status || 500).json({ error: err.status ? err.message : 'Unable to verify the offline form.' });
    } finally {
        client.release();
    }
});

router.post('/new-student-authorizations', async (req, res) => {
    const registrationNumber = typeof req.body?.registration_number === 'string'
        ? req.body.registration_number.trim().toUpperCase()
        : '';
    const assignedPassword = req.body?.password;

    if (!NEW_STUDENT_REGISTRATION_PATTERN.test(registrationNumber)
        || typeof assignedPassword !== 'string'
        || assignedPassword.length < 12) {
        return res.status(400).json({
            error: 'Enter a valid ITT, ENT, or BST registration number and a password of at least 12 characters.',
        });
    }

    try {
        const passwordHash = await bcrypt.hash(assignedPassword, 12);
        const result = await pool.query(
            `INSERT INTO Authorized_New_Student (Registration_Number, Password_Hash)
             VALUES ($1, $2)
             ON CONFLICT (Registration_Number) DO NOTHING
             RETURNING Registration_Number`,
            [registrationNumber, passwordHash]
        );

        if (result.rowCount === 0) {
            return res.status(409).json({ error: 'That registration number is already authorized.' });
        }

        res.status(201).json({ registration_number: registrationNumber, is_active: true });
    } catch (err) {
        console.error('Error adding authorized new student:', err.message);
        res.status(500).json({ error: 'Unable to add this authorized student.' });
    }
});

// Get all students
router.get('/students', async (req, res) => {
    try {
        const query = `
            SELECT 
                Student_ID, 
                Name_With_Initials, 
                Course_Of_Study, 
                Email, 
                District,
                Account_Status as status
            FROM Student 
            ORDER BY Student_ID ASC
        `;
        const result = await pool.query(query);
        res.json({ success: true, students: result.rows || result }); 
        // Note: result.rows is for pg, result is for mysql2 (assuming mysql2 since it's rusl_db)
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Approve student
router.put('/students/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('UPDATE Student SET Account_Status = $1 WHERE Student_ID = $2', ['Approved', id]);
        res.json({ success: true, message: 'Student approved successfully' });
    } catch (err) {
        console.error('Error approving student:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Delete student
router.delete('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Student WHERE Student_ID = $1', [id]);
        res.json({ success: true, message: 'Student deleted successfully' });
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Get all student registrations
router.get('/registrations', async (req, res) => {
    try {
        const query = `
            SELECT 
                r.Registration_ID, r.Academic_Year, r.Registration_Date, r.Dropped_At, r.Status,
                s.Student_ID, s.Name_With_Initials, s.Course_Of_Study,
                sub.Subject_Code, sub.Subject_Name, sub.Credit_Value
            FROM Registration r
            JOIN Student s ON r.Student_ID = s.Student_ID
            JOIN Subject sub ON r.Subject_Id = sub.Subject_Code
            ORDER BY r.Registration_Date DESC, s.Student_ID
        `;
        const result = await pool.query(query);
        res.json({ success: true, registrations: result.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: 'Failed to fetch registrations' });
    }
});

// Approve student registrations
router.put('/registrations/approve/:student_id', async (req, res) => {
    try {
        const { student_id } = req.params;
        const result = await pool.query(
            "UPDATE Registration SET Status = 'Approved' WHERE Student_ID = $1 AND Status = 'Enrolled'",
            [student_id]
        );
        if (result.rowCount === 0) {
            return res.status(409).json({ error: 'There are no pending subject registrations for this student.' });
        }
        res.json({ success: true, message: 'Registrations approved', approved_count: result.rowCount });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: 'Failed to approve registrations' });
    }
});

module.exports = router;
