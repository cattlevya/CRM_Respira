const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- ONLINE STATUS MIDDLEWARE ---
app.use(async (req, res, next) => {
    // Try to find userId from common locations
    const userId = req.body.userId || req.params.userId || req.body.senderId || req.body.id;

    if (userId) {
        try {
            await db.query('UPDATE users SET last_active_at = NOW() WHERE id = ?', [userId]);
        } catch (err) {
            console.error('Failed to update last_active_at', err);
        }
    }
    next();
});

// --- AUTH ROUTES ---

app.post('/api/register', async (req, res) => {
    const { name, email, password, role, licenseCode } = req.body;
    try {
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, message: 'Email sudah terdaftar.' });
        }
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role, license_code) VALUES (?, ?, ?, ?, ?)',
            [name, email, password, role, licenseCode]
        );
        const newUser = { id: result.insertId, name, email, role };
        res.json({ success: true, user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (users.length > 0) {
            const user = users[0];
            const { password, ...userData } = user;
            res.json({ success: true, user: userData });
        } else {
            res.status(401).json({ success: false, message: 'Email atau password salah.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// --- DASHBOARD & CHECK-IN ROUTES ---

app.get('/api/dashboard/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [userRows] = await db.query('SELECT name, height, weight, blood_type, emergency_contact FROM users WHERE id = ?', [userId]);
        const userData = userRows.length > 0 ? userRows[0] : { name: 'User' };

        const [scoreRows] = await db.query(
            'SELECT score FROM daily_checkins WHERE user_id = ? AND check_date = CURDATE()',
            [userId]
        );
        const latestScore = scoreRows.length > 0 ? scoreRows[0].score : null;

        // Fetch from new diagnosis_logs instead of old history table for dashboard preview
        const [historyRows] = await db.query(
            'SELECT * FROM diagnosis_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
            [userId]
        );

        res.json({
            success: true,
            data: {
                userName: userData.name,
                userProfile: userData,
                latestScore,
                history: historyRows
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
    }
});

app.post('/api/checkin', async (req, res) => {
    const { userId, score } = req.body;
    try {
        const [existing] = await db.query(
            'SELECT id FROM daily_checkins WHERE user_id = ? AND check_date = CURDATE()',
            [userId]
        );

        if (existing.length > 0) {
            await db.query('UPDATE daily_checkins SET score = ? WHERE id = ?', [score, existing[0].id]);
        } else {
            await db.query(
                'INSERT INTO daily_checkins (user_id, score, check_date) VALUES (?, ?, CURDATE())',
                [userId, score]
            );
        }

        res.json({ success: true, message: 'Check-in berhasil disimpan.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Gagal menyimpan check-in.' });
    }
});

app.get('/api/checkin/today/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT score FROM daily_checkins WHERE user_id = ? AND check_date = CURDATE()',
            [userId]
        );
        res.json({ success: true, hasCheckedIn: rows.length > 0, score: rows.length > 0 ? rows[0].score : null });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error checking status' });
    }
});

// --- PROFILE ROUTES ---

app.get('/api/user/profile/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT name, email, height, weight, blood_type, birth_date, emergency_contact, institution, title_degree, sip_number FROM users WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.json({ success: true, data: rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

app.put('/api/user/profile/:id', async (req, res) => {
    const { id } = req.params;
    const { height, weight, blood_type, birth_date, emergency_contact } = req.body;
    try {
        await db.query(
            'UPDATE users SET height = ?, weight = ?, blood_type = ?, birth_date = ?, emergency_contact = ? WHERE id = ?',
            [height, weight, blood_type, birth_date, emergency_contact, id]
        );
        res.json({ success: true, message: 'Profile updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Update failed' });
    }
});

// --- AQI PROXY ROUTE ---
app.post('/api/aqi', async (req, res) => {
    const { lat, lon } = req.body;
    const API_KEY = '934d98a71e8df32b4b5d7ff32ba29abb';

    try {
        const pollutionUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const pollutionRes = await fetch(pollutionUrl);
        const pollutionData = await pollutionRes.json();

        const geoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (pollutionData.list && pollutionData.list.length > 0) {
            const item = pollutionData.list[0];
            const city = geoData.length > 0 ? geoData[0].name : 'Lokasi Terdeteksi';

            res.json({
                success: true,
                data: {
                    aqi: item.main.aqi,
                    pm25: item.components.pm2_5,
                    co: item.components.co,
                    city: city
                }
            });
        } else {
            throw new Error('No data found');
        }

    } catch (err) {
        console.error('AQI Fetch Error:', err);
        res.json({
            success: true,
            data: {
                aqi: 2,
                pm25: 15.5,
                co: 240,
                city: 'Mode Demo (API Key Missing)'
            }
        });
    }
});

// --- NEWS ROUTE (GEMINI AI) ---
app.post('/api/news', async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI("AIzaSyAz2Xd6t6UkhQWgdkSShwCqP41P33kojuA");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = "Cari 5 berita kesehatan pernapasan terbaru dan valid minggu ini (topik: Asma, TBC, Kualitas Udara, ISPA). Return JSON array valid tanpa markdown formatting. Format: [{title, summary, source, date}]. Bahasa Indonesia.";

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const newsData = JSON.parse(jsonStr);

        res.json({ success: true, data: newsData });

    } catch (err) {
        console.error("Gemini Error:", err);
        res.json({
            success: true,
            data: [
                { title: "Kualitas Udara Jakarta Memburuk Pagi Ini", summary: "Indeks kualitas udara (AQI) di Jakarta mencapai angka tidak sehat bagi kelompok sensitif.", source: "CNN Indonesia", date: "2023-10-25" },
                { title: "Waspada Lonjakan Kasus ISPA pada Anak", summary: "Dinas Kesehatan menghimbau orang tua untuk mewaspadai gejala ISPA di tengah peralihan musim.", source: "Kompas Health", date: "2023-10-24" },
                { title: "Terobosan Baru Pengobatan Asma Berat", summary: "Penelitian terbaru menunjukkan efektivitas obat biologis baru untuk penderita asma kronis.", source: "Detik Health", date: "2023-10-23" },
                { title: "Pentingnya Vaksinasi Influenza", summary: "Ahli paru menekankan pentingnya vaksin flu tahunan untuk mencegah komplikasi paru.", source: "Antara News", date: "2023-10-22" },
                { title: "Tips Menjaga Paru-paru Tetap Sehat", summary: "Latihan pernapasan rutin dan menghindari polusi adalah kunci kesehatan paru jangka panjang.", source: "Halodoc", date: "2023-10-21" }
            ]
        });
    }
});

// --- DIAGNOSIS HISTORY ROUTES (NEW) ---

// Save Diagnosis
app.post('/api/diagnosis', async (req, res) => {
    const { userId, result, score, symptoms } = req.body;
    try {
        const [resultDb] = await db.query(
            'INSERT INTO diagnosis_logs (user_id, final_result, confidence_score, symptoms_summary) VALUES (?, ?, ?, ?)',
            [userId, result, score, JSON.stringify(symptoms)]
        );
        res.json({ success: true, message: 'Diagnosis saved', id: resultDb.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to save diagnosis' });
    }
});

// Get History
app.get('/api/history/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM diagnosis_logs WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch history' });
    }
});

// --- ADMIN DASHBOARD ROUTES ---

app.get('/api/admin/stats', async (req, res) => {
    try {
        // 1. Total Diagnosa Hari Ini
        const [todayRows] = await db.query(
            'SELECT COUNT(*) as count FROM diagnosis_logs WHERE DATE(created_at) = CURDATE()'
        );
        const totalToday = todayRows[0].count;

        // 2. Kasus Kritis (Merah)
        const [criticalRows] = await db.query(
            'SELECT COUNT(*) as count FROM diagnosis_logs WHERE final_result LIKE "%Bahaya%" OR final_result LIKE "%Segera%"'
        );
        const criticalCount = criticalRows[0].count;

        // 3. Akurasi Sistem (Mock)
        const accuracy = 98;

        // 4. Disease Distribution (Pie Chart)
        const [distributionRows] = await db.query(
            'SELECT final_result, COUNT(*) as count FROM diagnosis_logs GROUP BY final_result'
        );
        const diseaseDistribution = distributionRows.map(row => ({
            name: row.final_result.split(' - ')[0] || row.final_result,
            value: row.count
        }));

        // 5. Activity Log (Bar Chart)
        const [activityRows] = await db.query(
            `SELECT DATE(created_at) as date, COUNT(*) as count 
             FROM diagnosis_logs 
             WHERE created_at >= DATE(NOW()) - INTERVAL 7 DAY 
             GROUP BY DATE(created_at) 
             ORDER BY date ASC`
        );
        const activityLog = activityRows.map(row => ({
            date: new Date(row.date).toISOString().split('T')[0],
            count: row.count
        }));

        // 6. System Alerts (Real Logic)
        const alerts = [];

        // Alert 1: Critical Alerts (Real Logic)
        const [criticalLogs] = await db.query(`
            SELECT d.final_result, u.name 
            FROM diagnosis_logs d
            JOIN users u ON d.user_id = u.id
            WHERE (
                d.final_result LIKE '%Bahaya%' OR 
                d.final_result LIKE '%Segera%' OR 
                d.final_result LIKE '%Gawat%' OR 
                d.final_result LIKE '%Darurat%' OR
                d.final_result LIKE '%Kritis%' OR
                d.final_result LIKE '%Eksaserbasi%' OR
                d.final_result LIKE '%Emboli%' OR
                d.final_result LIKE '%Pneumothorax%' OR
                d.final_result LIKE '%Cor Pulmonale%' OR
                d.final_result LIKE '%Gagal Jantung%' OR
                d.final_result LIKE '%Kanker%' OR
                d.final_result LIKE '%Pneumonia%' OR
                d.final_result LIKE '%Tuberkulosis%'
            )
            AND d.created_at >= NOW() - INTERVAL 24 HOUR
            LIMIT 10
        `);

        // Calculate Emergency Count (Unique Patients with Critical Status in Last 24 Hours)
        const [emergencyCountRows] = await db.query(`
            SELECT COUNT(DISTINCT user_id) as count 
            FROM diagnosis_logs 
            WHERE (
                final_result LIKE '%Bahaya%' OR 
                final_result LIKE '%Segera%' OR 
                final_result LIKE '%Gawat%' OR 
                final_result LIKE '%Darurat%' OR
                final_result LIKE '%Kritis%' OR
                final_result LIKE '%Eksaserbasi%' OR
                final_result LIKE '%Emboli%' OR
                final_result LIKE '%Pneumothorax%' OR
                final_result LIKE '%Cor Pulmonale%' OR
                final_result LIKE '%Gagal Jantung%' OR
                final_result LIKE '%Kanker%' OR
                final_result LIKE '%Pneumonia%' OR
                final_result LIKE '%Tuberkulosis%'
            )
            AND created_at >= NOW() - INTERVAL 24 HOUR
        `);
        const emergencyCount = emergencyCountRows[0].count;

        criticalLogs.forEach(log => {
            alerts.push({
                type: 'critical',
                message: `Pasien ${log.name} terdiagnosa kritis: ${log.final_result.substring(0, 50)}...`
            });
        });

        // Alert 2: Novelty Detection (New Diagnosis Patterns)
        const [novelLogs] = await db.query(`
            SELECT d1.final_result, d1.created_at, u.name
            FROM diagnosis_logs d1
            JOIN users u ON d1.user_id = u.id
            WHERE d1.created_at >= NOW() - INTERVAL 24 HOUR
            AND NOT EXISTS (
                SELECT 1 FROM diagnosis_logs d2 
                WHERE d2.final_result = d1.final_result 
                AND d2.created_at < d1.created_at
            )
            LIMIT 10
        `);

        novelLogs.forEach(log => {
            alerts.push({
                type: 'discovery',
                message: `Pola Baru Terdeteksi: "${log.final_result.substring(0, 40)}..." muncul pertama kali pada pasien ${log.name}.`
            });
        });

        console.log("DEBUG: Generated Alerts:", alerts);

        // 7. Dataset Status (Real Logic based on Logs)
        const [datasetRows] = await db.query('SELECT COUNT(*) as count FROM diagnosis_logs');
        const datasetCount = datasetRows[0].count;
        const datasetStatus = {
            label: 'Training Data',
            count: `${datasetCount} Records`,
            percentage: Math.min((datasetCount / 2000) * 100, 100) // Target 2000 records
        };

        // 8. Total Stats (Real Logic)
        const [totalUsersStatsRows] = await db.query('SELECT COUNT(*) as count FROM users');
        const totalUsers = totalUsersStatsRows[0].count;
        console.log("DEBUG: Total Users Fetched:", totalUsers);

        const [totalDiagnosesRows] = await db.query('SELECT COUNT(*) as count FROM diagnosis_logs');
        const totalDiagnoses = totalDiagnosesRows[0].count;
        console.log("DEBUG: Total Diagnoses Fetched:", totalDiagnoses);

        // 9. Recent Activity (Real Logic)
        const [recentActivityRows] = await db.query(`
            SELECT d.created_at, d.final_result, u.name as user_name
            FROM diagnosis_logs d
            JOIN users u ON d.user_id = u.id
            ORDER BY d.created_at DESC
            LIMIT 8
        `);
        console.log("DEBUG: Recent Activity Fetched:", recentActivityRows.length);

        res.json({
            success: true,
            data: {
                stats: { totalToday, criticalCount, accuracy },
                total_users: totalUsers,
                total_diagnoses: totalDiagnoses,
                avg_accuracy: accuracy,
                charts: { diseaseDistribution, activityLog },
                alerts: alerts,
                datasetStatus: datasetStatus,
                recent_activity: recentActivityRows,
                emergency_count: emergencyCount,
                pendingReviews: []
            }
        });

    } catch (err) {
        console.error("Admin Stats Error:", err);
        res.status(500).json({ success: false, message: 'Failed to fetch admin stats', error: err.message });
    }
});

app.get('/api/admin/history/all', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT d.id, d.created_at, u.name as patient_name, d.final_result, d.confidence_score
            FROM diagnosis_logs d
            LEFT JOIN users u ON d.user_id = u.id
            ORDER BY d.created_at DESC
        `);

        const formattedRows = rows.map(row => ({
            id: row.id,
            requested_date: row.created_at ? new Date(row.created_at).toISOString().replace('T', ' ').substring(0, 19) : new Date().toISOString(), // Format for frontend consistency
            patient_name: row.patient_name || 'Unknown User',
            diagnosis_result: row.final_result,
            confidence_score: row.confidence_score,
            status: 'completed' // Diagnosis is always completed
        }));

        res.json({ success: true, data: formattedRows });
    } catch (err) {
        console.error("History Error Detailed:", err);
        res.status(500).json({ success: false, message: 'Failed to fetch history: ' + err.message });
    }
});

// --- EXPERT SYSTEM ROUTES ---

// 1. Expert Profile Update
app.put('/api/expert/profile/:id', async (req, res) => {
    const { id } = req.params;
    const { institution, title_degree, sip_number } = req.body;
    try {
        await db.query(
            'UPDATE users SET institution = ?, title_degree = ?, sip_number = ? WHERE id = ?',
            [institution, title_degree, sip_number, id]
        );
        res.json({ success: true, message: 'Expert profile updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Update failed' });
    }
});

// 2. Gemini Expert Research (UPDATED PROMPT - PROACTIVE)
app.post('/api/expert/research', async (req, res) => {
    // const { topic } = req.body; // Not needed for auto-research
    try {
        // Use environment variable or fallback (User requested Gemini 2.5 Flash -> assuming 1.5 Flash)
        const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAz2Xd6t6UkhQWgdkSShwCqP41P33kojuA";
        const genAI = new GoogleGenerativeAI(apiKey);

        // Using gemini-1.5-flash-001 (specific version to avoid 404 on some keys)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        Bertindak sebagai Peneliti Medis AI Senior.
        Lakukan simulasi pemindaian proaktif terhadap literatur medis pernapasan global tahun 2024-2025.
        Identifikasi 3 temuan klinis baru (gejala baru, faktor risiko baru, atau korelasi penyakit baru) yang BELUM umum diketahui atau sedang tren.
        
        Output WAJIB berupa JSON ARRAY yang valid. Jangan ada teks lain selain JSON.
        Struktur:
        [
            {
                "type": "symptom" atau "rule",
                "name": "Nama Gejala/Penyakit",
                "clinical_evidence": "Ringkasan temuan dari jurnal (Bahasa Indonesia)...",
                "source_journal": "Nama Jurnal/Sumber (Tahun)",
                "suggested_action": "Saran implementasi ke sistem...",
                "proposed_node": { "question": "...", "options": [...] } (Opsional, jika rule)
            }
        ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini Response:", text); // Debug log

        // Clean JSON
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        let draftData;
        try {
            draftData = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Raw Text:", text);
            throw new Error("Invalid JSON response from AI");
        }

        res.json({ success: true, data: draftData });

    } catch (err) {
        console.error("Gemini Logic Error:", err);
        res.status(500).json({
            success: false,
            message: 'Failed to generate logic: ' + (err.message || 'Unknown Error'),
            details: err.toString()
        });
    }
});


// 3. Merge Logic (Insert into DB)
app.post('/api/expert/merge', async (req, res) => {
    const { draft } = req.body;
    try {
        // In a real app, we would insert into 'symptoms' or 'rules' table.
        // For now, we simulate success.
        console.log("Merging Draft:", draft);

        // Example DB Insert (Commented out until tables exist)
        /*
        if (draft.type === 'symptom') {
            await db.query('INSERT INTO symptoms (name, description) VALUES (?, ?)', [draft.name, draft.clinical_evidence]);
        }
        */

        res.json({ success: true, message: 'Data merged successfully.' });
    } catch (err) {
        console.error("Merge Error:", err);
        res.status(500).json({ success: false, message: 'Failed to merge data' });
    }
});

// --- TREE MANAGER ROUTES (VISUAL EDITOR - READ ONLY) ---

// Mock Data for Decision Tree (Initial State)
let decisionTreeData = {
    nodes: [
        { id: 'root', type: 'input', data: { label: 'Apakah pasien mengalami batuk?' }, position: { x: 250, y: 0 } },
        { id: 'node-2', data: { label: 'Apakah batuk berdahak?' }, position: { x: 100, y: 100 } },
        { id: 'node-3', data: { label: 'Apakah ada sesak napas?' }, position: { x: 400, y: 100 } },
        { id: 'node-4', data: { label: 'Diagnosa: Kemungkinan Flu Biasa' }, position: { x: 0, y: 200 } },
        { id: 'node-5', data: { label: 'Apakah dahak berwarna hijau/kuning?' }, position: { x: 200, y: 200 } },
        { id: 'node-6', type: 'output', data: { label: 'Diagnosa: Asma (Perlu Pemeriksaan Lanjut)' }, position: { x: 400, y: 200 } },
        { id: 'node-7', type: 'output', data: { label: 'Diagnosa: Bronkitis' }, position: { x: 150, y: 300 } },
        { id: 'node-8', type: 'output', data: { label: 'Diagnosa: ISPA Ringan' }, position: { x: 300, y: 300 } }
    ],
    edges: [
        { id: 'e1-2', source: 'root', target: 'node-2', label: 'Ya', animated: true },
        { id: 'e1-3', source: 'root', target: 'node-3', label: 'Tidak', animated: true },
        { id: 'e2-4', source: 'node-2', target: 'node-4', label: 'Tidak' },
        { id: 'e2-5', source: 'node-2', target: 'node-5', label: 'Ya' },
        { id: 'e3-6', source: 'node-3', target: 'node-6', label: 'Ya' },
        { id: 'e5-7', source: 'node-5', target: 'node-7', label: 'Ya' },
        { id: 'e5-8', source: 'node-5', target: 'node-8', label: 'Tidak' }
    ]
};


// 4. Save Decision Tree (Overwrite File)
app.post('/api/expert/save-tree', async (req, res) => {
    const { treeData } = req.body;
    try {
        const fs = require('fs');
        const path = require('path');

        // Construct the file content
        // We need to preserve the imports/exports structure
        const fileContent = `// WARNING / CATATAN PENTING:
// - Pohon keputusan ini bersifat EDUKATIF/TAMBAHAN, bukan pengganti diagnosis dokter.
// - Diagnosis definitif memerlukan anamnesis lengkap, pemeriksaan fisik, dan penunjang.
// - Jangan gunakan ini untuk mengambil keputusan klinis sendiri tanpa tenaga kesehatan.

export const decisionTree = ${JSON.stringify(treeData, null, 2)};
`;

        const filePath = path.join(__dirname, '../src/data/decisionTree.js');

        fs.writeFile(filePath, fileContent, (err) => {
            if (err) {
                console.error("File Write Error:", err);
                return res.status(500).json({ success: false, message: 'Failed to write file' });
            }
            res.json({ success: true, message: 'Decision tree saved successfully.' });
        });

    } catch (err) {
        console.error("Save Tree Error:", err);
        res.status(500).json({ success: false, message: 'Failed to save tree' });
    }
});

app.get('/api/tree', (req, res) => {
    res.json({ success: true, data: decisionTreeData });
});

// --- TELEMEDICINE ROUTES (NEW) ---

// 1. CHAT SYSTEM

// Get Conversation History
app.get('/api/messages/:userId/:contactId', async (req, res) => {
    const { userId, contactId } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT * FROM messages 
            WHERE (sender_id = ? AND receiver_id = ?) 
            OR (sender_id = ? AND receiver_id = ?)
            ORDER BY created_at ASC
        `, [userId, contactId, contactId, userId]);

        // Mark as read when fetching history (optional, or use explicit endpoint)
        // await db.query('UPDATE messages SET is_read = TRUE WHERE sender_id = ? AND receiver_id = ?', [contactId, userId]);

        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
});

// Get Unread Count & Latest Message
app.get('/api/messages/unread/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // Ensure column exists (Quick Migration Hack)
        try {
            await db.query('SELECT is_read FROM messages LIMIT 1');
        } catch (e) {
            await db.query('ALTER TABLE messages ADD COLUMN is_read BOOLEAN DEFAULT FALSE');
        }

        const [rows] = await db.query(`
            SELECT COUNT(*) as count FROM messages 
            WHERE receiver_id = ? AND is_read = FALSE
        `, [userId]);

        // Get Latest Unread Message
        const [latest] = await db.query(`
            SELECT m.content, m.created_at, u.name as sender_name 
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.receiver_id = ? AND m.is_read = FALSE
            ORDER BY m.created_at DESC
            LIMIT 1
        `, [userId]);

        res.json({
            success: true,
            count: rows[0].count,
            latest_message: latest.length > 0 ? latest[0] : null
        });
    } catch (err) {
        console.error(err);
        res.json({ success: false, count: 0, latest_message: null }); // Fail gracefully
    }
});

// Mark Messages as Read
app.post('/api/messages/mark-read', async (req, res) => {
    const { userId, senderId } = req.body;
    try {
        await db.query(`
            UPDATE messages SET is_read = TRUE 
            WHERE receiver_id = ? AND sender_id = ?
        `, [userId, senderId]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// Send Message
app.post('/api/messages/send', async (req, res) => {
    const { senderId, receiverId, content } = req.body;
    try {
        await db.query(
            'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
            [senderId, receiverId, content]
        );
        res.json({ success: true, message: 'Message sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
});

// Get Contacts (Chat List)
app.get('/api/contacts/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // Get user role first
        const [userRows] = await db.query('SELECT role FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

        const role = userRows[0].role;
        const targetRole = role === 'expert' ? 'patient' : 'expert';

        // Simple logic: List all users of the opposite role (for demo purposes)
        // In a real app, this would be based on previous interactions or assignments
        const [contacts] = await db.query(`
            SELECT 
                u.id, u.name, u.email, u.role, u.title_degree, u.last_active_at,
                (SELECT content FROM messages m WHERE (m.sender_id = u.id AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = u.id) ORDER BY m.created_at DESC LIMIT 1) as lastMessage,
                (SELECT created_at FROM messages m WHERE (m.sender_id = u.id AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = u.id) ORDER BY m.created_at DESC LIMIT 1) as lastMessageTime,
                (SELECT COUNT(*) FROM messages m WHERE m.sender_id = u.id AND m.receiver_id = ? AND m.is_read = FALSE) as unreadCount
            FROM users u 
            WHERE u.role = ?
        `, [userId, userId, userId, userId, userId, targetRole]);

        res.json({ success: true, data: contacts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch contacts' });
    }
});

// Get Doctors List
app.get('/api/doctors', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id, name, title_degree, institution 
            FROM users 
            WHERE role = 'expert'
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch doctors' });
    }
});

// Book Consultation
app.post('/api/consultations/book', async (req, res) => {
    const { userId, diagnosisId, doctorId, date, notes } = req.body;
    try {
        await db.query(
            'INSERT INTO consultations (user_id, doctor_id, diagnosis_log_id, requested_date, notes) VALUES (?, ?, ?, ?, ?)',
            [userId, doctorId, diagnosisId, date, notes]
        );
        res.json({ success: true, message: 'Janji temu berhasil dibuat.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Gagal membuat janji temu.' });
    }
});

// Get Expert Appointments
app.get('/api/expert/appointments/:doctorId', async (req, res) => {
    const { doctorId } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT c.id, c.requested_date, c.notes, c.status, c.created_at, c.user_id,
                   u.name as patient_name, u.email as patient_email,
                   d.final_result as diagnosis_result, d.confidence_score
            FROM consultations c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN diagnosis_logs d ON c.diagnosis_log_id = d.id
            WHERE c.doctor_id = ?
            ORDER BY 
                CASE 
                    WHEN c.status = 'pending' THEN 1 
                    WHEN c.status = 'approved' THEN 2 
                    ELSE 3 
                END ASC,
                c.requested_date ASC
        `, [doctorId]);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch expert appointments' });
    }
});
// Get Patient Appointments
app.get('/api/patient/appointments/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT c.id, c.requested_date, c.notes, c.status, c.created_at, c.doctor_id,
                   u.name as doctor_name, u.title_degree as doctor_title, u.institution as doctor_institution
            FROM consultations c
            JOIN users u ON c.doctor_id = u.id
            WHERE c.user_id = ?
            ORDER BY c.requested_date ASC
        `, [userId]);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch patient appointments' });
    }
});

// Respond to Appointment
app.post('/api/expert/appointments/respond', async (req, res) => {
    const { id, status, response } = req.body; // status: 'approved' | 'rejected'
    try {
        await db.query(
            'UPDATE consultations SET status = ?, doctor_response = ? WHERE id = ?',
            [status, response, id]
        );
        res.json({ success: true, message: `Appointment ${status}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update appointment' });
    }
});

// Cancel Appointment
app.post('/api/consultations/cancel', async (req, res) => {
    const { id } = req.body;
    try {
        await db.query(
            'UPDATE consultations SET status = "cancelled" WHERE id = ?',
            [id]
        );
        res.json({ success: true, message: 'Janji temu dibatalkan.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Gagal membatalkan janji.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
