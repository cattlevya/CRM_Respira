const db = require('./config/db');

async function checkSchema() {
    try {
        console.log('--- CHECKING SCHEMA ---');
        const [rows] = await db.query('SHOW CREATE TABLE consultations');
        console.log(rows[0]['Create Table']);
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        process.exit();
    }
}

checkSchema();
