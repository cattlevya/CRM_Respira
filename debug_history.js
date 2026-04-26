const db = require('./server/config/db');

async function testQuery() {
    try {
        console.log("Testing History Query (LEFT JOIN)...");
        const [rows] = await db.query(`
            SELECT d.id, d.created_at, u.name as patient_name, d.final_result, d.confidence_score
            FROM diagnosis_logs d
            LEFT JOIN users u ON d.user_id = u.id
            ORDER BY d.created_at DESC
        `);
        console.log("Success! Rows:", rows.length);
        if (rows.length > 0) console.log("First Row:", rows[0]);
    } catch (err) {
        console.error("Query Failed:", err);
    }
    process.exit();
}

testQuery();
