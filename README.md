# Adapt Diet

A full-stack diet planning web application with real-time chat support.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Django 5, Django REST Framework, Django Channels
- **Real-time**: WebSockets for visitor-admin chat
- **Image Processing**: Pillow

## Project Structure

```
Adapt_diet/
├── client/          # Next.js frontend
└── server/          # Django backend
```

## Setup Instructions

### Backend Setup

```bash
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file and configure
cp .env.example .env

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

For WebSocket support, run with Daphne:
```bash
daphne config.asgi:application
```

### Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Run development server
npm run dev
```

### Redis (for WebSocket Channel Layer)

```bash
# Using Docker
docker run -p 6379:6379 redis:alpine
```

## Environment Variables

### Backend (server/.env)
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (True/False)
- `ALLOWED_HOSTS` - Comma-separated allowed hosts
- `CORS_ALLOWED_ORIGINS` - Frontend origin (e.g., http://localhost:3001)
- `REDIS_URL` - Redis connection URL

### Frontend (client/.env.local)
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (e.g., http://localhost:8000/api)
- `NEXT_PUBLIC_WS_URL` - WebSocket URL (e.g., ws://localhost:8000/ws)

## Features

### Public Website
- Home page with hero, benefits, and featured plans
- About page with mission and approach
- How It Works page with step-by-step guide
- Plans/Programs page with dynamic content from backend
- Contact page with lead capture form
- Real-time chat widget for visitor support

### Admin Dashboard
- Custom login (no Django admin UI)
- Plans management (CRUD with image upload)
- Leads viewer
- Real-time chat inbox with visitor messaging

## API Endpoints

### Authentication
- `POST /api/auth/login/` - Admin login
- `POST /api/auth/refresh/` - Refresh JWT token
- `GET /api/auth/me/` - Get current user info

### Plans
- `GET /api/plans/` - List active plans (public)
- `GET /api/plans/<slug>/` - Plan detail (public)
- Admin CRUD endpoints under `/api/plans/admin/`

### Leads
- `POST /api/leads/` - Submit contact form (public)
- `GET /api/leads/admin/` - List leads (admin)

### Chat
- `POST /api/chat/session/` - Create/get session
- `GET /api/chat/session/<id>/messages/` - Get messages
- Admin endpoints under `/api/chat/admin/`

### WebSockets
- `ws/chat/<session_id>/` - Visitor chat
- `ws/admin/chat/` - Admin chat dashboard
