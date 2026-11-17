const express = require('express');
const router = express.Router();
const pool = require('../db');
const requireStudentAuth = require('../middleware/studentAuth');
const requireAdminAuth = require('../middleware/adminAuth');

const VALID_STATUSES = new Set(['Pending', 'Approved', 'Rejected']);

function normalizeStudentId(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function ensureStudentAccess(req, res) {
  const studentId = normalizeStudentId(req.params.studentId);
  if (!studentId) {
    res.status(400).json({ error: 'A student registration number is required.' });
    return null;
  }
  if (studentId.toLowerCase() !== req.studentId.toLowerCase()) {
    res.status(403).json({ error: 'You can only access your own exam admission applications.' });
    return null;
  }
  return studentId;
}

function normalizeSettings(body) {
  const academicYear = typeof body?.academic_year === 'string' ? body.academic_year.trim() : '';
  const semester = Number(body?.semester);
  const startDate = typeof body?.semester_start_date === 'string' ? body.semester_start_date : '';
  const endDate = typeof body?.semester_end_date === 'string' ? body.semester_end_date : '';
  const deadline = typeof body?.deadline === 'string' ? body.deadline : '';
  const parsedStart = new Date(`${startDate}T00:00:00Z`);
  const parsedEnd = new Date(`${endDate}T00:00:00Z`);
  const parsedDeadline = new Date(`${deadline}T00:00:00Z`);
  const openingDate = new Date(parsedEnd);
  openingDate.setUTCMonth(openingDate.getUTCMonth() - 2);

  if (!academicYear || academicYear.length > 20 || !Number.isInteger(semester) || ![1, 2].includes(semester)
      || Number.isNaN(parsedStart.getTime()) || Number.isNaN(parsedEnd.getTime()) || Number.isNaN(parsedDeadline.getTime())
      || parsedStart > parsedEnd || parsedDeadline < openingDate || parsedDeadline > parsedEnd) {
    const error = new Error('Enter a valid academic year, semester, start date, end date, and deadline. The deadline must fall between the application opening date and semester end date.');
    error.status = 400;
    throw error;
  }
  return { academicYear, semester, startDate, endDate, deadline };
}

async function getActiveSetting(client) {
  const result = await client.query(
    `SELECT Setting_Id, Academic_Year, Semester, Semester_Start_Date, Semester_End_Date, Deadline,
            (Semester_End_Date - INTERVAL '2 months')::date AS Application_Open_Date
     FROM Semester_Exam_Admission_Settings
     WHERE Academic_Year IS NOT NULL AND Semester IN (1, 2)
       AND Semester_Start_Date IS NOT NULL AND Semester_End_Date IS NOT NULL
       AND CURRENT_DATE BETWEEN Semester_Start_Date AND Semester_End_Date
     ORDER BY Semester_End_Date ASC, Setting_Id DESC
     LIMIT 1`
  );
  return result.rows[0] || null;
}

async function getEligibleSubjects(client, studentId, academicYear, semester) {
  const result = await client.query(
    `SELECT r.Registration_ID, s.Subject_Code, s.Subject_Name, s.Credit_Value, s.Course_Status
     FROM Registration r
     JOIN Subject s ON s.Subject_Code = r.Subject_Id
     WHERE LOWER(r.Student_ID) = LOWER($1)
       AND r.Academic_Year = $2
       AND r.Status <> 'Dropped'
       AND (CASE WHEN s.Academic_Year IS NULL THEN ((s.Semester - 1) % 2) + 1 ELSE s.Semester END) = $3
     ORDER BY s.Subject_Code`,
    [studentId, academicYear, semester]
  );
  return result.rows;
}

async function getStudent(client, studentId) {
  const result = await client.query(
    `SELECT Student_ID, Name_With_Initials, Full_Name
     FROM Student WHERE LOWER(Student_ID) = LOWER($1)`,
    [studentId]
  );
  return result.rows[0] || null;
}

function isApplicationOpen(setting) {
  const today = new Date().toISOString().slice(0, 10);
  const dateOnly = value => new Date(value).toISOString().slice(0, 10);
  return today >= dateOnly(setting.application_open_date)
    && today <= dateOnly(setting.deadline);
}

router.get('/student/:studentId/context', requireStudentAuth, async (req, res) => {
  const studentId = ensureStudentAccess(req, res);
  if (!studentId) return;
  try {
    const [student, setting] = await Promise.all([getStudent(pool, studentId), getActiveSetting(pool)]);
    if (!student) return res.status(404).json({ error: 'Student was not found.' });
    if (!setting) return res.json({ student, setting: null, subjects: [], application_open: false, message: 'No active semester exam admission schedule is configured.' });
    const subjects = await getEligibleSubjects(pool, student.student_id, setting.academic_year, setting.semester);
    res.json({ student, setting, subjects, application_open: isApplicationOpen(setting) });
  } catch (err) {
    console.error('Error loading exam admission context:', err.message);
    res.status(500).json({ error: 'Unable to load exam admission details.' });
  }
});

router.get('/student/:studentId/applications', requireStudentAuth, async (req, res) => {
  const studentId = ensureStudentAccess(req, res);
  if (!studentId) return;
  try {
    const result = await pool.query(
      `SELECT Exam_Registration_Id, Academic_Year, Semester, Subjects, Status, Application_Date,
              Rejection_Reason, Reviewed_At
       FROM Exam_Registrations
       WHERE LOWER(Student_ID) = LOWER($1)
       ORDER BY Application_Date DESC, Exam_Registration_Id DESC`,
      [studentId]
    );
    res.json({ applications: result.rows });
  } catch (err) {
    console.error('Error loading student exam admissions:', err.message);
    res.status(500).json({ error: 'Unable to load exam admission applications.' });
  }
});

router.post('/student/:studentId/applications', requireStudentAuth, async (req, res) => {
  const studentId = ensureStudentAccess(req, res);
  if (!studentId) return;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const student = await getStudent(client, studentId);
    if (!student) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Student was not found.' });
    }
    const setting = await getActiveSetting(client);
    if (!setting) {
      await client.query('ROLLBACK');
      return res.status(422).json({ error: 'No active semester exam admission schedule is configured.' });
    }
    if (!isApplicationOpen(setting)) {
      await client.query('ROLLBACK');
      return res.status(422).json({ error: 'The exam admission application period is closed.', application_open_date: setting.application_open_date, deadline: setting.deadline });
    }
    const subjects = await getEligibleSubjects(client, student.student_id, setting.academic_year, setting.semester);
    if (subjects.length === 0) {
      await client.query('ROLLBACK');
      return res.status(422).json({ error: 'You have no active registered subjects for this semester.' });
    }
    const snapshot = subjects.map(subject => ({
      registration_id: subject.registration_id,
      subject_code: subject.subject_code,
      subject_name: subject.subject_name,
      credit_value: subject.credit_value,
      subject_type: subject.course_status === 'O' ? 'Optional' : 'Compulsory',
    }));
    const created = await client.query(
      `INSERT INTO Exam_Registrations (Student_ID, Exam_Name, Academic_Year, Semester, Subjects, Repeat_Subjects, Status)
       VALUES ($1, $2, $3, $4, $5::jsonb, '[]'::jsonb, 'Pending')
       RETURNING Exam_Registration_Id, Student_ID, Academic_Year, Semester, Subjects, Status, Application_Date`,
      [student.student_id, `End Semester Examination - Semester ${setting.semester}`, setting.academic_year, setting.semester, JSON.stringify(snapshot)]
    );
    await client.query(
      `INSERT INTO Exam_Registration_Status_History (Exam_Registration_Id, Status, Reason)
       VALUES ($1, 'Pending', 'Application submitted by student.')`,
      [created.rows[0].exam_registration_id]
    );
    await client.query('COMMIT');
    res.status(201).json({ message: 'Exam admission application submitted successfully.', application: created.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    if (err.code === '23505') return res.status(409).json({ error: 'You have already submitted an exam admission application for this academic year and semester.' });
    console.error('Error submitting exam admission:', err.message);
    res.status(500).json({ error: 'Unable to submit the exam admission application.' });
  } finally {
    client.release();
  }
});

router.use('/admin', requireAdminAuth);

router.get('/admin/settings', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT Setting_Id, Academic_Year, Semester, Semester_Start_Date, Semester_End_Date, Deadline,
              (Semester_End_Date - INTERVAL '2 months')::date AS Application_Open_Date
       FROM Semester_Exam_Admission_Settings
       WHERE Academic_Year IS NOT NULL AND Semester IN (1, 2)
       ORDER BY Semester_Start_Date DESC, Setting_Id DESC`
    );
    res.json({ settings: result.rows });
  } catch (err) {
    console.error('Error fetching exam settings:', err.message);
    res.status(500).json({ error: 'Unable to load exam admission settings.' });
  }
});

router.post('/admin/settings', async (req, res) => {
  try {
    const { academicYear, semester, startDate, endDate, deadline } = normalizeSettings(req.body);
    const result = await pool.query(
      `INSERT INTO Semester_Exam_Admission_Settings (Academic_Year, Semester, Semester_Start_Date, Semester_End_Date, Deadline)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING Setting_Id, Academic_Year, Semester, Semester_Start_Date, Semester_End_Date, Deadline,
                 (Semester_End_Date - INTERVAL '2 months')::date AS Application_Open_Date`,
      [academicYear, semester, startDate, endDate, deadline]
    );
    res.status(201).json({ message: 'Semester exam admission schedule saved.', setting: result.rows[0] });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error('Error saving exam settings:', err.message);
    res.status(500).json({ error: 'Unable to save the semester schedule.' });
  }
});

router.put('/admin/settings/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'A valid schedule is required.' });
    const { academicYear, semester, startDate, endDate, deadline } = normalizeSettings(req.body);
    const result = await pool.query(
      `UPDATE Semester_Exam_Admission_Settings
       SET Academic_Year = $1, Semester = $2, Semester_Start_Date = $3, Semester_End_Date = $4,
           Deadline = $5, Updated_At = CURRENT_TIMESTAMP
       WHERE Setting_Id = $6
       RETURNING Setting_Id, Academic_Year, Semester, Semester_Start_Date, Semester_End_Date, Deadline,
                 (Semester_End_Date - INTERVAL '2 months')::date AS Application_Open_Date`,
      [academicYear, semester, startDate, endDate, deadline, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Semester schedule was not found.' });
    res.json({ message: 'Semester exam admission schedule updated.', setting: result.rows[0] });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error('Error updating exam settings:', err.message);
    res.status(500).json({ error: 'Unable to update the semester schedule.' });
  }
});

router.get('/admin/applications', async (req, res) => {
  const { academic_year: academicYear, semester, status, search } = req.query;
  const values = [];
  const filters = [];
  if (typeof academicYear === 'string' && academicYear.trim()) {
    values.push(academicYear.trim()); filters.push(`er.Academic_Year = $${values.length}`);
  }
  if (semester !== undefined && semester !== '') {
    const parsedSemester = Number(semester);
    if (!Number.isInteger(parsedSemester) || ![1, 2].includes(parsedSemester)) return res.status(400).json({ error: 'Semester must be 1 or 2.' });
    values.push(parsedSemester); filters.push(`er.Semester = $${values.length}`);
  }
  if (typeof status === 'string' && status.trim()) {
    if (!VALID_STATUSES.has(status)) return res.status(400).json({ error: 'Invalid application status.' });
    values.push(status); filters.push(`er.Status = $${values.length}`);
  }
  if (typeof search === 'string' && search.trim()) {
    values.push(`%${search.trim()}%`); filters.push(`(er.Student_ID ILIKE $${values.length} OR st.Name_With_Initials ILIKE $${values.length})`);
  }
  try {
    const result = await pool.query(
      `SELECT er.Exam_Registration_Id, er.Student_ID, st.Name_With_Initials, er.Academic_Year, er.Semester,
              er.Subjects, er.Status, er.Application_Date, er.Rejection_Reason, er.Reviewed_At,
              reviewer.Name AS Reviewer_Name
       FROM Exam_Registrations er
       JOIN Student st ON LOWER(st.Student_ID) = LOWER(er.Student_ID)
       LEFT JOIN Administrator reviewer ON reviewer.Admin_Id = er.Reviewed_By
       ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
       ORDER BY er.Application_Date DESC, er.Exam_Registration_Id DESC`,
      values
    );
    res.json({ applications: result.rows });
  } catch (err) {
    console.error('Error fetching exam applications:', err.message);
    res.status(500).json({ error: 'Unable to load exam admission applications.' });
  }
});

router.put('/admin/applications/:id/status', async (req, res) => {
  const applicationId = Number(req.params.id);
  const status = req.body?.status;
  const rejectionReason = typeof req.body?.rejection_reason === 'string' ? req.body.rejection_reason.trim() : '';
  if (!Number.isInteger(applicationId) || applicationId < 1 || !['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ error: 'A valid application and approval decision are required.' });
  }
  if (status === 'Rejected' && !rejectionReason) return res.status(400).json({ error: 'Provide a reason when rejecting an application.' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const current = await client.query('SELECT Status FROM Exam_Registrations WHERE Exam_Registration_Id = $1 FOR UPDATE', [applicationId]);
    if (current.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Exam admission application was not found.' });
    }
    if (current.rows[0].status !== 'Pending') {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Only pending applications can be approved or rejected.' });
    }
    const updated = await client.query(
      `UPDATE Exam_Registrations
       SET Status = $1, Rejection_Reason = $2, Reviewed_By = $3, Reviewed_At = CURRENT_TIMESTAMP
       WHERE Exam_Registration_Id = $4
       RETURNING Exam_Registration_Id, Status, Rejection_Reason, Reviewed_At`,
      [status, status === 'Rejected' ? rejectionReason : null, req.admin.id, applicationId]
    );
    await client.query(
      `INSERT INTO Exam_Registration_Status_History (Exam_Registration_Id, Status, Reason, Changed_By)
       VALUES ($1, $2, $3, $4)`,
      [applicationId, status, status === 'Rejected' ? rejectionReason : 'Application approved.', req.admin.id]
    );
    await client.query('COMMIT');
    res.json({ message: `Application ${status.toLowerCase()} successfully.`, application: updated.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Error reviewing exam application:', err.message);
    res.status(500).json({ error: 'Unable to update the exam admission application.' });
  } finally {
    client.release();
  }
});

module.exports = router;
