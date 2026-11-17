ALTER TABLE Exam_Registration_Settings
    ADD COLUMN IF NOT EXISTS Academic_Year VARCHAR(20),
    ADD COLUMN IF NOT EXISTS Semester INTEGER,
    ADD COLUMN IF NOT EXISTS Semester_Start_Date DATE,
    ADD COLUMN IF NOT EXISTS Semester_End_Date DATE;

ALTER TABLE Exam_Registrations
    ADD COLUMN IF NOT EXISTS Rejection_Reason TEXT,
    ADD COLUMN IF NOT EXISTS Reviewed_By INTEGER REFERENCES Administrator(Admin_Id),
    ADD COLUMN IF NOT EXISTS Reviewed_At TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS Semester_Exam_Admission_Settings (
    Setting_Id SERIAL PRIMARY KEY,
    Academic_Year VARCHAR(20) NOT NULL,
    Semester INTEGER NOT NULL CHECK (Semester IN (1, 2)),
    Semester_Start_Date DATE NOT NULL,
    Semester_End_Date DATE NOT NULL,
    Deadline DATE NOT NULL,
    Updated_At TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (Semester_Start_Date <= Semester_End_Date),
    UNIQUE (Academic_Year, Semester)
);

CREATE UNIQUE INDEX IF NOT EXISTS exam_registration_student_period_idx
    ON Exam_Registrations (LOWER(Student_ID), Academic_Year, Semester);

CREATE INDEX IF NOT EXISTS exam_registration_status_period_idx
    ON Exam_Registrations (Status, Academic_Year, Semester);

CREATE TABLE IF NOT EXISTS Exam_Registration_Status_History (
    History_Id BIGSERIAL PRIMARY KEY,
    Exam_Registration_Id BIGINT NOT NULL REFERENCES Exam_Registrations(Exam_Registration_Id) ON DELETE CASCADE,
    Status VARCHAR(20) NOT NULL CHECK (Status IN ('Pending', 'Approved', 'Rejected')),
    Reason TEXT,
    Changed_By INTEGER REFERENCES Administrator(Admin_Id),
    Changed_At TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
