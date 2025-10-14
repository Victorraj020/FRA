## FRA Portal – Technical Stack Overview

### Overview
This project is a Vite + React (TypeScript) single-page application with a small Node/Express API for local development and a Netlify Function for production/serverless. It includes a floating chatbot powered by Google Gemini that auto-opens after 10 seconds on any page.

### Frontend
- **Framework**: React 18 with TypeScript
- **Build tool**: Vite 5 (dev on port 8080)
- **Styling**: Tailwind CSS + `tailwindcss-animate`
- **UI primitives**: Radix UI; shadcn-style components under `src/components/ui`
- **Routing**: `react-router-dom` v6
- **State/data**: TanStack Query (`@tanstack/react-query`)
- **Internationalization**: `i18next` + `react-i18next` with translations in `src/locales/*`
- **Charts**: Recharts
- **Maps**: Leaflet + React Leaflet

Key frontend files:
- `frontend/src/App.tsx`: Routing composition and global providers; mounts `ChatWidget`
- `frontend/src/components/ChatWidget.tsx`: Floating chat UI; auto-opens after 10s
- `frontend/src/services/geminiChat.ts`: Client service; uses `/api/gemini-chat` in dev and Netlify function in prod
- `frontend/vite.config.ts`: Aliases, dev server, and `/api` proxy

### Local Development Backend (API)
- **Server**: Node + Express (no DB)
- **Entry**: `frontend/api-server.mjs`
- **Endpoint**: `POST /api/gemini-chat`
- **Port**: 3001 by default (override with `API_PORT`)
- **Purpose**: Proxy chat requests to Gemini and keep keys off the browser

### Production/Serverless Backend
- **Platform**: Netlify Functions
- **Function**: `frontend/netlify/functions/gemini-chat.ts`
- **Endpoint**: `/.netlify/functions/gemini-chat`
- **Build**: Controlled via root `netlify.toml` (build base `frontend`)

### AI Integration
- **Model**: Google Gemini 1.5 Flash (`generateContent` API)
- **Request shape**: Transforms app chat history into Gemini `contents` with `parts.text`
- **Response handling**: Extracts the first candidate’s `content.parts[].text` and returns `reply`

### Chatbot Behavior
- Floating button in the bottom-right
- Auto-opens after 10 seconds on first page view with a welcome message
- Maintains minimal in-session history; sends batched messages to backend
- Falls back gracefully with a short error message if the API fails

### Running Locally
1) Install dependencies (from `frontend`):
```bash
npm i
```
2) Start the UI (port 8080) in one terminal:
```bash
npm run dev
```
3) Start the local API (port 3001) in another terminal:
```bash
npm run dev:api
```
4) Visit `http://localhost:8080` and open the chatbot. The UI proxies `/api/*` to `http://localhost:3001`.

Optional one-command startup (if your shell already has the key set):
```bash
npm run dev:all
```

### Configuration & Secrets
- For convenience in local dev, `api-server.mjs` and the Netlify function include a fallback hardcoded Gemini key.
- For production, set `GEMINI_API_KEY` and remove the hardcoded fallback.
  - Netlify: Site settings → Environment variables
  - Local: Use a `.env` loaded by `dotenv` or set in your shell

### Important Scripts (in `frontend/package.json`)
- `dev`: Start Vite dev server
- `dev:api`: Start local Express API on port 3001
- `dev:all`: Run both UI and API in parallel (requires key available to shell)
- `build`: Production build
- `preview`: Preview built assets

### Ports
- UI: 8080 (Vite)
- API: 3001 (Express); configurable via `API_PORT`

### Request Flow
```text
ChatWidget → (frontend) sendChat →
  (dev)  /api/gemini-chat  → Express proxy → Gemini API → reply
  (prod) /.netlify/functions/gemini-chat → Netlify Fn → Gemini API → reply
```

### Notable Libraries
- `@tanstack/react-query`, `react-router-dom`, `i18next`, `recharts`, `leaflet`, `react-leaflet`, `radix-ui`, `tailwindcss`

### Future Improvements
- Stream responses (SSE) for faster perceived latency
- Conversation persistence (localStorage or backend)
- Role-guided prompts per page/route
- Rate limiting and safety filters at the API layer


