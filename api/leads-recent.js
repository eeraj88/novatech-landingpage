// In-Memory Lead Storage (shared across functions via Vercel KV would be better)
let leadsStore = [];

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.json({ leads: leadsStore });
}
