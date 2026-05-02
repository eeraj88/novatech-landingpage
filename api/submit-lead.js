// In-Memory Lead Storage (resets on each deployment)
let leadsStore = [];

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
    const { name, email, company, message } = req.body;

    console.log('Sending to n8n webhook:', process.env.N8N_WEBHOOK_URL);
    console.log('Payload:', { Name: name, Email: email, Firma: company, 'Anfrage-Text': message });

    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Name: name,
        Email: email,
        Firma: company,
        'Anfrage-Text': message
      })
    });

    console.log('n8n response status:', n8nResponse.status);

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('n8n error response:', errorText);
      throw new Error(`n8n returned ${n8nResponse.status}: ${errorText}`);
    }

    const result = await n8nResponse.json();
    console.log('n8n success response:', result);

    const response = result.score !== undefined || result.type !== undefined
      ? { success: true, lead: result }
      : { success: true, data: result };

    // Lead im Speicher speichern
    if (response.lead) {
      const leadData = {
        ...response.lead,
        name,
        email,
        company,
        message,
        time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
      };
      leadsStore.unshift(leadData);

      if (leadsStore.length > 50) {
        leadsStore = leadsStore.slice(0, 50);
      }
    }

    return res.json(response);

  } catch (error) {
    console.error('Submit error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
