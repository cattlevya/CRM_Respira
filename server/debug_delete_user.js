const db = require('./config/db');

async function deleteUser() {
    try {
        console.log('Searching for "Sarah"...');
        const [users] = await db.query('SELECT * FROM users WHERE name LIKE "%Sarah%"');

        if (users.length === 0) {
            console.log('No user found with name containing "Sarah".');
            process.exit(0);
        }

        console.log(`Found ${users.length} user(s):`);
        users.forEach(u => console.log(`- [${u.id}] ${u.name} (${u.role})`));

        for (const user of users) {
            console.log(`Deleting user ID ${user.id}...`);
            // Delete related data first (optional, but good practice if no FK cascade)
            // We'll rely on DB constraints or ignore orphans for this quick fix
            await db.query('DELETE FROM users WHERE id = ?', [user.id]);
            console.log(`Deleted user ${user.name}`);
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

deleteUser();
