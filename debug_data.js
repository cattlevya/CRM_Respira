const db = require('./server/config/db');

async function checkData() {
    try {
        console.log("Checking diagnosis_logs table...");
        const [count] = await db.query('SELECT COUNT(*) as total FROM diagnosis_logs');
        console.log("Total records:", count[0].total);

        if (count[0].total > 0) {
            const [rows] = await db.query('SELECT * FROM diagnosis_logs LIMIT 5');
            console.log("Sample data:", rows);
        } else {
            console.log("Table is empty!");
        }

        console.log("\nChecking API Query Logic...");
        const [apiRows] = await db.query(`
            SELECT d.id, d.created_at, u.name as patient_name, d.final_result, d.confidence_score
            FROM diagnosis_logs d
            LEFT JOIN users u ON d.user_id = u.id
            ORDER BY d.created_at DESC
            LIMIT 5
        `);
        console.log("API Query Result:", apiRows);

    } catch (err) {
        console.error("Database Error:", err);
    }
    process.exit();
}

checkData();
