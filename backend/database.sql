-- Drop tables if they exist to recreate them with the new schema
DROP TABLE IF EXISTS Exam_Admission CASCADE;
DROP TABLE IF EXISTS Registration CASCADE;
DROP TABLE IF EXISTS Student CASCADE;
DROP TABLE IF EXISTS Administrator CASCADE;
DROP TABLE IF EXISTS Examination CASCADE;
DROP TABLE IF EXISTS Subject CASCADE;

-- Administrator Table
CREATE TABLE Administrator (
    Admin_Id SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role VARCHAR(50) NOT NULL
);

-- Student Table (Updated to match Frontend Form)
CREATE TABLE Student (
    Student_ID VARCHAR(50) PRIMARY KEY, -- Registration No
    NIC_No VARCHAR(20) UNIQUE NOT NULL,
    AL_Index_Year VARCHAR(50) NOT NULL,
    Course_Of_Study VARCHAR(100) NOT NULL,
    Name_With_Initials VARCHAR(100) NOT NULL,
    Full_Name VARCHAR(200) NOT NULL,
    Telephone_No VARCHAR(20) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Permanent_Address TEXT NOT NULL,
    Contact_Address TEXT,
    Grama_Niladhari VARCHAR(100),
    District VARCHAR(50) NOT NULL,
    Race VARCHAR(50),
    Religion VARCHAR(50),
    Gender VARCHAR(20) NOT NULL,
    Civil_Status VARCHAR(50),
    Citizenship VARCHAR(50),
    
    Guardian_Name VARCHAR(200) NOT NULL,
    Guardian_Occupation VARCHAR(100),
    Guardian_Work_Address TEXT,
    Guardian_Telephone VARCHAR(20),
    Guardian_Relationship VARCHAR(50),

    Emergency_Name VARCHAR(100) NOT NULL,
    Emergency_Telephone VARCHAR(20) NOT NULL,

    Password VARCHAR(255) NOT NULL -- For Login
);

-- Subject Table
CREATE TABLE Subject (
    Subject_Id SERIAL PRIMARY KEY,
    Subject_Code VARCHAR(20) UNIQUE NOT NULL,
    Subject_Name VARCHAR(100) NOT NULL,
    Credit_Value INT NOT NULL,
    Semester INT NOT NULL,
    Department VARCHAR(100)
);

-- Registration Table (Student registering for Subjects)
CREATE TABLE Registration (
    Registration_ID SERIAL PRIMARY KEY,
    Student_ID VARCHAR(50) REFERENCES Student(Student_ID) ON DELETE CASCADE,
    Subject_Id INT REFERENCES Subject(Subject_Id) ON DELETE CASCADE,
    Academic_Year VARCHAR(20) NOT NULL,
    Registration_Date DATE DEFAULT CURRENT_DATE,
    Status VARCHAR(50) NOT NULL
);

-- Examination Table
CREATE TABLE Examination (
    Exam_Id SERIAL PRIMARY KEY,
    Exam_Name VARCHAR(100) NOT NULL,
    Exam_Date DATE NOT NULL,
    Semester INT NOT NULL,
    Academic_Year VARCHAR(20) NOT NULL
);

-- Exam Admission Table (Student applying for exams)
CREATE TABLE Exam_Admission (
    Addmission_Id SERIAL PRIMARY KEY,
    Student_ID VARCHAR(50) REFERENCES Student(Student_ID) ON DELETE CASCADE,
    Exam_Id INT REFERENCES Examination(Exam_Id) ON DELETE CASCADE,
    Eligibility_Status VARCHAR(50) NOT NULL,
    Application_Date DATE DEFAULT CURRENT_DATE
);
