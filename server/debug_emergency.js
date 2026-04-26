const db = require('./config/db');

const fs = require('fs');

async function debugEmergency() {
    try {
        let output = "--- DEBUGGING EMERGENCY COUNT ---\n";

        // 1. Fetch Recent Logs (Raw)
        const [recentLogs] = await db.query(`
            SELECT id, user_id, final_result, created_at 
            FROM diagnosis_logs 
            ORDER BY created_at DESC 
            LIMIT 10
        `);
        output += "\n1. Recent Logs (Last 10):\n";
        recentLogs.forEach(log => {
            output += `[${log.created_at}] User ${log.user_id}: ${log.final_result}\n`;
        });

        // 2. Run the Emergency Query
        const [emergencyCountRows] = await db.query(`
            SELECT COUNT(DISTINCT user_id) as count 
            FROM diagnosis_logs 
            WHERE (
                final_result LIKE '%Bahaya%' OR 
                final_result LIKE '%Segera%' OR 
                final_result LIKE '%Gawat%' OR 
                final_result LIKE '%Darurat%' OR
                final_result LIKE '%Kritis%' OR
                final_result LIKE '%Eksaserbasi%'
            )
            AND created_at >= NOW() - INTERVAL 24 HOUR
        `);
        output += `\n2. Query Result (Count): ${emergencyCountRows[0].count}\n`;

        // 3. Check Timezone
        const [timeCheck] = await db.query("SELECT NOW() as db_time, @@global.time_zone as global_tz, @@session.time_zone as session_tz");
        output += `\n3. DB Time Check: ${JSON.stringify(timeCheck[0])}\n`;

        fs.writeFileSync('server/debug_log.txt', output);
        console.log("Debug log written to server/debug_log.txt");

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

debugEmergency();
