const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'respira_db'
};

async function debugAppointments() {
    try {
        const connection = await mysql.createConnection(dbConfig);

        console.log("\n--- USERS ---");
        const [users] = await connection.query("SELECT id, name, email, role FROM users");
        console.table(users);

        console.log("\n--- CONSULTATIONS ---");
        const [consultations] = await connection.query("SELECT id, user_id, doctor_id, requested_date, status FROM consultations");
        console.table(consultations);

        if (consultations.length > 0) {
            const doctorId = consultations[0].doctor_id;
            console.log(`\nChecking appointments for Doctor ID: ${doctorId}`);
            const [rows] = await connection.query(`
                SELECT c.id, u.name as patient_name 
                FROM consultations c
                JOIN users u ON c.user_id = u.id
                WHERE c.doctor_id = ?
            `, [doctorId]);
            console.log(`Found ${rows.length} appointment(s) for this doctor.`);
        } else {
            console.log("\nNo consultations found in DB.");
        }

        process.exit();
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

debugAppointments();
