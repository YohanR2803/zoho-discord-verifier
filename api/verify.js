// api/verify.js
const fetch = require("node-fetch");

const DISCORD_TOKEN    = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID         = process.env.GUILD_ID;
const VERIFIED_ROLE_ID = process.env.VERIFIED_ROLE_ID;

module.exports = async (req, res) => {
  console.log("Incoming data:", req.body);  // <== Add this line

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }


  // Map Zoho payload field names to variables
  const {
    email: Email,
    discord_id: Discord_ID,
    first_name: First_Name,
    last_name: Last_Name,
    'Mobile No': Mobile_No,
    country: Country
  } = body;

  if (!Discord_ID) return res.status(400).json({ error: 'Missing Discord_ID' });

  const url = `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${Discord_ID}/roles/${VERIFIED_ROLE_ID}`;

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

    console.log(`✅ Assigned verified role to ${Discord_ID} (${Email})`);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Fetch error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
};
