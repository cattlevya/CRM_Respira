const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // Default XAMPP password
    database: 'respira_db'
};

async function setupTelemedicineDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Connected to database.");

        // 1. Chat Messages Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        content TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id),
        FOREIGN KEY (receiver_id) REFERENCES users(id)
      )
    `);
        console.log("Table 'messages' checked/created.");

        // 2. Enhanced Consultations Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS consultations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        doctor_id INT NULL,
        diagnosis_log_id INT NULL,
        status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
        requested_date DATE,
        notes TEXT,
        doctor_response TEXT,
        meeting_link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
        console.log("Table 'consultations' checked/created.");

        console.log("Telemedicine database setup complete!");
        process.exit();

    } catch (err) {
        console.error("Error setting up telemedicine database:", err);
        process.exit(1);
    }
}

setupTelemedicineDB();
