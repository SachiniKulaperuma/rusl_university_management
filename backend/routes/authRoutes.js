const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sessionSecret = require('../newStudentSessionSecret');
const { SESSION_COOKIE, requireNewStudentAuth } = require('../middleware/newStudentAuth');
const { REQUIRED_FORM_KEYS, OFFLINE_FORM_KEYS, completeRegistrationIfReady } = require('../newStudentRegistrationCompletion');
const { saveDedicatedForm } = require('../newStudentFormTablePersistence');

const NEW_STUDENT_REGISTRATION_PATTERN = /^(ITT|ENT|BST)\/\d{4}\/\d{3}$/;
const NEW_STUDENT_SESSION_MAX_AGE = 24 * 60 * 60 * 1000;
const REGISTRATION_FORM_ROUTES = {
    'student-personal-info': '/register/student-personal-info',
    'identity-card': '/register/identity-card',
    residentials: '/register/residentials',
    sports: '/register/sports',
    skill: '/register/skill',
    bursary: '/register/bursary',
    mahapola: '/register/mahapola',
    medical: '/register/medical',
};

function normalizeRegistrationNumber(value) {
    return typeof value === 'string' ? value.trim().toUpperCase() : '';
}

function clearNewStudentSession(res) {
    res.clearCookie(SESSION_COOKIE, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    });
}

function normalizeIncomingDraft(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return null;
    }

    const base = { ...payload };
    const formKey = typeof payload.form_id === 'string' && payload.form_id.trim() ? payload.form_id.trim() : null;
    const nestedDraft = payload.draft && typeof payload.draft === 'object' && !Array.isArray(payload.draft)
        ? payload.draft
        : null;

    if (formKey && nestedDraft) {
        delete base.form_id;
        delete base.draft;
        delete base.completed;
        base[formKey] = nestedDraft;
        if (payload.completionStatus && typeof payload.completionStatus === 'object' && !Array.isArray(payload.completionStatus)) {
            base.completionStatus = {
                ...(base.completionStatus && typeof base.completionStatus === 'object' && !Array.isArray(base.completionStatus) ? base.completionStatus : {}),
                ...payload.completionStatus,
            };
        }
        return base;
    }

    delete base.form_id;
    delete base.draft;
    delete base.completed;
    return base;
}

function parseDraft(draft) {
    const normalizedDraft = normalizeIncomingDraft(draft);
    if (!normalizedDraft || typeof normalizedDraft !== 'object' || Array.isArray(normalizedDraft)) return null;
    const serializedDraft = JSON.stringify(normalizedDraft);
    if (Buffer.byteLength(serializedDraft, 'utf8') > 100_000) return null;
    return serializedDraft;
}

function mergeDraftData(existingDraft, incomingDraft) {
    const base = existingDraft && typeof existingDraft === 'object' && !Array.isArray(existingDraft)
        ? { ...existingDraft }
        : {};
    const incoming = incomingDraft && typeof incomingDraft === 'object' && !Array.isArray(incomingDraft)
        ? incomingDraft
        : {};

    Object.keys(incoming).forEach((key) => {
        const currentValue = base[key];
        const nextValue = incoming[key];

        if (
            key === 'completionStatus' &&
            currentValue && typeof currentValue === 'object' && !Array.isArray(currentValue) &&
            nextValue && typeof nextValue === 'object' && !Array.isArray(nextValue)
        ) {
            const statuses = { ...currentValue, ...nextValue };
            Object.keys(statuses).forEach((formKey) => {
                statuses[formKey] = currentValue[formKey] === true || nextValue[formKey] === true;
            });
            base[key] = statuses;
            return;
        }

        if (
            currentValue && typeof currentValue === 'object' && !Array.isArray(currentValue) &&
            nextValue && typeof nextValue === 'object' && !Array.isArray(nextValue)
        ) {
            base[key] = { ...currentValue, ...nextValue };
            return;
        }

        base[key] = nextValue;
    });

    return base;
}

async function saveAuthorizedDraft(registrationNumber, draft) {
    const normalizedDraft = normalizeIncomingDraft(draft);
    const serializedDraft = parseDraft(normalizedDraft || draft);
    if (serializedDraft === null) return false;

    const existingResult = await pool.query(
        `SELECT Draft_Data
         FROM Authorized_New_Student
         WHERE Registration_Number = $1 AND Is_Active = TRUE AND Registration_Completed = FALSE`,
        [registrationNumber]
    );

    const existingDraft = existingResult.rows[0]?.draft_data && typeof existingResult.rows[0].draft_data === 'object'
        ? existingResult.rows[0].draft_data
        : {};

    const mergedDraft = mergeDraftData(existingDraft, JSON.parse(serializedDraft));
    const mergedSerializedDraft = JSON.stringify(mergedDraft);

    const result = await pool.query(
        `UPDATE Authorized_New_Student
         SET Draft_Data = $2::jsonb
         WHERE Registration_Number = $1 AND Is_Active = TRUE AND Registration_Completed = FALSE`,
        [registrationNumber, mergedSerializedDraft]
    );
    return result.rowCount === 1;
}

router.post('/new-student/login', async (req, res) => {
    const registrationNumber = normalizeRegistrationNumber(req.body?.registration_number);
    const password = req.body?.password;

    if (!NEW_STUDENT_REGISTRATION_PATTERN.test(registrationNumber) || typeof password !== 'string' || !password) {
        return res.status(401).json({ error: 'Invalid Registration Number or Password.' });
    }

    try {
        const result = await pool.query(
            `SELECT Password_Hash, Is_Active, Registration_Completed
             FROM Authorized_New_Student
             WHERE Registration_Number = $1`,
            [registrationNumber]
        );
        const authorizedStudent = result.rows[0];

        if (!authorizedStudent || !authorizedStudent.is_active) {
            return res.status(401).json({ error: 'Invalid Registration Number or Password.' });
        }

        const passwordMatches = await bcrypt.compare(password, authorizedStudent.password_hash);
        if (!passwordMatches) {
            return res.status(401).json({ error: 'Invalid Registration Number or Password.' });
        }

        if (authorizedStudent.registration_completed) {
            return res.status(409).json({ error: 'Your registration has already been completed. You cannot register again.' });
        }

        for (const formKey of OFFLINE_FORM_KEYS) {
            await pool.query(
                `INSERT INTO New_Student_Form_Submission (Registration_Number, Form_Key, Form_Data, Submission_Status)
                 VALUES ($1, $2, '{}'::jsonb, 'pending_staff_verification')
                 ON CONFLICT (Registration_Number, Form_Key) DO NOTHING`,
                [registrationNumber, formKey]
            );
        }

        const submissionResult = await pool.query(
            'SELECT Form_Key, Submission_Status FROM New_Student_Form_Submission WHERE Registration_Number = $1',
            [registrationNumber]
        );
        const submissionStatuses = Object.fromEntries(submissionResult.rows.map(row => [row.form_key, row.submission_status]));
        const nextForm = REQUIRED_FORM_KEYS.find((formKey) => {
            const requiredStatus = OFFLINE_FORM_KEYS.has(formKey) ? 'staff_verified' : 'submitted';
            return submissionStatuses[formKey] !== requiredStatus;
        }) || 'student-personal-info';

        const token = jwt.sign(
            { role: 'new-student-registration', registrationNumber },
            sessionSecret,
            { expiresIn: '24h' }
        );

        res.cookie(SESSION_COOKIE, token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: NEW_STUDENT_SESSION_MAX_AGE,
        });

        res.json({
            success: true,
            registration_number: registrationNumber,
            next_route: REGISTRATION_FORM_ROUTES[nextForm],
        });
    } catch (err) {
        console.error('New student login error:', err.message);
        res.status(500).json({ error: 'Unable to validate registration details right now.' });
    }
});

router.get('/new-student/session', requireNewStudentAuth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT Is_Active, Registration_Completed, Draft_Data
             FROM Authorized_New_Student
             WHERE Registration_Number = $1`,
            [req.authorizedRegistrationNumber]
        );
        const account = result.rows[0];
        if (!account || !account.is_active || account.registration_completed) {
            clearNewStudentSession(res);
            return res.status(401).json({ error: 'This registration is no longer available.' });
        }

        const submissions = await pool.query(
            'SELECT Form_Key, Submission_Status FROM New_Student_Form_Submission WHERE Registration_Number = $1',
            [req.authorizedRegistrationNumber]
        );
        res.json({
            authorized: true,
            registration_number: req.authorizedRegistrationNumber,
            draft: account.draft_data && typeof account.draft_data === 'object' ? account.draft_data : {},
            form_statuses: Object.fromEntries(submissions.rows.map(row => [row.form_key, row.submission_status])),
        });
    } catch (err) {
        console.error('New student session check error:', err.message);
        res.status(500).json({ error: 'Unable to validate the registration session.' });
    }
});

router.put('/new-student/draft', requireNewStudentAuth, async (req, res) => {
    try {
        const normalizedDraft = normalizeIncomingDraft(req.body);
        if (!parseDraft(normalizedDraft || req.body)) {
            return res.status(400).json({ error: 'The registration draft is invalid or too large.' });
        }

        const saved = await saveAuthorizedDraft(req.authorizedRegistrationNumber, normalizedDraft || req.body);
        if (!saved) {
            clearNewStudentSession(res);
            return res.status(409).json({ error: 'This registration is no longer available.' });
        }

        res.json({ saved: true });
    } catch (err) {
        console.error('New student draft save error:', err.message);
        res.status(500).json({ error: 'Unable to save the registration draft.' });
    }
});

router.post('/new-student/leave', requireNewStudentAuth, async (req, res) => {
    try {
        const normalizedDraft = normalizeIncomingDraft(req.body);
        if (!parseDraft(normalizedDraft || req.body)) {
            return res.status(400).json({ error: 'The registration draft is invalid or too large.' });
        }

        const saved = await saveAuthorizedDraft(req.authorizedRegistrationNumber, normalizedDraft || req.body);
        if (!saved) {
            return res.status(409).json({ error: 'This registration is no longer available.' });
        }

        res.json({ saved: true, signed_out: false });
    } catch (err) {
        console.error('New student draft leave error:', err.message);
        res.status(500).json({ error: 'Unable to save the registration draft.' });
    }
});

router.post('/new-student/logout', (req, res) => {
    clearNewStudentSession(res);
    res.json({ success: true });
});

router.post('/new-student/forms', requireNewStudentAuth, async (req, res) => {
    const formKey = req.body?.form_key;
    const formData = req.body?.form_data;
    const attachments = req.body?.attachments ?? [];
    const supportedForms = new Set(['identity-card', 'residentials', 'sports', 'skill', 'medical']);
    const requiredFields = {
        'identity-card': ['reg_no', 'admission_year', 'nic_no', 'course', 'full_name_en', 'title', 'telephone', 'email', 'perm_address_en'],
        residentials: ['full_name', 'registration_number', 'nic_number', 'faculty', 'permanent_address', 'district', 'distance_km', 'contact_no', 'hostel_preference', 'father_name', 'father_occupation', 'father_annual_income', 'mother_name', 'mother_occupation', 'mother_annual_income', 'total_household_income', 'divisional_secretariat', 'certified_income'],
        sports: ['full_name', 'faculty', 'weight_kg', 'height_cm', 'date_of_birth', 'permanent_address', 'district', 'contact_no'],
        skill: ['student_name', 'reg_no', 'nic_passport'],
        medical: ['student_name', 'reg_no', 'nic_passport'],
    };

    if (
        typeof formKey !== 'string' || !supportedForms.has(formKey) ||
        !formData || typeof formData !== 'object' || Array.isArray(formData) ||
        !Array.isArray(attachments) || attachments.length > 2 ||
        Buffer.byteLength(JSON.stringify(formData), 'utf8') > 100_000
    ) {
        return res.status(400).json({ error: 'The registration form submission is invalid or too large.' });
    }

    const missingField = requiredFields[formKey].find((field) => {
        const value = formData[field];
        return typeof value !== 'string' || value.trim().length === 0;
    });
    if (missingField) {
        return res.status(400).json({ error: `Complete the required ${missingField.replaceAll('_', ' ')} field.` });
    }

    const submittedRegistrationNumber = formData.reg_no || formData.registration_number;
    if (submittedRegistrationNumber && normalizeRegistrationNumber(submittedRegistrationNumber) !== req.authorizedRegistrationNumber) {
        return res.status(403).json({ error: 'Registration number does not match the authorized account.' });
    }

    const parsedAttachments = [];
    for (const attachment of attachments) {
        const validField = formKey === 'identity-card' && ['photo', 'signature'].includes(attachment?.field_name);
        const validMimeType = ['image/jpeg', 'image/png'].includes(attachment?.mime_type);
        const base64 = attachment?.data_base64;
        if (!validField || !validMimeType || typeof base64 !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) {
            return res.status(400).json({ error: 'An uploaded file is invalid.' });
        }

        const fileData = Buffer.from(base64, 'base64');
        const isPng = attachment.mime_type === 'image/png' && fileData.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'));
        const isJpeg = attachment.mime_type === 'image/jpeg' && fileData.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
        if (fileData.length === 0 || fileData.length > 2 * 1024 * 1024 || (!isPng && !isJpeg) || fileData.toString('base64') !== base64) {
            return res.status(400).json({ error: 'Uploaded images must be valid JPEG or PNG files up to 2 MB.' });
        }

        const fileName = typeof attachment.file_name === 'string'
            ? attachment.file_name.replace(/[\\/\u0000-\u001f]/g, '_').slice(0, 255) || 'upload'
            : 'upload';
        parsedAttachments.push({
            fieldName: attachment.field_name,
            fileName,
            mimeType: attachment.mime_type,
            fileData,
        });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const authorization = await client.query(
            `SELECT Is_Active, Registration_Completed, Draft_Data
             FROM Authorized_New_Student
             WHERE Registration_Number = $1
             FOR UPDATE`,
            [req.authorizedRegistrationNumber]
        );
        const account = authorization.rows[0];
        if (!account || !account.is_active) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'This registration account is not authorized.' });
        }
        if (account.registration_completed) {
            await client.query('ROLLBACK');
            return res.status(409).json({ error: 'Your registration has already been completed. You cannot register again.' });
        }

        await saveDedicatedForm(client, req.authorizedRegistrationNumber, formKey, formData, parsedAttachments);

        await client.query(
            `INSERT INTO New_Student_Form_Submission (Registration_Number, Form_Key, Form_Data, Submission_Status)
             VALUES ($1, $2, $3::jsonb, 'submitted')
             ON CONFLICT (Registration_Number, Form_Key) DO UPDATE
             SET Form_Data = EXCLUDED.Form_Data, Submission_Status = 'submitted',
                 Submitted_At = CURRENT_TIMESTAMP, Verified_By = NULL, Verified_At = NULL`,
            [req.authorizedRegistrationNumber, formKey, '{}']
        );

        for (const attachment of parsedAttachments) {
            await client.query(
                `INSERT INTO New_Student_Form_Attachment (
                    Registration_Number, Form_Key, Field_Name, File_Name, Mime_Type, File_Data
                 ) VALUES ($1, $2, $3, $4, $5, $6)
                 ON CONFLICT (Registration_Number, Form_Key, Field_Name) DO UPDATE
                 SET File_Name = EXCLUDED.File_Name, Mime_Type = EXCLUDED.Mime_Type,
                     File_Data = EXCLUDED.File_Data, Uploaded_At = CURRENT_TIMESTAMP`,
                [req.authorizedRegistrationNumber, formKey, attachment.fieldName, attachment.fileName, attachment.mimeType, attachment.fileData]
            );
        }

        const savedDraft = mergeDraftData(account.draft_data, {
            [formKey]: formData,
            completionStatus: { [formKey]: true },
        });
        await client.query(
            'UPDATE Authorized_New_Student SET Draft_Data = $2::jsonb WHERE Registration_Number = $1',
            [req.authorizedRegistrationNumber, JSON.stringify(savedDraft)]
        );
        const completed = await completeRegistrationIfReady(client, req.authorizedRegistrationNumber);
        await client.query('COMMIT');
        if (completed) clearNewStudentSession(res);
        res.status(201).json({ submitted: true, form_key: formKey, registration_completed: completed });
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        console.error('New student form submission error:', err.message);
        res.status(err.status || 500).json({ error: err.status ? err.message : 'Unable to save the registration form.' });
    } finally {
        client.release();
    }
});

// Student Registration
router.post('/register', requireNewStudentAuth, async (req, res) => {
    const studentData = req.body;
    const normalizedStudentId = normalizeRegistrationNumber(studentData?.student_id);
    const requiredFields = [
        'nic_no', 'al_index_year', 'course_of_study', 'name_with_initials', 'full_name',
        'telephone_no', 'email', 'permanent_address', 'district', 'gender', 'guardian_name',
        'emergency_name', 'emergency_telephone',
    ];
    if (normalizedStudentId !== req.authorizedRegistrationNumber) {
        return res.status(403).json({ error: 'Registration number does not match the authorized account.' });
    }
    if (requiredFields.some(field => typeof studentData?.[field] !== 'string' || !studentData[field].trim())) {
        return res.status(400).json({ error: 'Complete all required student personal information fields.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentData.email.trim()) || studentData.nic_no.trim().length > 20) {
        return res.status(400).json({ error: 'Enter a valid email address and identity number.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const authorization = await client.query(
            `SELECT Is_Active, Registration_Completed, Draft_Data
             FROM Authorized_New_Student
             WHERE Registration_Number = $1
             FOR UPDATE`,
            [req.authorizedRegistrationNumber]
        );
        const authorizedStudent = authorization.rows[0];
        if (!authorizedStudent || !authorizedStudent.is_active) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'This registration account is not authorized.' });
        }
        if (authorizedStudent.registration_completed) {
            await client.query('ROLLBACK');
            return res.status(409).json({ error: 'Your registration has already been completed. You cannot register again.' });
        }

        const duplicateStudent = await client.query(
            'SELECT 1 FROM Student WHERE (Email = $1 OR NIC_No = $2) AND Student_ID <> $3',
            [studentData.email.trim(), studentData.nic_no.trim(), normalizedStudentId]
        );
        if (duplicateStudent.rowCount > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ error: 'Student already exists with this Email, Reg No, or NIC.' });
        }

        const pendingPassword = await bcrypt.hash(`pending:${normalizedStudentId}:${studentData.nic_no.trim()}`, 10);
        await client.query(
            `INSERT INTO Student (Student_ID, NIC_No, AL_Index_Year, Course_Of_Study, Name_With_Initials, Full_Name,
                Telephone_No, Email, Permanent_Address, Contact_Address, Grama_Niladhari, District, Race, Religion,
                Gender, Civil_Status, Citizenship, Guardian_Name, Guardian_Occupation, Guardian_Work_Address,
                Guardian_Telephone, Guardian_Relationship, Emergency_Name, Emergency_Telephone, Password)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
             ON CONFLICT (Student_ID) DO UPDATE SET NIC_No=EXCLUDED.NIC_No, AL_Index_Year=EXCLUDED.AL_Index_Year,
                Course_Of_Study=EXCLUDED.Course_Of_Study, Name_With_Initials=EXCLUDED.Name_With_Initials,
                Full_Name=EXCLUDED.Full_Name, Telephone_No=EXCLUDED.Telephone_No, Email=EXCLUDED.Email,
                Permanent_Address=EXCLUDED.Permanent_Address, Contact_Address=EXCLUDED.Contact_Address,
                Grama_Niladhari=EXCLUDED.Grama_Niladhari, District=EXCLUDED.District, Race=EXCLUDED.Race,
                Religion=EXCLUDED.Religion, Gender=EXCLUDED.Gender, Civil_Status=EXCLUDED.Civil_Status,
                Citizenship=EXCLUDED.Citizenship, Guardian_Name=EXCLUDED.Guardian_Name,
                Guardian_Occupation=EXCLUDED.Guardian_Occupation, Guardian_Work_Address=EXCLUDED.Guardian_Work_Address,
                Guardian_Telephone=EXCLUDED.Guardian_Telephone, Guardian_Relationship=EXCLUDED.Guardian_Relationship,
                Emergency_Name=EXCLUDED.Emergency_Name, Emergency_Telephone=EXCLUDED.Emergency_Telephone`,
            [normalizedStudentId, studentData.nic_no.trim(), studentData.al_index_year.trim(), studentData.course_of_study.trim(), studentData.name_with_initials.trim(), studentData.full_name.trim(), studentData.telephone_no.trim(), studentData.email.trim(), studentData.permanent_address.trim(), studentData.contact_address || null, studentData.grama_niladhari || null, studentData.district.trim(), studentData.race || null, studentData.religion || null, studentData.gender.trim(), studentData.civil_status || null, studentData.citizenship || null, studentData.guardian_name.trim(), studentData.guardian_occupation || null, studentData.guardian_work_address || null, studentData.guardian_telephone || null, studentData.guardian_relationship || null, studentData.emergency_name.trim(), studentData.emergency_telephone.trim(), pendingPassword]
        );

        await client.query(
            `INSERT INTO New_Student_Form_Submission (Registration_Number, Form_Key, Form_Data, Submission_Status)
             VALUES ($1, 'student-personal-info', $2::jsonb, 'submitted')
             ON CONFLICT (Registration_Number, Form_Key) DO UPDATE
             SET Form_Data = EXCLUDED.Form_Data, Submission_Status = 'submitted',
                 Submitted_At = CURRENT_TIMESTAMP, Verified_By = NULL, Verified_At = NULL`,
            [normalizedStudentId, '{}']
        );

        const savedDraft = mergeDraftData(authorizedStudent.draft_data, {
            'student-personal-info': studentData,
            completionStatus: { 'student-personal-info': true },
        });
        await client.query(
            'UPDATE Authorized_New_Student SET Draft_Data = $2::jsonb WHERE Registration_Number = $1',
            [normalizedStudentId, JSON.stringify(savedDraft)]
        );
        const completed = await completeRegistrationIfReady(client, normalizedStudentId);
        await client.query('COMMIT');
        if (completed) clearNewStudentSession(res);
        res.status(201).json({
            message: 'Student personal information saved successfully.',
            registration_number: normalizedStudentId,
            registration_completed: completed,
        });
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        console.error(err.message);
        res.status(err.status || 500).json({ error: err.status ? err.message : 'Unable to save student personal information.' });
    } finally {
        client.release();
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
