ALTER TABLE Registration
    ALTER COLUMN Registration_Date TYPE TIMESTAMPTZ
    USING Registration_Date::timestamp AT TIME ZONE 'Asia/Colombo';

ALTER TABLE Registration
    ALTER COLUMN Registration_Date SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE Registration
    ADD COLUMN IF NOT EXISTS Dropped_At TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS registration_student_status_idx
    ON Registration (Student_ID, Status);
