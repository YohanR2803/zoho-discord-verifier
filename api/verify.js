// api/verify.js
const fetch = require("node-fetch");

const DISCORD_TOKEN    = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID         = process.env.GUILD_ID;
const VERIFIED_ROLE_ID = process.env.VERIFIED_ROLE_ID;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  let body = req.body;

  if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
    body = Object.fromEntries(new URLSearchParams(body));
  }

  console.log("Incoming body:", body); // ✅ Debug payload from Zoho

  const email      = body.email;
  const discord_id = body.discord_id;
  const first_name = body.first_name;
  const last_name  = body.last_name;
  const mobile     = body["Mobile No"] || body["mobile_no"] || body.mobile || null;
  const country    = body.country;

  if (!discord_id) return res.status(400).json({ error: 'Missing discord_id' });

  const url = `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discord_id}/roles/${VERIFIED_ROLE_ID}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${DISCORD_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Discord error:', response.status, text);
      return res.status(502).json({ error: 'Discord API failed', details: text });
    }

    console.log(`✅ Assigned verified role to ${discord_id} (${email})`);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Fetch error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
};
