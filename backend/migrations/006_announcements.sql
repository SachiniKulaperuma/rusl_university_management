CREATE TABLE IF NOT EXISTS Announcement (
    Announcement_Id SERIAL PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Description TEXT NOT NULL,
    Publication_Date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(20) NOT NULL DEFAULT 'Published'
        CHECK (Status IN ('Published', 'Unpublished')),
    Admin_Id INTEGER NOT NULL REFERENCES Administrator(Admin_Id),
    Updated_At TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS announcement_publication_idx
    ON Announcement (Status, Publication_Date DESC);
