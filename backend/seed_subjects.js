const pool = require('./db.js');
require('dotenv').config();

const subjects = [
  [1, 1, 'ICT 1202', 'Electronic Circuits', 2, 'C'],
  [1, 1, 'ICT 1305', 'Program Designing and Programming', 3, 'C'],
  [1, 1, 'ICT 1111', 'Productivity and Collaborative Tools', 1, 'C'],
  [1, 1, 'CMT 1301', 'Fundamentals of Physics for Technology', 3, 'C'],
  [1, 1, 'CMT 1303', 'Fundamentals of Mathematics for Technology', 3, 'C'],
  [1, 1, 'CML 1301', 'Personality Development', 3, 'C'],
  [1, 1, 'CMT 1005', 'Communication Skills I', 0, 'C-NGPA'],
  [1, 2, 'ICT 1210', 'Introduction to Multimedia', 2, 'C'],
  [1, 2, 'ICT 1108', 'Skill Development Project I', 1, 'C'],
  [1, 2, 'ICT 1209', 'Web Technologies', 2, 'C'],
  [1, 2, 'ICT 1207', 'Human Computer Interaction', 2, 'C'],
  [1, 2, 'CML 1203', 'Principles of Management', 2, 'C'],
  [1, 2, 'CML 1204', 'Health and Wellbeing', 2, 'C'],
  [1, 2, 'CMT 1009', 'Communication Skills II', 0, 'C-NGPA'],
  [1, 2, 'CMT 1307', 'Mathematics For Technology I', 3, 'C'],
  [1, 2, 'ENT 1302', 'Fundamentals of Electricity and Magnetism', 3, 'O'],
  [2, 1, 'ICT 2202', 'Operating Systems', 2, 'C'],
  [2, 1, 'ICT 2303', 'Data Structures and Algorithms', 3, 'C'],
  [2, 1, 'ICT 2304', 'Object Oriented Programming', 3, 'C'],
  [2, 1, 'ICT 2207', 'Software System Design', 2, 'C'],
  [2, 1, 'ICT 2212', 'Skill Development Project II', 2, 'C'],
  [2, 1, 'CML 2202', 'Engineering Economics', 2, 'C'],
  [2, 1, 'CMT 2002', 'Communication Skills III', 0, 'C-NGPA'],
  [2, 1, 'EET 2207', 'Mathematics for Technology II', 2, 'O'],
  [2, 2, 'ICT 2305', 'Computational Mathematics', 3, 'C'],
  [2, 2, 'ICT 2214', 'Introduction to Information Systems', 2, 'C'],
  [2, 2, 'ICT 2211', 'Fundamentals of Statistics', 2, 'C'],
  [2, 2, 'ICT 2213', 'Data Communication and Networking', 2, 'C'],
  [2, 2, 'ICT 2308', 'Database Systems', 3, 'C'],
  [2, 2, 'ICT 2109', 'Communication and Learning Skills', 1, 'C'],
  [2, 2, 'CML 2204', 'Foreign Language', 2, 'C'],
  [2, 2, 'CML 2205', 'Ethics for Science and Technology', 2, 'O'],
  [3, 1, 'ICT 3201', 'Software Project Management', 2, 'C'],
  [3, 1, 'ICT 3203', 'Scientific Computer Applications', 2, 'C'],
  [3, 1, 'CML 3101', 'Legal and Patent Aspects', 1, 'C'],
  [3, 1, 'ICT 3312', 'Software Verification and Validation', 3, 'C'],
  [3, 1, 'ICT 3206', 'Skills Development Project III', 2, 'C'],
  [3, 1, 'ICT 3314', 'Advanced Computer Networks', 3, 'C'],
  [3, 1, 'ICT 3208', 'Design and Analysis of Algorithms', 2, 'C'],
  [3, 1, 'ICT 3307', 'Computational Statistics', 3, 'O'],
  [3, 1, 'ICT 3217', 'Advance Computer Networks', 2, 'O'],
  [3, 2, 'ICT 3209', 'Computer Organization and Architecture', 2, 'C'],
  [3, 2, 'ICT 3310', 'Information Security', 3, 'C'],
  [3, 2, 'ICT 3311', 'Robotics', 3, 'O'],
  [3, 2, 'ICT 3315', 'Internet of Things', 3, 'O'],
  [3, 2, 'ICT 3213', 'Advanced SW System Design', 2, 'C'],
  [3, 2, 'ICT 3216', 'Research Methodology', 2, 'C'],
  [3, 2, 'ICT 3204', 'E-Business Systems', 2, 'C'],
  [3, 2, 'CML 3203', 'Basics of Accountancy', 2, 'C'],
  [4, 1, 'ICT 4301', 'Mobile Computing', 3, 'C'],
  [4, 1, 'ICT 4202', 'Internet Applications', 2, 'C'],
  [4, 1, 'ICT 4203', 'Software Engineering', 2, 'C'],
  [4, 1, 'ICT 4205', 'Current Topics in Information Technology', 2, 'C'],
  [4, 1, 'ICT 4306', 'Data Science', 3, 'O'],
  [4, 1, 'ICT 4207', 'Artificial Intelligence', 2, 'O'],
  [4, 1, 'ICT 4210', 'Digital Image Processing', 2, 'O'],
  [4, 1, 'ICT 4211', 'Computer Graphics and Visualization', 2, 'O'],
  [4, 1, 'CML 4201', 'Entrepreneurship', 2, 'C'],
  [4, 1, 'CML 4202', 'Human Resource Management', 2, 'O'],
  [4, 2, 'ICT 4608', 'Research Project', 6, 'C'],
  [4, 2, 'ICT 4609', 'Industrial Training', 6, 'C']
];

async function seed() {
  try {
    // Clear existing B.ICT subjects to avoid duplicates if run multiple times
    await pool.query("DELETE FROM Subject WHERE Department = 'B.ICT'");

    for (const sub of subjects) {
      const [year, sem, code, title, credits, status] = sub;
      await pool.query(
        'INSERT INTO Subject (Subject_Code, Subject_Name, Credit_Value, Semester, Academic_Year, Course_Status, Department) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [code, title, credits, sem, year, status, 'B.ICT']
      );
    }
    console.log('Successfully seeded B.ICT subjects');
  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    process.exit(0);
  }
}

seed();
