const db = require('./config/db');

async function testCancellation() {
    try {
        console.log('--- STARTING CANCELLATION DEBUG ---');

        // 1. Get a test patient
        const [patients] = await db.query("SELECT id, name FROM users WHERE role = 'patient' LIMIT 1");
        if (patients.length === 0) {
            console.log('No patients found.');
            return;
        }
        const patient = patients[0];
        console.log(`Using patient: ${patient.name} (ID: ${patient.id})`);

        // 2. Get a doctor
        const [doctors] = await db.query("SELECT id, name FROM users WHERE role = 'expert' LIMIT 1");
        if (doctors.length === 0) {
            console.log('No doctors found.');
            return;
        }
        const doctor = doctors[0];
        console.log(`Using doctor: ${doctor.name} (ID: ${doctor.id})`);

        // 3. Create a dummy consultation
        console.log('Creating dummy consultation...');
        const [result] = await db.query(
            'INSERT INTO consultations (user_id, doctor_id, requested_date, status, notes) VALUES (?, ?, NOW() + INTERVAL 1 DAY, "pending", "Debug Test")',
            [patient.id, doctor.id]
        );
        const consultId = result.insertId;
        console.log(`Created consultation ID: ${consultId}`);

        // 4. Verify initial status
        const [rowsBefore] = await db.query('SELECT status FROM consultations WHERE id = ?', [consultId]);
        console.log(`Status BEFORE cancel: ${rowsBefore[0].status}`);

        // 5. Run the EXACT logic from the cancel API
        console.log('Executing cancellation logic...');
        await db.query(
            'UPDATE consultations SET status = "cancelled" WHERE id = ?',
            [consultId]
        );

        // 6. Verify final status
        const [rowsAfter] = await db.query('SELECT status FROM consultations WHERE id = ?', [consultId]);
        console.log(`Status AFTER cancel: ${rowsAfter[0].status}`);

        if (rowsAfter[0].status === 'cancelled') {
            console.log('SUCCESS: Backend logic works correctly.');
        } else {
            console.error('FAILURE: Status did not update to "cancelled".');
        }

        // Cleanup
        await db.query('DELETE FROM consultations WHERE id = ?', [consultId]);
        console.log('Cleaned up test data.');

    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        process.exit();
    }
}

testCancellation();
