const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Static files aus public OR root
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '.')));

// GET / - Serve index.html
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '.' });
});

// In-Memory Lead Storage
let leadsStore = [];

// Log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});

app.post('/api/submit-lead', async (req, res) => {
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

        // Wenn n8n direkt lead-Daten zurückgibt, wrappe sie in { lead: ... }
        // Sonst sende rohes Ergebnis
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

            // Max 50 Leads speichern
            if (leadsStore.length > 50) {
                leadsStore = leadsStore.slice(0, 50);
            }
        }

        res.json(response);

    } catch (error) {
        console.error('Submit error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        // Das n8n Chat-Widget sendet wichtige Query-Parameter (?action=sendMessage)
        // Diese MÜSSEN an den n8n Chat-Trigger weitergereicht werden
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
        res.json(data);

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/leads/recent - Gibt gespeicherte Leads zurück
app.get('/api/leads/recent', async (req, res) => {
    res.json({ leads: leadsStore });
});

// GET / - Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: '.' });
});

// Vercel needs app export
if (process.env.VERCEL) {
    module.exports = app;
} else {
    const PORT = process.env.PORT || 3011;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
