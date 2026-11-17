const FORM_TABLES = {
    residentials: 'Residential_Applications',
    sports: 'Physical_Attribute_Applications',
    skill: 'Special_Skills_Applications',
    medical: 'Medical_Examinations',
};

async function saveDedicatedForm(client, registrationNumber, formKey, formData, attachments = []) {
    if (formKey === 'identity-card') {
        const files = Object.fromEntries(attachments.map(file => [file.fieldName, file]));
        await client.query(
            `INSERT INTO Identity_Card_Application (
                Registration_No, Admission_Year, NIC_No, Course, Full_Name_EN, Title,
                Full_Name_Local, Telephone, Email, Perm_Address_EN, Perm_Address_Local,
                Photo, Photo_Mime_Type, Signature, Signature_Mime_Type, Status, Student_ID
             ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'submitted',$16)
             ON CONFLICT (Registration_No) DO UPDATE SET
                Admission_Year=EXCLUDED.Admission_Year, NIC_No=EXCLUDED.NIC_No, Course=EXCLUDED.Course,
                Full_Name_EN=EXCLUDED.Full_Name_EN, Title=EXCLUDED.Title, Full_Name_Local=EXCLUDED.Full_Name_Local,
                Telephone=EXCLUDED.Telephone, Email=EXCLUDED.Email, Perm_Address_EN=EXCLUDED.Perm_Address_EN,
                Perm_Address_Local=EXCLUDED.Perm_Address_Local, Photo=EXCLUDED.Photo,
                Photo_Mime_Type=EXCLUDED.Photo_Mime_Type, Signature=EXCLUDED.Signature,
                Signature_Mime_Type=EXCLUDED.Signature_Mime_Type, Status='submitted',
                Submitted_At=CURRENT_TIMESTAMP, Student_ID=EXCLUDED.Student_ID`,
            [registrationNumber, formData.admission_year, formData.nic_no, formData.course, formData.full_name_en,
                formData.title, formData.full_name_local || null, formData.telephone, formData.email,
                formData.perm_address_en, formData.perm_address_local || null, files.photo?.fileData || null,
                files.photo?.mimeType || null, files.signature?.fileData || null, files.signature?.mimeType || null,
                registrationNumber]
        );
        return;
    }

    const table = FORM_TABLES[formKey];
    if (!table) throw new Error('No dedicated table is configured for this registration form.');
    await client.query(
        `INSERT INTO ${table} (Student_ID, Payload, Status)
         VALUES ($1, $2::jsonb, 'submitted')
         ON CONFLICT (Student_ID) DO UPDATE SET Payload=EXCLUDED.Payload, Status='submitted', Updated_At=CURRENT_TIMESTAMP`,
        [registrationNumber, JSON.stringify(formData)]
    );
}

async function saveOfflineVerification(client, registrationNumber, formKey) {
    const table = formKey === 'bursary' ? 'Bursary_Applications' : 'Mahapola_Applications';
    await client.query(
        `INSERT INTO ${table} (Student_ID, Payload, Status)
         VALUES ($1, '{}'::jsonb, 'staff_verified')
         ON CONFLICT (Student_ID) DO UPDATE SET Status='staff_verified', Updated_At=CURRENT_TIMESTAMP`,
        [registrationNumber]
    );
}

module.exports = { saveDedicatedForm, saveOfflineVerification };
