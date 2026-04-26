const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'respira_db'
};

async function debugTime() {
    try {
        const connection = await mysql.createConnection(dbConfig);

        // 1. Get a Patient & Doctor
        const [patients] = await connection.query("SELECT id FROM users WHERE role = 'patient' LIMIT 1");
        const [experts] = await connection.query("SELECT id FROM users WHERE role = 'expert' LIMIT 1");

        if (!patients.length || !experts.length) {
            console.log("Need patient and expert.");
            process.exit();
        }

        const patientId = patients[0].id;
        const doctorId = experts[0].id;

        // 2. Insert with a specific string "2025-12-05T10:00" (10 AM)
        const inputTime = "2025-12-05T10:00";
        console.log(`Inserting time string: ${inputTime}`);

        const [res] = await connection.query(
            'INSERT INTO consultations (user_id, doctor_id, requested_date, notes, status) VALUES (?, ?, ?, ?, ?)',
            [patientId, doctorId, inputTime, 'Time Debug', 'pending']
        );
        const apptId = res.insertId;

        // 3. Fetch it back
        const [rows] = await connection.query(`SELECT requested_date FROM consultations WHERE id = ?`, [apptId]);
        const fetchedDate = rows[0].requested_date;

        console.log("Fetched Raw Value:", fetchedDate);
        console.log("Fetched Type:", typeof fetchedDate);
        if (fetchedDate instanceof Date) {
            console.log("Fetched .toISOString():", fetchedDate.toISOString());
            console.log("Fetched .toString():", fetchedDate.toString());
        }

        // 4. Clean up
        await connection.query('DELETE FROM consultations WHERE id = ?', [apptId]);
        process.exit();
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

debugTime();
