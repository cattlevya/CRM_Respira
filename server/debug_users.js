const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'respira_db'
};

async function debugUsers() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [users] = await connection.query("SELECT id, name, role FROM users");
        console.log(JSON.stringify(users, null, 2));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debugUsers();
