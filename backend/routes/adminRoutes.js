const express = require('express');
const router = express.Router();
const pool = require('../db');

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
                r.Registration_ID, r.Academic_Year, r.Registration_Date, r.Status,
                s.Student_ID, s.Name_With_Initials, s.Course_Of_Study,
                sub.Subject_Code, sub.Subject_Name, sub.Credit_Value
            FROM Registration r
            JOIN Student s ON r.Student_ID = s.Student_ID
            JOIN Subject sub ON r.Subject_Id = sub.Subject_Id
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
        await pool.query("UPDATE Registration SET Status = 'Approved' WHERE Student_ID = $1", [student_id]);
        res.json({ success: true, message: 'Registrations approved' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: 'Failed to approve registrations' });
    }
});

module.exports = router;
