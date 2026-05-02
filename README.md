# 🚀 NovaTech GmbH — AI-Powered Landingpage

Moderne Landingpage mit n8n-basierter Lead-Qualifizierung und KI-Chatbot.

## ✨ Features

- **KI-Chatbot** — n8n/chat Widget mit RAG (Qdrant + OpenRouter LLM)
- **Lead-Scoring** — AI Agent bewertet Leads (0-10), speichert in Google Sheets
- **Premium UI** — Royal Blue/Gray Theme, Light/Dark Mode, Scroll-Animationen
- **Portfolio Slider** — Hardware/Software Produkte mit Modal-Details
- **Career Section** — 6 Stellenausschreibungen mit Badge-System
- **Full Responsive** — Mobile-first Design

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Automation:** n8n (Chat Trigger, Webhook, AI Agent, Google Sheets)
- **AI:** OpenRouter (LLM), Google Gemini (Embeddings), Qdrant (Vector Store)
- **Deployment:** Vercel (empfohlen)

## 📦 Installation

```bash
# Repository klonen
git clone https://github.com/your-username/novatech-landingpage.git
cd novatech-landingpage

# Dependencies installieren
npm install

# .env erstellen und konfigurieren
cp .env.example .env
# Edit .env mit deinen n8n Webhook URLs

# Server starten
npm start
# → http://localhost:3011
```

## ⚙️ Environment Variables

```bash
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/lead-scoring
N8N_CHAT_WEBHOOK=https://your-n8n.com/webhook/chat-trigger
PORT=3011
```

## 🚀 Vercel Deployment

```bash
# Vercel CLI installieren
npm i -g vercel

# Deployen
vercel
# Environment Variables in Vercel Dashboard setzen
```

## 📊 n8n Workflows

### 1. Chatbot (RAG Pipeline)
- **Trigger:** Chat Trigger (webhookId: `5ac9f61c`)
- **Flow:** Webhook → QA Chain → Qdrant → OpenRouter → Response
- **Knowledge Base:** `Novatech/novatech/novatech/` (CSV, FAQ, Handbuch)

### 2. Lead-Scoring
- **Trigger:** Webhook (POST)
- **Flow:** Webhook → Edit Fields → AI Agent → IF Node → Google Sheets
- **Scoring:** 0-10 (≥7 = HOT LEAD)
- **Tabs:** Hot Leads / Cold Leads

## 🎨 Design System

- **Primary:** Royal Blue (#2563eb)
- **Accent:** Sky (#0ea5e9)
- **Fonts:** Inter (Body), Space Grotesk (Headlines)
- **Grid:** 8pt Spacing System
- **Animation:** Cubic-bezier transitions, fade-up scroll effects

## 📁 Projektstruktur

```
├── index.html          # Single-Page Frontend
├── server.js           # Express Backend (Proxy)
├── .env                # Environment Variables (nicht committen)
├── .env.example        # Template
├── vercel.json         # Vercel Konfiguration
└── README.md           # Diese Datei
```

## 🔒 Sicherheit

- ✅ Keine API Keys im Code
- ✅ .env in .gitignore
- ✅ n8n Webhooks sind öffentliche URLs (kein Secret nötig)
- ✅ CORS für n8n Endpoints konfiguriert

## 📈 Live Demo

👉 [nova-tech.vercel.app](https://nova-tech.vercel.app)

## 👤 Portfolio

Dieses Projekt ist Teil meines Portfolios und zeigt:
- **Frontend-Design:** Premium UI mit Animationen
- **Backend-Integration:** Express Proxy für n8n
- **AI-Automation:** Lead-Scoring und Chatbot mit n8n
- **Deployment:** Vercel mit Environment Variables

---

*Erstellt von [Dein Name] — 2026*
