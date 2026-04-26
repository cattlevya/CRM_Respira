const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'respira_db'
};

async function fixAppointments() {
    try {
        const connection = await mysql.createConnection(dbConfig);

        // Get Dr. Sarah's ID
        const [experts] = await connection.query("SELECT id FROM users WHERE name LIKE '%Sarah%' AND role = 'expert' LIMIT 1");

        if (experts.length === 0) {
            console.log("Dr. Sarah not found.");
            process.exit(1);
        }

        const doctorId = experts[0].id;
        console.log(`Reassigning all consultations to Doctor ID: ${doctorId} (Dr. Sarah)`);

        const [result] = await connection.query("UPDATE consultations SET doctor_id = ?", [doctorId]);
        console.log(`Updated ${result.changedRows} consultation(s).`);

        process.exit();
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

fixAppointments();
