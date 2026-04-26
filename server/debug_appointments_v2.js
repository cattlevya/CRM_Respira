const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'respira_db'
};

async function debugAppointmentsV2() {
    try {
        const connection = await mysql.createConnection(dbConfig);

        console.log("--- RAW USERS ---");
        const [users] = await connection.query("SELECT * FROM users");
        console.log(JSON.stringify(users, null, 2));

        console.log("\n--- RAW CONSULTATIONS ---");
        const [consultations] = await connection.query("SELECT * FROM consultations");
        console.log(JSON.stringify(consultations, null, 2));

        if (consultations.length > 0) {
            const first = consultations[0];
            console.log("\n--- TYPE CHECK ---");
            console.log(`Consultation doctor_id: ${first.doctor_id} (${typeof first.doctor_id})`);
            console.log(`Consultation user_id: ${first.user_id} (${typeof first.user_id})`);

            console.log("\n--- TEST QUERY ---");
            const query = `
                SELECT c.id, c.doctor_id, c.user_id
                FROM consultations c
                WHERE c.doctor_id = ?
            `;
            const [testRows] = await connection.query(query, [first.doctor_id]);
            console.log(`Query result count: ${testRows.length}`);
            console.log(JSON.stringify(testRows, null, 2));
        }

        process.exit();
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

debugAppointmentsV2();
