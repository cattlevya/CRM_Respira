const fetch = require('node-fetch');

const API_KEY = '934d98a71e8df32b4b5d7ff32ba29abb';
const lat = -6.2088; // Jakarta
const lon = 106.8456;

async function testKey() {
    try {
        const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        console.log(`Fetching: ${url}`);
        const res = await fetch(url);
        if (!res.ok) {
            console.error(`Status: ${res.status} ${res.statusText}`);
            const text = await res.text();
            console.error(`Body: ${text}`);
        } else {
            const data = await res.json();
            console.log('Success! Data:', JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

testKey();
