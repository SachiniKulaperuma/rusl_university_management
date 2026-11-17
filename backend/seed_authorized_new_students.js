const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const pool = require('./db');

async function seedAuthorizedStudents() {
    const migrationsDirectory = path.join(__dirname, 'migrations');
    const migrations = fs.readdirSync(migrationsDirectory)
        .filter(fileName => fileName.endsWith('.sql'))
        .sort();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        for (const migrationName of migrations) {
            const migration = fs.readFileSync(path.join(migrationsDirectory, migrationName), 'utf8');
            await client.query(migration);
        }

        const previousDummyIds = Array.from({ length: 50 }, (_, index) =>
            `ITT/2099/${String(index + 1).padStart(3, '0')}`
        );
        await client.query(
            `DELETE FROM Authorized_New_Student AS authorized
             WHERE Registration_Number = ANY($1::varchar[])
               AND NOT EXISTS (
                   SELECT 1 FROM Student WHERE Student_ID = authorized.Registration_Number
               )`,
            [previousDummyIds]
        );

        const cohorts = [
            { year: 2023, count: 13 },
            { year: 2024, count: 13 },
            { year: 2025, count: 12 },
            { year: 2026, count: 12 },
        ];
        let passwordNumber = 0;
        let availableAccounts = 0;
        let alreadyRegistered = 0;

        for (const cohort of cohorts) {
            for (let number = 1; number <= cohort.count; number += 1) {
                passwordNumber += 1;
                const registrationNumber = `ITT/${cohort.year}/${String(number).padStart(3, '0')}`;
                const assignedPassword = `RUSL@Test-${String(passwordNumber).padStart(3, '0')}`;
                const passwordHash = await bcrypt.hash(assignedPassword, 12);
                const existingStudent = await client.query(
                    'SELECT 1 FROM Student WHERE Student_ID = $1',
                    [registrationNumber]
                );
                const isAlreadyRegistered = existingStudent.rowCount > 0;

                await client.query(
                    `INSERT INTO Authorized_New_Student (
                         Registration_Number, Password_Hash, Is_Active, Registration_Completed, Completed_At
                     ) VALUES ($1, $2, $3, $4, CASE WHEN $4 THEN CURRENT_TIMESTAMP ELSE NULL END)
                     ON CONFLICT (Registration_Number) DO UPDATE SET
                         Password_Hash = EXCLUDED.Password_Hash,
                         Is_Active = EXCLUDED.Is_Active,
                         Registration_Completed = EXCLUDED.Registration_Completed,
                         Completed_At = EXCLUDED.Completed_At`,
                    [registrationNumber, passwordHash, !isAlreadyRegistered, isAlreadyRegistered]
                );

                if (isAlreadyRegistered) alreadyRegistered += 1;
                else availableAccounts += 1;
            }
        }

        await client.query('COMMIT');
        console.log(`Seeded 50 authorized test accounts with bcrypt hashes. Available: ${availableAccounts}; already registered and disabled: ${alreadyRegistered}.`);
    } catch (error) {
        await client.query('ROLLBACK').catch(() => {});
        throw error;
    } finally {
        client.release();
    }
}

seedAuthorizedStudents()
    .catch(error => {
        console.error('Unable to seed authorized new students:', error.message);
        process.exitCode = 1;
    })
    .finally(() => pool.end());