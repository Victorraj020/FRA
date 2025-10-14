FRA Frontend (React + Vite)

Getting Started

1) Install dependencies
   npm install

2) Configure env
   Create frontend/.env (or .env.local) with:
   VITE_OCR_API_URL=http://localhost:8000/ocr   # direct to FastAPI
   # Or via Nginx reverse proxy
   # VITE_OCR_API_URL=http://localhost/api/ocr

3) Run dev server
   npm run dev
   # Vite is configured to run on http://localhost:8080

4) Build
   npm run build

5) Preview production build (optional)
   npm run preview

Notes

- Public assets are under frontend/public.
- App entry is frontend/src/main.tsx; routing in frontend/src/App.tsx.
- Vite dev server host/port configured in frontend/vite.config.ts (port 8080).
- Netlify functions example at frontend/netlify/functions.
