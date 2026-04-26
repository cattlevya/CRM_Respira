-- Create Database
CREATE DATABASE IF NOT EXISTS respira_db;
USE respira_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('patient', 'expert') DEFAULT 'patient',
    license_code VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- History Table
CREATE TABLE IF NOT EXISTS history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    diagnosis VARCHAR(255) NOT NULL,
    severity VARCHAR(50),
    date DATE,
    status VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Daily Checkins Table (Lung Score)
CREATE TABLE IF NOT EXISTS daily_checkins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    score INT NOT NULL,
    check_date DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed Data (Initial Users)
INSERT INTO users (name, email, password, role, license_code) VALUES 
('Dr. Sarah Sp.P', 'admin@respira.id', 'admin', 'expert', 'DOKTER123'),
('Budi Santoso', 'user@gmail.com', 'user123', 'patient', NULL);

