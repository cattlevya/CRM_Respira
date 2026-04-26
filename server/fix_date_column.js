const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'respira_db'
};

async function fixColumn() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Connected to database.");

        await connection.query(`
            ALTER TABLE consultations 
            MODIFY COLUMN requested_date DATETIME;
        `);

        console.log("Successfully altered 'requested_date' column to DATETIME.");
        process.exit(0);
    } catch (error) {
        console.error("Error updating database:", error);
        process.exit(1);
    }
}

fixColumn();
