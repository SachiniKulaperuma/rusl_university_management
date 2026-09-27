const express = require('express');
const router = express.Router();
const pool = require('../db');

// Register a Student for a Subject
router.post('/enroll', async (req, res) => {
    try {
        const { student_id, subject_id, academic_year } = req.body;

        // Check if already registered
        const existing = await pool.query(
            'SELECT * FROM Registration WHERE Student_ID = $1 AND Subject_Id = $2',
            [student_id, subject_id]
        );
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Student is already enrolled in this subject' });
        }

        const newRegistration = await pool.query(
            'INSERT INTO Registration (Student_ID, Subject_Id, Academic_Year, Status) VALUES ($1, $2, $3, $4) RETURNING *',
            [student_id, subject_id, academic_year, 'Enrolled']
        );

        res.status(201).json({ message: 'Enrolled successfully', registration: newRegistration.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error during enrollment' });
    }
});

// Get all registrations for a student
router.get('/student/:student_id', async (req, res) => {
    try {
        const { student_id } = req.params;
        const registrations = await pool.query(
            'SELECT r.Registration_ID, s.Subject_Code, s.Subject_Name, s.Credit_Value, r.Academic_Year, r.Status FROM Registration r JOIN Subject s ON r.Subject_Id = s.Subject_Id WHERE r.Student_ID = $1',
            [student_id]
        );
        res.json(registrations.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while fetching registrations' });
    }
});

module.exports = router;
