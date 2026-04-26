const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'respira_db'
};

async function debugExperts() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [experts] = await connection.query("SELECT id, name, role FROM users WHERE role = 'expert'");
        console.log("--- EXPERTS ---");
        console.log(JSON.stringify(experts, null, 2));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debugExperts();
