// PointsVault Supabase Auto-Keepalive Script (CommonJS)
// Purpose: Pings Supabase REST API to reset the 7-day inactivity timer

const https = require('https');

const SUPABASE_URL = 'tgnedqojhbszgqoiloqe.supabase.co';
const API_KEY = 'sb_publishable_J1wJMg0KvGYguKk_09pPRg_7nrYFPGy';

function pingSupabase() {
  const options = {
    hostname: SUPABASE_URL,
    path: '/rest/v1/card_rules?select=id&limit=1',
    method: 'GET',
    headers: {
      'apikey': API_KEY,
      'Authorization': `Bearer ${API_KEY}`,
      'User-Agent': 'PointsVault-KeepAlive/1.0'
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log(`[${new Date().toISOString()}] ✅ Supabase Keep-Alive Success! Status: 200 OK. Timer reset.`);
      } else {
        console.warn(`[${new Date().toISOString()}] ⚠️ Keep-Alive returned status: ${res.statusCode} - ${data}`);
      }
    });
  });

  req.on('error', (err) => {
    console.error(`[${new Date().toISOString()}] ❌ Keep-Alive Error:`, err.message);
  });

  req.end();
}

pingSupabase();
