# Frontend-Backend Connection Guide

This guide explains how to connect the React frontend with the FastAPI backend.

## Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd fra-vista-dash-main-new/backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**:
   ```bash
   cp env.example .env
   # Edit .env file with your settings
   ```

4. **Start the backend server**:
   ```bash
   python start.py
   ```
   
   The backend will be available at: `http://localhost:8000`

## Frontend Configuration

1. **Update API endpoints** in your frontend services:

   In `frontend/src/services/geminiChat.ts`, update the endpoint:
   ```typescript
   const endpoint = import.meta.env.DEV ? "http://localhost:8000/api/v1/ai/chat" : "/.netlify/functions/gemini-chat";
   ```

2. **Create API service** for backend communication:
   ```typescript
   // frontend/src/services/api.ts
   const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:8000/api/v1' : '/api/v1';
   
   export const api = {
     auth: {
       login: (credentials) => fetch(`${API_BASE_URL}/auth/login`, { ... }),
       register: (userData) => fetch(`${API_BASE_URL}/auth/register`, { ... }),
       me: () => fetch(`${API_BASE_URL}/auth/me`, { ... })
     },
     applications: {
       list: () => fetch(`${API_BASE_URL}/applications`, { ... }),
       create: (data) => fetch(`${API_BASE_URL}/applications`, { ... }),
       get: (id) => fetch(`${API_BASE_URL}/applications/${id}`, { ... })
     }
     // ... other endpoints
   };
   ```

3. **Update CORS settings** in backend if needed:
   ```python
   # In backend/app/core/config.py
   ALLOWED_ORIGINS = [
       "http://localhost:3000",
       "http://localhost:5173",  # Vite default port
       "http://127.0.0.1:3000",
       "http://127.0.0.1:5173"
   ]
   ```

## API Integration Examples

### Authentication
```typescript
// Login
const response = await fetch('http://localhost:8000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    username: 'your-username',
    password: 'your-password'
  })
});
const { access_token } = await response.json();

// Use token in subsequent requests
const headers = {
  'Authorization': `Bearer ${access_token}`,
  'Content-Type': 'application/json'
};
```

### FRA Applications
```typescript
// Create application
const application = await fetch('http://localhost:8000/api/v1/applications', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    application_type: 'individual',
    applicant_name: 'John Doe',
    address: '123 Main St',
    state: 'Odisha',
    district: 'Angul',
    village: 'Sample Village',
    claim_description: 'Land rights claim...'
  })
});

// Get applications
const applications = await fetch('http://localhost:8000/api/v1/applications', {
  headers
});
```

### Document Upload
```typescript
// Upload document
const formData = new FormData();
formData.append('file', file);
formData.append('document_type', 'identity_proof');
formData.append('application_id', '123');

const upload = await fetch('http://localhost:8000/api/v1/documents/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${access_token}` },
  body: formData
});
```

## Environment Variables

Create `.env` file in frontend root:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Forest Rights Administration Portal
```

## Development Workflow

1. **Start backend**: `cd backend && python start.py`
2. **Start frontend**: `cd frontend && npm run dev`
3. **Access frontend**: `http://localhost:5173`
4. **Access backend API docs**: `http://localhost:8000/docs`

## Production Deployment

1. **Backend**: Deploy to your preferred hosting (Heroku, AWS, etc.)
2. **Frontend**: Update API_BASE_URL to production backend URL
3. **CORS**: Update ALLOWED_ORIGINS in backend config

## Troubleshooting

- **CORS errors**: Check ALLOWED_ORIGINS in backend config
- **Connection refused**: Ensure backend is running on port 8000
- **Authentication errors**: Check JWT token format and expiration
- **File upload issues**: Check MAX_FILE_SIZE and UPLOAD_DIRECTORY settings

## API Documentation

Once backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`
