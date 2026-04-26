const db = require('./config/db');

async function updateSchema() {
    try {
        console.log("Adding last_active_at column to users table...");

        // Check if column exists first to avoid error
        const [columns] = await db.query("SHOW COLUMNS FROM users LIKE 'last_active_at'");

        if (columns.length === 0) {
            await db.query("ALTER TABLE users ADD COLUMN last_active_at DATETIME DEFAULT NULL");
            console.log("Column last_active_at added successfully.");
        } else {
            console.log("Column last_active_at already exists.");
        }

        // Set initial value for existing users to NOW() so they aren't "offline forever" initially
        await db.query("UPDATE users SET last_active_at = NOW() WHERE last_active_at IS NULL");
        console.log("Initialized last_active_at for existing users.");

        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

updateSchema();
