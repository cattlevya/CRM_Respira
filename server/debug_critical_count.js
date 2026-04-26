const db = require('./config/db');

async function debugCriticalCount() {
    try {
        console.log("--- Debugging Critical Patient Count ---");

        // 1. Count ALL logs
        const [totalRows] = await db.query('SELECT COUNT(*) as count FROM diagnosis_logs');
        console.log(`Total Diagnosis Logs: ${totalRows[0].count}`);

        // 2. Count distinct patients
        const [patientRows] = await db.query('SELECT COUNT(DISTINCT user_id) as count FROM diagnosis_logs');
        console.log(`Total Patients Diagnosed: ${patientRows[0].count}`);

        // 3. Count Critical (Last 24 Hours) - Current Logic
        const [critical24h] = await db.query(`
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
        `);
        console.log(`Critical Patients (Last 24h): ${critical24h[0].count}`);

        // 4. Count Critical (ALL TIME)
        const [criticalAllTime] = await db.query(`
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
        `);
        console.log(`Critical Patients (All Time): ${criticalAllTime[0].count}`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debugCriticalCount();
