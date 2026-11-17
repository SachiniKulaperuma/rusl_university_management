const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '6mb' })); // Allow small identity-card image uploads as JSON.

// Database connection eka import karagamu
const pool = require('./db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const examAdmissionRoutes = require('./routes/examAdmissionRoutes');

// Routes setup
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/exam-admissions', examAdmissionRoutes);

// Basic test route eka (server eka wada kiyala balanna)
app.get('/', (req, res) => {
  res.send('University Management Backend is running!');
});

// Database connection eka test karanna route eka
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ success: true, time: result.rows[0].now, message: 'Database connected successfully!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: 'Database connection failed', details: err.message });
    }
});

// Server eka start karana thana
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
