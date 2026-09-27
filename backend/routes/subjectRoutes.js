const express = require('express');
const router = express.Router();
const pool = require('../db');

// Add a new Subject (Admin only)
router.post('/add', async (req, res) => {
    try {
        const { subject_code, subject_name, credit_value, semester, department } = req.body;
        
        const newSubject = await pool.query(
            'INSERT INTO Subject (Subject_Code, Subject_Name, Credit_Value, Semester, Department) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [subject_code, subject_name, credit_value, semester, department]
        );

        res.status(201).json({ message: 'Subject added successfully', subject: newSubject.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while adding subject' });
    }
});

// Get all Subjects
router.get('/all', async (req, res) => {
    try {
        const subjects = await pool.query('SELECT * FROM Subject');
        res.json(subjects.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while fetching subjects' });
    }
});

module.exports = router;
