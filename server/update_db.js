const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // Default XAMPP password
    database: 'respira_db',
    multipleStatements: true // Allow multiple SQL statements
};

async function updateDatabase() {
    try {
        console.log("Connecting to database...");
        const connection = await mysql.createConnection(dbConfig);
        console.log("Connected.");

        // Read SQL file
        const sqlPath = path.join(__dirname, '../database_update.sql');
        console.log(`Reading SQL from: ${sqlPath}`);

        if (!fs.existsSync(sqlPath)) {
            throw new Error("database_update.sql not found!");
        }

        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Execute SQL
        console.log("Executing SQL updates...");
        await connection.query(sql);

        console.log("Database updated successfully!");
        console.log("New tables created: symptoms, diseases, research_drafts, diagnosis_rules");

        await connection.end();
        process.exit();

    } catch (err) {
        console.error("Error updating database:", err);
        process.exit(1);
    }
}

updateDatabase();
