const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'respira_db'
};

async function ensureDoctor() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Connected to database.");

        const [rows] = await connection.query("SELECT * FROM users WHERE role = 'expert'");

        if (rows.length === 0) {
            console.log("No expert found. Creating default expert...");
            await connection.query(`
                INSERT INTO users(name, email, password, role, license_code, title_degree, institution, sip_number) 
                VALUES ('Dr. Sarah Sp.P', 'admin@respira.id', 'admin', 'expert', 'DOKTER123', 'Sp.P', 'RS Paru Dr. Rotinsulu', 'SIP.123.456')
            `);
            console.log("Default expert created.");
        } else {
            console.log(`Found ${rows.length} expert(s).`);
            // Update existing expert with profile info if missing
            const expert = rows[0];
            if (!expert.title_degree || !expert.institution) {
                console.log("Updating expert profile info...");
                await connection.query(`
                    UPDATE users 
                    SET title_degree = COALESCE(title_degree, 'Sp.P'), 
                        institution = COALESCE(institution, 'RS Umum'),
                        sip_number = COALESCE(sip_number, 'SIP.DEFAULT')
                    WHERE id = ?
                 `, [expert.id]);
                console.log("Expert profile updated.");
            }
        }

        process.exit();
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

ensureDoctor();
