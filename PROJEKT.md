# Projekt: NovaTech GmbH Landingpage & KI-Integration

Moderne Landingpage für "NovaTech GmbH" mit n8n-basierter Lead-Qualifizierung und KI-Chatbot.

## 📁 Projektstruktur

- `index.html` — Single-Page Frontend (Royal Blue/Gray, Light/Dark Mode)
- `server.js` — Express.js Backend (Port 3011), Proxy für n8n Webhooks
- `.env` — Konfiguration (Ports, n8n URLs)
- `TechShop Produktberater/` — Produktdokumente
- `Novatech/novatech/novatech/` — Wissensbasis (CSV, FAQ, Handbuch)

## 🚀 Funktionen

### 1. KI-Chatbot (@n8n/chat Widget)
- CDN-Integration via `@n8n/chat` ES-Modul
- Proxy: `/api/chat` → n8n Chat Trigger
- n8n Workflow: Chat Trigger (webhookId: `5ac9f61c`) → QA Chain → Qdrant (RAG) → OpenRouter LLM
- **Status:** ✅ Aktiv

#### Konfiguration:
- `.env`: `N8N_CHAT_WEBHOOK=https://n8n.zw-server.de/webhook/5ac9f61c-5f64-4a35-8c64-ffa85a6eedf5/chat`
- Chat Trigger: "Make Chat Publicly Available" = AN, Workflow Toggle = Active

---

### 2. Lead-Qualifizierung mit KI-Scoring

#### Frontend → Backend → n8n:
1. Nutzer klickt "Jetzt anfragen" → Form Modal öffnet sich
2. Felder: Name, Email, Firma (optional), Nachricht
3. Submit → `POST /api/submit-lead` → server.js Proxy → n8n Webhook
4. n8n: Webhook → Edit Fields → AI Agent → IF Node → Google Sheets (Hot/Cold Tabs)
5. Antwort (via Set-Node am Ende jedes Branches): `{ score: 0–10, type: "hot"|"cold", reason: "..." }`
6. Score ≥ 7 = HOT LEAD (rote Puls-Animation im Ergebnis)

#### n8n Webhook:
- **Node Type:** Webhook Trigger (POST, keine Auth)
- **Production URL:** `https://n8n.zw-server.de/webhook/2515b7bd-3c96-4da8-937e-8864c39a9299`
- **Edit Fields Node:** Mappt `body.Name → name`, `body.Email → email`, etc.
- **Workflow muss aktiv sein**

#### Payload (server.js → n8n):
```json
{ "Name": "Max Mustermann", "Email": "max@example.com", "Firma": "Firma XY", "Anfrage-Text": "..." }
```

#### In n8n Nodes zugreifen:
```
{{ $json.name }}  {{ $json.email }}  {{ $json.company }}  {{ $json.message }}
```

#### n8n AI Agent — Scoring-Logik:
- **Skala:** 0–10
- **Hot:** Score ≥ 7 (IF-Node Bedingung: `$json.output.score >= 7`)
- **Cold:** Score < 7
- **Ultimate Priority (9–10):** Menge > 1.000 Einheiten, Lieferzeit < 5 Tage, Großunternehmen, strategische IT-Projekte
- **Portfolio im Prompt:** Hardware + Software (Cloud Suite, Analytics, SecureGuard) + IT-Dienstleistungen
- **Structured Output:** JSON-Schema mit `score` (number), `type` (enum: hot/cold), `reason` (string)

#### Google Sheets:
- Hot Leads → Tab "HOT LEADS"
- Cold Leads → Tab "COLD LEADS"
- Spalten: Name, Email, Firma, Score, Zusammenfassung
- **Published URL (readonly):** `https://docs.google.com/spreadsheets/d/e/2PACX-1vQpMPKk5L8kYrle7xYrDCOhhAjhG9b-rkfhPt-ep9SHJIy_6iINAXQma5rkFCdqa4K18aBN5IwjL5SP/pubhtml`

**Status:** ✅ Aktiv

---

### 3. Design & UI

#### Farbschema (heute redesigned):
- **Modus:** Light Mode Standard, Dark Mode per Toggle (persistiert in localStorage)
- **Primary:** Royal Blue `#2563eb` / Dark `#1e40af`
- **Accent:** Sky `#0ea5e9`
- **Backgrounds:** `#ffffff` / `#f8fafc` / `#f1f5f9` (Light); `#0f172a` / `#1e293b` / `#334155` (Dark)
- **Fonts:** Inter (Text) + Space Grotesk (Headlines/Logo)

#### Sektionen:
1. **Header** — Fixed, Glassmorphism, Dark Mode Toggle, Nav + CTA, Lead Dashboard Link
2. **Hero** — 2-Column (Text +超大 "N" Logo Animation), Headline + Subtext + CTAs
3. **Über uns** — Stats (200+ Kunden, 12 J. Erfahrung, DSGVO), USPs, Bild
4. **Leistungen** — 5 Service Cards (3 oben, 2 unten zentriert) + Canvas Animation (verlangsamt, größere Partikel)
5. **Portfolio** — Tabs (Software/Hardware), Software Cards + Hardware Slider mit Links/Rechts Navigation
6. **Anfrage** — 2-Column: Links Form-Box (CTA → Modal), Rechts "AUTOMATION WORKFLOW" Accordion
7. **FAQ** — Accordion, 5 Fragen
8. **Karriere** — 6 Stellenausschreibungen + Initiativbewerbung CTA
9. **Footer** — 4-Spalten

#### Request Section (Recruiter-Demo Feature):
- **Links:** Styled Box (Royal Blue Border + Gradient Accent) mit "Jetzt anfragen" Button → öffnet Form Modal
- **Rechts:** Accordion mit "AUTOMATION WORKFLOW" Badge
  - Item 1: "So funktioniert's" — 4 Prozessschritte mit Icons
  - Item 2: "Lead Dashboard" — Link zu Google Sheets

#### Form Modal:
- Overlay-Pattern (`openFormModal()` / `closeFormModal()`)
- Felder: Name, Email, Firma (optional), Nachricht
- Result-States: HOT LEAD (rot, pulsierend, 3s auto-close) vs. kalt (grün, checkmark)
- Zeigt: Score, Typ, Begründung aus n8n AI Agent

#### Produkte (Software):
- NovaTech Cloud Suite (ab 299€/Mt.) — Multi-Cloud Dashboard
- NovaTech Analytics Platform (ab 199€/Mt.) — BI & Reporting
- NovaTech SecureGuard (ab 149€/Mt.) — Vulnerability Scanning

#### Produkte (Hardware — Slider):
- Laptops: ProBook Air 14, ProBook Studio 16, ProBook Gaming X15
- Monitore: ClearView Office 27, ClearView Ultra 32, ClearView Curved 34
- Zubehör: ErgoStand Pro, TypeMaster Wireless, PowerDock USB-C, SecureCase 15

#### Karriere-Sektion:
- 6 Stellen: Cloud Engineer, Full-Stack Dev (Node/React), IT-Consultant, IT-Security Analyst, IT-Support Techniker, Werkstudent Data Analyst
- Badges: Vollzeit / Teilzeit / Remote
- Angaben: Standort + Gehaltsrange pro Karte
- "Jetzt bewerben" → öffnet Form Modal
- Initiativbewerbung CTA am Ende der Sektion

---

## 🛠️ Technische Details

- **Frontend:** HTML5, CSS3 (Vanilla), JS (Fetch API, no framework)
- **Backend:** Node.js, Express, dotenv, cors — Port **3011**
- **Automation:** n8n (Chat Trigger + RAG Pipeline, Webhook Trigger für Leads)
- **KI-Stack:** OpenRouter (LLM) + Google Gemini Embeddings + Qdrant Vector Store

### server.js — In-Memory Lead Store:
```javascript
let leadsStore = [];  // max 50 Einträge
// POST /api/submit-lead → n8n → wenn score/type in Antwort: { success: true, lead: result }
// GET /api/leads/recent → gibt leadsStore zurück
// POST /api/chat → Chat Proxy
```

---

## ▶️ Server starten

```bash
cd "Novatech Landingpage"
node server.js
# → http://localhost:3011
```

### API Endpoints:
- `POST /api/submit-lead` — Lead → n8n → KI-Scoring
- `GET /api/leads/recent` — In-Memory Leads (max 50)
- `POST /api/chat` — n8n Chat Widget Proxy

---

## ⚠️ Vorfall: Gemini CLI Datei-Zerstörung (2025-04-30 / 2026-05-01)

Gemini CLI hat `index.html` durch mehrfache destruktive `WriteFile`-Aufrufe von ~2837 Zeilen auf 296 Zeilen reduziert und alle Sektionen, Styles und Features entfernt. Kein Git-Repo vorhanden, keine Backups. Die Datei wurde auf Basis des Claude CLI Chat-Protokolls vom selben Tag vollständig rekonstruiert.

**Lektion:** Vor jeder KI-Sitzung an einer Quelldatei: `cp index.html index.html.bak` oder Git-Repo anlegen.

---

## 📝 Daten-Basis
- `verkaufsdaten.csv` — Produkt- und Preisdaten
- `faq.md` & `website.md` — Chatbot-Wissenskontext
- `branchen_dokumente.md` — Beratungsszenarien

---
*AI Mastery Modul — 1. Monat*
## 🔜 Nächste Schritte
1. **UI/UX Optimierung** — Mit frontend-design Skill: Spacing-System (8pt Grid), Button Hover States, Scroll-Animationen
2. **Services Section** — 6. Card hinzufügen (Support) für symmetrisches Layout
3. **Chatbot testen** — @n8n/chat Widget via `/api/chat` Proxy prüfen, Response-Format verifizieren

---

**2026-05-02 Update:**
- Services Grid: 3-Spalten Layout (6-Spalten Grid für 3+2 Cards)
- Canvas Animation: Verlangsamt (vx/vy * 0.2), größere Partikel (r * 4 + 2.5), 50 statt 80 Nodes
- Overlay "IHRE IT. UNSER ANTRIEB" entfernt
- **Skill Installation:** frontend-design global installiert — Terminal neustart für Optimierung mit neuen Fähigkeiten

---
*Zuletzt aktualisiert: 2026-05-02 — Services Grid optimiert, Canvas verlangsamt, Overlay entfernt, frontend-design Skill installiert*

## 🔧 Entwicklungs-Protokoll (2026-05-02)

### Frontend-Design Optimierung
- **8pt Grid Spacing System** implementiert (--space-1 bis --space-12)
- **Premium Hover States** — Buttons mit shimmer Effekt, cubic-bezier transitions
- **Scroll Animationen** — fade-up Klasse mit IntersectionObserver, stagger delays (0.1s-0.5s)
- **Canvas Animation entfernt** — Leistungen Hintergrund-Animation komplett gelöscht
- **Services Sektion restrukturiert** — 6 Cards → 4 Power-Cards (2x2 Grid, übersichtlicher)
  - Cloud & Infrastruktur
  - Software-Lösungen
  - Data & Analytics
  - Security & Support

### Hardware Slider Optimierung
- **Bessere Produktbilder:**
  - ErgoStand Pro → Unsplash high-quality photo
  - SecureCase 15 → korrigiert auf funktionierende URL
- **Slider Navigation verbessert:**
  - Buttons vergrößert (52px) mit Scale Hover (1.12x)
  - Shimmer Overlay Effekt
  - Dots Indicators (3 Dots für 9 Cards)
  - Smooth Scrolling mit auto-update

### GitHub & Vercel Deployment
- **.gitignore erstellt** — .env, node_modules, Backups geschützt
- **.env.example erstellt** — Template für andere User
- **README.md erstellt** — Portfolio-ready mit vollständiger Dokumentation
- **GitHub Repo:** https://github.com/eeraj88/novatech-landingpage
- **Portfolio Integration:** NovaTech als Projekt #7 hinzugefügt (Multi-Kategorien: AI & Automation, Full-Stack)

### ⚠️ Vercel Deployment Probleme (GELÖST)
**Problem:** "Cannot GET /" / 404 Error auf Vercel
**Ursache:** Express Server + Vercel Serverless Functions Architektur-Konflikt

**Lösungsversuche:**
1. ❌ vercel.json mit builds/routes → 404
2. ❌ Serverless Functions (/api/*.js) → 404
3. ❌ vercel.json Rewrites → 404
4. ❌ public/ Ordner mit Rewrites → 404
5. ✅ **Vercel Express mit module.exports** → ERFOLGREICH

**Finale Lösung:**
```javascript
// server.js Ende
if (process.env.VERCEL) {
    module.exports = app;  // Vercel
} else {
    app.listen(PORT, () => ...);  // Lokal
}
```

```json
// vercel.json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/server.js" }
  ]
}
```

**Live URL:** https://novatech-landingpage.vercel.app

### Portfolio Updates
- **Multi-Kategorien Support** — Projekte können jetzt in mehreren Kategorien sein
- **NovaTech erweitert:** ["AI & Automation", "Full-Stack"]
- **Voice-to-CRM erweitert:** ["AI & Automation", "Full-Stack"]
- **Wetter-App erweitert:** ["React", "Frontend"]
- **Bookmark Manager erweitert:** ["React", "Frontend"]

### Datei-Struktur
```
├── index.html          # Single-Page Frontend
├── server.js           # Express Backend (Vercel + lokal)
├── public/
│   └── index.html      # Vercel Static Files
├── .env                # Environment Variables (nicht committen)
├── .env.example        # Template
├── .gitignore          # Git Ausschlüsse
├── vercel.json         # Vercel Konfiguration
├── package.json        # Dependencies
├── README.md           # Dokumentation
└── PROJEKT.md          # Diese Datei
```

---
*Entwicklungs-Protokoll: 2026-05-02 — Frontend-Optimierung + Vercel Deployment gelöst*
