const db = require('./config/db');

async function debug() {
    try {
        console.log("Testing DB Connection...");
        const [users] = await db.query('SELECT COUNT(*) as count FROM users');
        console.log("Total Users in DB:", users[0].count);

        const [logs] = await db.query('SELECT COUNT(*) as count FROM diagnosis_logs');
        console.log("Total Diagnosis Logs in DB:", logs[0].count);

        process.exit(0);
    } catch (err) {
        console.error("DB Error:", err);
        process.exit(1);
    }
}

debug();
