// One-time, non-destructive migration from the former staging table to the
// dedicated per-form tables. Run with: node migrations/migrate_staged_new_student_forms.js
const bcrypt = require('bcrypt');
const pool = require('../db');
const { saveDedicatedForm } = require('../newStudentFormTablePersistence');

async function saveStudent(client, registrationNumber, data) {
    const required = ['nic_no', 'al_index_year', 'course_of_study', 'name_with_initials', 'full_name', 'telephone_no', 'email', 'permanent_address', 'district', 'gender', 'guardian_name', 'emergency_name', 'emergency_telephone'];
    if (required.some(key => typeof data[key] !== 'string' || !data[key].trim())) return false;
    const password = await bcrypt.hash(`pending:${registrationNumber}:${data.nic_no.trim()}`, 10);
    await client.query(
        `INSERT INTO Student (Student_ID,NIC_No,AL_Index_Year,Course_Of_Study,Name_With_Initials,Full_Name,Telephone_No,Email,Permanent_Address,Contact_Address,Grama_Niladhari,District,Race,Religion,Gender,Civil_Status,Citizenship,Guardian_Name,Guardian_Occupation,Guardian_Work_Address,Guardian_Telephone,Guardian_Relationship,Emergency_Name,Emergency_Telephone,Password)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
         ON CONFLICT (Student_ID) DO NOTHING`,
        [registrationNumber,data.nic_no.trim(),data.al_index_year.trim(),data.course_of_study.trim(),data.name_with_initials.trim(),data.full_name.trim(),data.telephone_no.trim(),data.email.trim(),data.permanent_address.trim(),data.contact_address||null,data.grama_niladhari||null,data.district.trim(),data.race||null,data.religion||null,data.gender.trim(),data.civil_status||null,data.citizenship||null,data.guardian_name.trim(),data.guardian_occupation||null,data.guardian_work_address||null,data.guardian_telephone||null,data.guardian_relationship||null,data.emergency_name.trim(),data.emergency_telephone.trim(),password]
    );
    return true;
}

async function main() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const staged = await client.query(`SELECT Registration_Number, Form_Key, Form_Data FROM New_Student_Form_Submission WHERE Submission_Status = 'submitted' ORDER BY Registration_Number, Form_Key`);
        const byStudent = new Map();
        for (const row of staged.rows) {
            const forms = byStudent.get(row.registration_number) || new Map();
            forms.set(row.form_key, row.form_data);
            byStudent.set(row.registration_number, forms);
        }
        const migrated = [];
        const skipped = [];
        for (const [registrationNumber, forms] of byStudent) {
            if (!(await saveStudent(client, registrationNumber, forms.get('student-personal-info') || {}))) {
                skipped.push(`${registrationNumber}: no complete personal-information staging record`);
                continue;
            }
            for (const formKey of ['identity-card', 'residentials', 'sports', 'skill', 'medical']) {
                const formData = forms.get(formKey);
                if (!formData || Object.keys(formData).length === 0) continue;
                const attachmentResult = await client.query('SELECT Field_Name, File_Name, Mime_Type, File_Data FROM New_Student_Form_Attachment WHERE Registration_Number=$1 AND Form_Key=$2', [registrationNumber, formKey]);
                const attachments = attachmentResult.rows.map(row => ({ fieldName: row.field_name, fileName: row.file_name, mimeType: row.mime_type, fileData: row.file_data }));
                await saveDedicatedForm(client, registrationNumber, formKey, formData, attachments);
                migrated.push(`${registrationNumber}: ${formKey}`);
            }
        }
        await client.query('COMMIT');
        console.log(JSON.stringify({ migrated, skipped }, null, 2));
    } catch (error) {
        await client.query('ROLLBACK').catch(() => {});
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch(error => { console.error(error.message); process.exit(1); });
