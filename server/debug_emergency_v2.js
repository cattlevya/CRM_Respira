const db = require('./config/db');
const fs = require('fs');

async function debugEmergencyV2() {
    try {
        let output = "--- DEBUGGING EMERGENCY COUNT V2 ---\n";

        // 1. Run the EXACT Expanded Query from index.js
        const query = `
            SELECT COUNT(DISTINCT user_id) as count 
            FROM diagnosis_logs 
            WHERE (
                final_result LIKE '%Bahaya%' OR 
                final_result LIKE '%Segera%' OR 
                final_result LIKE '%Gawat%' OR 
                final_result LIKE '%Darurat%' OR
                final_result LIKE '%Kritis%' OR
                final_result LIKE '%Eksaserbasi%' OR
                final_result LIKE '%Emboli%' OR
                final_result LIKE '%Pneumothorax%' OR
                final_result LIKE '%Cor Pulmonale%' OR
                final_result LIKE '%Gagal Jantung%' OR
                final_result LIKE '%Kanker%' OR
                final_result LIKE '%Pneumonia%' OR
                final_result LIKE '%Tuberkulosis%'
            )
            AND created_at >= NOW() - INTERVAL 24 HOUR
        `;

        const [emergencyCountRows] = await db.query(query);
        output += `\nQuery Result (Count): ${emergencyCountRows[0].count}\n`;

        // 2. Fetch the actual rows to see WHAT is being counted
        const [rows] = await db.query(`
            SELECT id, user_id, final_result, created_at 
            FROM diagnosis_logs 
            WHERE (
                final_result LIKE '%Bahaya%' OR 
                final_result LIKE '%Segera%' OR 
                final_result LIKE '%Gawat%' OR 
                final_result LIKE '%Darurat%' OR
                final_result LIKE '%Kritis%' OR
                final_result LIKE '%Eksaserbasi%' OR
                final_result LIKE '%Emboli%' OR
                final_result LIKE '%Pneumothorax%' OR
                final_result LIKE '%Cor Pulmonale%' OR
                final_result LIKE '%Gagal Jantung%' OR
                final_result LIKE '%Kanker%' OR
                final_result LIKE '%Pneumonia%' OR
                final_result LIKE '%Tuberkulosis%'
            )
            AND created_at >= NOW() - INTERVAL 24 HOUR
        `);

        output += "\nMatching Rows:\n";
        rows.forEach(r => {
            output += `[${r.created_at}] User ${r.user_id}: ${r.final_result}\n`;
        });

        fs.writeFileSync('server/debug_log_v2.txt', output);
        console.log("Debug log written to server/debug_log_v2.txt");

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

debugEmergencyV2();
