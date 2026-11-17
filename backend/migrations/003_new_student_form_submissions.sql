CREATE TABLE IF NOT EXISTS New_Student_Form_Submission (
    Registration_Number VARCHAR(50) NOT NULL REFERENCES Authorized_New_Student(Registration_Number) ON DELETE CASCADE,
    Form_Key VARCHAR(40) NOT NULL CHECK (Form_Key IN ('identity-card', 'residentials', 'sports', 'skill', 'medical')),
    Form_Data JSONB NOT NULL DEFAULT '{}'::jsonb,
    Submitted_At TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Registration_Number, Form_Key)
);

CREATE TABLE IF NOT EXISTS New_Student_Form_Attachment (
    Registration_Number VARCHAR(50) NOT NULL,
    Form_Key VARCHAR(40) NOT NULL,
    Field_Name VARCHAR(40) NOT NULL,
    File_Name VARCHAR(255) NOT NULL,
    Mime_Type VARCHAR(100) NOT NULL,
    File_Data BYTEA NOT NULL,
    Uploaded_At TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Registration_Number, Form_Key, Field_Name),
    FOREIGN KEY (Registration_Number, Form_Key)
        REFERENCES New_Student_Form_Submission(Registration_Number, Form_Key)
        ON DELETE CASCADE
);