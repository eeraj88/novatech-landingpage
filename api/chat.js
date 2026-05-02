export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // n8n Chat Query-Params weiterreichen
    const n8nUrl = new URL(process.env.N8N_CHAT_WEBHOOK);
    Object.keys(req.query).forEach(key => n8nUrl.searchParams.append(key, req.query[key]));

    console.log('Chat request to:', n8nUrl.toString());

    const response = await fetch(n8nUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Chat error response:', errorText);
      throw new Error(`Chat API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (data.response && !data.output) data.output = data.response;

    return res.json(data);

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
