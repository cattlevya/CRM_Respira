const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Default XAMPP password
};

async function setupDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // 1. Create Database
    await connection.query(`CREATE DATABASE IF NOT EXISTS respira_db`);
    console.log("Database 'respira_db' checked/created.");

    await connection.changeUser({ database: 'respira_db' });

    // 2. Create Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('patient', 'expert') DEFAULT 'patient',
        license_code VARCHAR(50) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Table 'users' checked/created.");

    // 2.1 Add Profile Columns if they don't exist (Migration)
    const [columns] = await connection.query(`SHOW COLUMNS FROM users`);
    const columnNames = columns.map(c => c.Field);

    if (!columnNames.includes('height')) {
      await connection.query(`ALTER TABLE users ADD COLUMN height INT NULL`);
      console.log("Added 'height' column.");
    }
    if (!columnNames.includes('weight')) {
      await connection.query(`ALTER TABLE users ADD COLUMN weight INT NULL`);
      console.log("Added 'weight' column.");
    }
    if (!columnNames.includes('blood_type')) {
      await connection.query(`ALTER TABLE users ADD COLUMN blood_type VARCHAR(5) NULL`);
      console.log("Added 'blood_type' column.");
    }
    if (!columnNames.includes('birth_date')) {
      await connection.query(`ALTER TABLE users ADD COLUMN birth_date DATE NULL`);
      console.log("Added 'birth_date' column.");
    }
    if (!columnNames.includes('emergency_contact')) {
      await connection.query(`ALTER TABLE users ADD COLUMN emergency_contact VARCHAR(20) NULL`);
      console.log("Added 'emergency_contact' column.");
    }
    if (!columnNames.includes('institution')) {
      await connection.query(`ALTER TABLE users ADD COLUMN institution VARCHAR(100) NULL`);
      console.log("Added 'institution' column.");
    }
    if (!columnNames.includes('title_degree')) {
      await connection.query(`ALTER TABLE users ADD COLUMN title_degree VARCHAR(50) NULL`);
      console.log("Added 'title_degree' column.");
    }
    if (!columnNames.includes('sip_number')) {
      await connection.query(`ALTER TABLE users ADD COLUMN sip_number VARCHAR(50) NULL`);
      console.log("Added 'sip_number' column.");
    }

    // 3. Create History Table (Legacy/Simple)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        diagnosis VARCHAR(255) NOT NULL,
        severity VARCHAR(50),
        date DATE,
        status VARCHAR(50),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("Table 'history' checked/created.");

    // 4. Create Daily Checkins Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS daily_checkins(
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        score INT NOT NULL,
        check_date DATE DEFAULT(CURRENT_DATE),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )
        `);
    console.log("Table 'daily_checkins' checked/created.");

    // 5. Create Diagnosis Logs Table (New Permanent History)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS diagnosis_logs(
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          final_result VARCHAR(255) NOT NULL,
          confidence_score INT DEFAULT 0,
          symptoms_summary TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        `);
    console.log("Table 'diagnosis_logs' checked/created.");

    // 6. Seed Data (Only if users table is empty)
    const [rows] = await connection.query('SELECT * FROM users');
    if (rows.length === 0) {
      await connection.query(`
        INSERT INTO users(name, email, password, role, license_code) VALUES
        ('Dr. Sarah Sp.P', 'admin@respira.id', 'admin', 'expert', 'DOKTER123'),
        ('Budi Santoso', 'user@gmail.com', 'user123', 'patient', NULL)
          `);
      console.log("Seed data inserted.");
    }

    console.log("Database setup complete!");
    process.exit();

  } catch (err) {
    console.error("Error setting up database:", err);
    process.exit(1);
  }
}

setupDatabase();
