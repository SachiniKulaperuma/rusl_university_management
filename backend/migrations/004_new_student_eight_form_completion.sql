ALTER TABLE New_Student_Form_Submission
    DROP CONSTRAINT IF EXISTS new_student_form_submission_form_key_check;

ALTER TABLE New_Student_Form_Submission
    ADD CONSTRAINT new_student_form_submission_form_key_check
    CHECK (Form_Key IN (
        'student-personal-info', 'identity-card', 'residentials', 'sports',
        'skill', 'bursary', 'mahapola', 'medical'
    ));

ALTER TABLE New_Student_Form_Submission
    ADD COLUMN IF NOT EXISTS Submission_Status VARCHAR(32) NOT NULL DEFAULT 'submitted';

ALTER TABLE New_Student_Form_Submission
    ADD COLUMN IF NOT EXISTS Verified_By INTEGER REFERENCES Administrator(Admin_Id);

ALTER TABLE New_Student_Form_Submission
    ADD COLUMN IF NOT EXISTS Verified_At TIMESTAMPTZ;

ALTER TABLE New_Student_Form_Submission
    DROP CONSTRAINT IF EXISTS new_student_form_submission_status_check;

ALTER TABLE New_Student_Form_Submission
    ADD CONSTRAINT new_student_form_submission_status_check
    CHECK (Submission_Status IN ('submitted', 'pending_staff_verification', 'staff_verified'));