const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'respira_db'
};

async function verifyEnhancements() {
    try {
        const connection = await mysql.createConnection(dbConfig);

        // 1. Get Dr. Sarah's ID
        const [experts] = await connection.query("SELECT id FROM users WHERE name LIKE '%Sarah%' AND role = 'expert' LIMIT 1");
        if (experts.length === 0) {
            console.log("Dr. Sarah not found.");
            process.exit(1);
        }
        const doctorId = experts[0].id;

        // 2. Check Expert Appointments API Logic
        console.log(`\n--- Checking Expert Appointments for Doctor ID: ${doctorId} ---`);
        const [rows] = await connection.query(`
            SELECT c.id, u.name as patient_name, d.final_result as diagnosis_result, d.confidence_score
            FROM consultations c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN diagnosis_logs d ON c.diagnosis_log_id = d.id
            WHERE c.doctor_id = ?
        `, [doctorId]);

        if (rows.length > 0) {
            console.log("Found appointments:");
            console.table(rows);
            if (rows[0].diagnosis_result) {
                console.log("SUCCESS: Diagnosis result is present.");
            } else {
                console.log("WARNING: Diagnosis result is NULL (maybe old data or no diagnosis linked).");
            }
        } else {
            console.log("No appointments found for Dr. Sarah.");
        }

        process.exit();
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

verifyEnhancements();
