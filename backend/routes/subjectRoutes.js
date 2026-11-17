const express = require('express');
const router = express.Router();
const pool = require('../db');
const { getAcademicPeriod } = require('../academicPeriod');
const requireAdminAuth = require('../middleware/adminAuth');

router.get('/registration', async (req, res) => {
    let period;
    try {
        period = getAcademicPeriod(req.query.student_id);
    } catch (err) {
        return res.status(err.statusCode || 400).json({ error: err.message });
    }

    try {
        const student = await pool.query(
            'SELECT Student_ID FROM Student WHERE Student_ID = $1',
            [req.query.student_id]
        );
        if (student.rows.length === 0) {
            return res.status(404).json({ error: 'Student registration number was not found.' });
        }

        const result = await pool.query(
            `SELECT * FROM (
                SELECT
                    Subject_Id,
                    Subject_Code,
                    Subject_Name,
                    Credit_Value,
                    COALESCE(NULLIF(Academic_Year::text, '')::integer, (Semester + 1) / 2) AS Academic_Year,
                    CASE
                        WHEN NULLIF(Academic_Year::text, '') IS NULL THEN ((Semester - 1) % 2) + 1
                        ELSE Semester
                    END AS Semester,
                    Department,
                    Course_Status
                FROM Subject
                WHERE Department = $3
            ) AS normalized_subjects
            WHERE Academic_Year = $1 AND Semester = $2
            ORDER BY Subject_Code`,
            [period.academicYear, period.semester, 'B.ICT']
        );

        res.json({ ...period, subjects: result.rows });
    } catch (err) {
        console.error('Error fetching registration subjects:', err.message);
        res.status(500).json({ error: 'Server error while fetching registration subjects.' });
    }
});

// Add a new Subject (Admin only)
router.post('/add', requireAdminAuth, async (req, res) => {
    const subjectCode = typeof req.body?.subject_code === 'string' ? req.body.subject_code.trim().toUpperCase() : '';
    const subjectName = typeof req.body?.subject_name === 'string' ? req.body.subject_name.trim() : '';
    const creditValue = Number(req.body?.credit_value);
    const academicYear = Number(req.body?.academic_year);
    const semester = Number(req.body?.semester);
    const department = typeof req.body?.department === 'string' ? req.body.department.trim() : '';
    const courseStatus = req.body?.course_status;

    if (!subjectCode || subjectCode.length > 20 || !subjectName || subjectName.length > 100
        || !Number.isInteger(creditValue) || creditValue < 0 || creditValue > 10
        || !Number.isInteger(academicYear) || academicYear < 1 || academicYear > 4
        || !Number.isInteger(semester) || ![1, 2].includes(semester)
        || !['B.ICT', 'B.ET', 'B.BST'].includes(department)
        || !['C', 'O'].includes(courseStatus)) {
        return res.status(400).json({ error: 'Enter a valid subject code, name, credits, academic year, semester, department, and subject type.' });
    }

    try {
        const newSubject = await pool.query(
            `INSERT INTO Subject (Subject_Code, Subject_Name, Credit_Value, Academic_Year, Semester, Department, Course_Status)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [subjectCode, subjectName, creditValue, academicYear, semester, department, courseStatus]
        );

        res.status(201).json({ message: 'Subject added successfully', subject: newSubject.rows[0] });
    } catch (err) {
        console.error('Error adding subject:', err.message);
        if (err.code === '23505') {
            return res.status(409).json({ error: 'That subject code already exists.' });
        }
        res.status(500).json({ error: 'Unable to save the subject. Please try again.' });
    }
});

// Get all Subjects
router.get('/all', async (req, res) => {
    try {
        const subjects = await pool.query(
            `SELECT * FROM Subject
             ORDER BY Department, Academic_Year NULLS LAST, Semester, Course_Status, Subject_Code`
        );
        res.json(subjects.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while fetching subjects' });
    }
});

module.exports = router;
