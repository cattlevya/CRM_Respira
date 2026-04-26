-- Database Update for Expert System

-- 1. Table for Symptoms
CREATE TABLE IF NOT EXISTS symptoms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  code VARCHAR(20) UNIQUE, -- e.g., G01
  description TEXT
);

-- 2. Table for Diseases
CREATE TABLE IF NOT EXISTS diseases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  code VARCHAR(20) UNIQUE, -- e.g., P01
  treatment_advice TEXT
);

-- 3. Table for AI Research Drafts
CREATE TABLE IF NOT EXISTS research_drafts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  expert_id INT,
  content JSON, -- The AI suggestion
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  source_journal VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table for Rules (Optional, if we want dynamic rules in DB)
CREATE TABLE IF NOT EXISTS diagnosis_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  symptom_combination JSON, -- e.g., ["G01", "G02"]
  disease_code VARCHAR(20),
  confidence FLOAT
);
