const bcrypt = require('bcrypt');
const pool = require('./db');

async function updatePass() {
  const hashed = await bcrypt.hash('password123', 10);
  await pool.query('UPDATE student SET password = $1 WHERE email = $2', [hashed, 'itt2023075@tec.rjt.ac.lk']);
  console.log('Password reset to password123');
  process.exit();
}

updatePass();
