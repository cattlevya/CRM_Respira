
const fetch = require('node-fetch');

async function checkStats() {
    try {
        const response = await fetch('http://localhost:5000/api/admin/stats');
        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

checkStats();
