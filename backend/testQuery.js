const pool = require('./db');
async function test() {
  const reg = await pool.query('SELECT r.Registration_ID, s.Subject_Code, s.Subject_Name, s.Credit_Value, r.Academic_Year, r.Status FROM Registration r JOIN Subject s ON r.Subject_Id = s.Subject_Id WHERE r.Student_ID = $1', ['ITT/2023/075']);
  console.log(reg.rows);
  process.exit();
}
test();
