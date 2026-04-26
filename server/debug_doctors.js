const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'respira_db'
};

async function debugDoctors() {
    try {
        // 1. Check Database
        console.log("--- Checking Database ---");
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query("SELECT id, name, email, role FROM users WHERE role = 'expert'");
        console.log(`Found ${rows.length} expert(s) in DB:`);
        console.table(rows);
        await connection.end();

        // 2. Check API
        console.log("\n--- Checking API ---");
        try {
            const response = await fetch('http://localhost:5000/api/doctors');
            const data = await response.json();
            console.log("API Response Status:", response.status);
            console.log("API Response Data:", JSON.stringify(data, null, 2));
        } catch (err) {
            console.error("API Fetch Error:", err.message);
        }

    } catch (err) {
        console.error("Database Error:", err);
    }
}

debugDoctors();
