const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Student Registration
router.post('/register', async (req, res) => {
    try {
        const { 
            student_id, nic_no, al_index_year, course_of_study, name_with_initials, full_name,
            telephone_no, email, permanent_address, contact_address, grama_niladhari, district,
            race, religion, gender, civil_status, citizenship,
            guardian_name, guardian_occupation, guardian_work_address, guardian_telephone, guardian_relationship,
            emergency_name, emergency_telephone, password 
        } = req.body;

        // Check if user already exists
        const userExists = await pool.query('SELECT * FROM Student WHERE Email = $1 OR Student_ID = $2 OR NIC_No = $3', [email, student_id, nic_no]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Student already exists with this Email, Reg No, or NIC' });
        }

        // Default password to NIC if not provided
        const finalPassword = password || nic_no;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(finalPassword, salt);

        // Insert new student
        const newStudent = await pool.query(
            `INSERT INTO Student (
                Student_ID, NIC_No, AL_Index_Year, Course_Of_Study, Name_With_Initials, Full_Name,
                Telephone_No, Email, Permanent_Address, Contact_Address, Grama_Niladhari, District,
                Race, Religion, Gender, Civil_Status, Citizenship,
                Guardian_Name, Guardian_Occupation, Guardian_Work_Address, Guardian_Telephone, Guardian_Relationship,
                Emergency_Name, Emergency_Telephone, Password
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 
                $18, $19, $20, $21, $22, $23, $24, $25
            ) RETURNING *`,
            [
                student_id, nic_no, al_index_year, course_of_study, name_with_initials, full_name,
                telephone_no, email, permanent_address, contact_address, grama_niladhari, district,
                race, religion, gender, civil_status, citizenship,
                guardian_name, guardian_occupation, guardian_work_address, guardian_telephone, guardian_relationship,
                emergency_name, emergency_telephone, hashedPassword
            ]
        );

        res.status(201).json({ message: 'Student registered successfully', student: newStudent.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Student Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if student exists
        const student = await pool.query('SELECT * FROM Student WHERE Email = $1', [email]);
        if (student.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, student.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate Token
        const token = jwt.sign({ id: student.rows[0].student_id, role: 'student' }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '1h' });

        res.json({ message: 'Logged in successfully', token, student: student.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// --- Forgot Password Flow (OTP) ---
const otpStore = {}; // Memory store for demo

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const student = await pool.query('SELECT * FROM Student WHERE Email = $1', [email]);
        if (student.rows.length === 0) {
            return res.status(404).json({ error: 'No account found with this email' });
        }
        
        // Generate a 4 digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        otpStore[email] = { otp, expiresAt: Date.now() + 120 * 1000 };
        
        console.log(`\n==============================================`);
        console.log(`[Mock Email] OTP for ${email} is: ${otp}`);
        console.log(`==============================================\n`);
        
        res.json({ success: true, message: 'OTP sent to email (check terminal console)', otp: otp });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    const record = otpStore[email];
    
    if (!record) return res.status(400).json({ error: 'No OTP requested for this email' });
    if (Date.now() > record.expiresAt) return res.status(400).json({ error: 'OTP has expired' });
    if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    
    res.json({ success: true });
});

router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        await pool.query('UPDATE Student SET Password = $1 WHERE Email = $2', [hashedPassword, email]);
        
        delete otpStore[email]; // clear
        
        res.json({ success: true, message: 'Password updated successfully' });
    } catch(err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
