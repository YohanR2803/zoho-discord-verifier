// api/submit.js
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const payload = req.body;
  try {
    await fetch(process.env.PERSIST_API_URL + "/submissions", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email:       payload.email,
        discord_id:  payload.discord_id,
        first_name:  payload.first_name,
        last_name:   payload.last_name,
        mobile_no:   payload["Mobile No"],
        country:     payload.country
      })
    });
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Forward error:", err);
    return res.status(502).json({ error: 'Forward failed' });
  }
};
