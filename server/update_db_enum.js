const db = require('./config/db');

async function updateEnum() {
    try {
        console.log('--- UPDATING ENUM ---');
        await db.query("ALTER TABLE consultations MODIFY COLUMN status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending'");
        console.log('ENUM updated successfully.');
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        process.exit();
    }
}

updateEnum();
