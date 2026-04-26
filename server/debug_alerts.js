const db = require('./config/db');

async function debugAlerts() {
    try {
        console.log("Testing Alert Logic...");
        const alerts = [];

        // A. Critical Alerts
        const [criticalLogs] = await db.query(`
            SELECT d.final_result, u.name 
            FROM diagnosis_logs d
            JOIN users u ON d.user_id = u.id
            WHERE (d.final_result LIKE '%Bahaya%' OR d.final_result LIKE '%Segera%')
            AND d.created_at >= NOW() - INTERVAL 24 HOUR
            LIMIT 3
        `);
        console.log(`Found ${criticalLogs.length} Critical Logs`);
        criticalLogs.forEach(l => console.log(`- Critical: ${l.name} -> ${l.final_result}`));

        // B. Novelty Detection
        const [novelLogs] = await db.query(`
            SELECT d1.final_result, d1.created_at, u.name
            FROM diagnosis_logs d1
            JOIN users u ON d1.user_id = u.id
            WHERE d1.created_at >= NOW() - INTERVAL 24 HOUR
            AND NOT EXISTS (
                SELECT 1 FROM diagnosis_logs d2 
                WHERE d2.final_result = d1.final_result 
                AND d2.created_at < d1.created_at
            )
            LIMIT 3
        `);
        console.log(`Found ${novelLogs.length} Novel Logs`);
        novelLogs.forEach(l => console.log(`- Novel: ${l.name} -> ${l.final_result}`));

        process.exit(0);
    } catch (err) {
        console.error("DB Error:", err);
        process.exit(1);
    }
}

debugAlerts();
