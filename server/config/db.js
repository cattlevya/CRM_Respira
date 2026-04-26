const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Default XAMPP password is empty
    database: 'respira_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true // Return dates as strings to avoid timezone conversion issues
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Database Connection Failed:', err.code);
    } else {
        console.log('Connected to MySQL Database');
        connection.release();
    }
});

module.exports = db.promise();
