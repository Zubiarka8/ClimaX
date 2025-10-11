# ClimaX

A full-stack weather application built with Vue.js frontend and Node.js backend with Prisma ORM.

## Project Structure

```
ClimaX/
├── src/
│   ├── frontend/          # Vue.js frontend application
│   └── backend/           # Node.js backend with Fastify and Prisma
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MySQL database (for backend)
- Docker and Docker Compose (for containerized setup)

## 🚀 Quick Start with Docker (Recommended)

The easiest way to run ClimaX is using Docker Compose, which sets up all services automatically:

### 1. Start All Services

```bash
docker compose up --build
```

### 2. Access the Application

- **Recommended**: http://localhost:8081 (Nginx Proxy - unified access point)
- Frontend only: http://localhost:8080
- Backend API only: http://localhost:3000
- MySQL: localhost:3307

### 3. API Usage

When using the proxy (recommended), all API calls should be prefixed with `/api/`:

```javascript
// ✅ Correct - Use /api/ prefix
fetch('http://localhost:8081/api/users')
fetch('http://localhost:8081/api/weather')

// ❌ Avoid - Direct backend access
fetch('http://localhost:3000/users')
```

### 4. Stop Services

```bash
docker compose down
```

## Manual Setup (Alternative)

If you prefer to run services manually without Docker:

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd src/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `src/backend` directory with your database configuration:

```env
DATABASE_URL="mysql://username:password@localhost:3306/climax_db"
```

Replace `username`, `password`, and `climax_db` with your actual database credentials and database name.

### 4. Database Setup

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start Backend Server

```bash
node index.js
```

The backend server will start on `http://localhost:3000`

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd src/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The frontend application will start on `http://localhost:5173` (default Vite port)

## Development Workflow

### Running Both Services

1. **Terminal 1 - Backend:**
   ```bash
   cd src/backend
   node index.js
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd src/frontend
   npm run dev
   ```

### Production Build

#### Backend
The backend is ready for production deployment. Make sure to set up your production database and environment variables.

#### Frontend
```bash
cd src/frontend
npm run build
```

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Fastify** - Web framework
- **Prisma** - Database ORM
- **MySQL** - Database

### Frontend
- **Vue.js 3** - Frontend framework
- **Vite** - Build tool and development server
- **JavaScript** - Programming language

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and static file serving

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Troubleshooting

### Prisma Client Issues
If you encounter "Prisma client did not initialize" errors:

1. Make sure you've run `npx prisma generate` in the backend directory
2. Check that your `.env` file has the correct `DATABASE_URL`
3. Ensure your database is running and accessible

### Port Conflicts
- **Docker setup**: Make sure ports 8081, 3000, 3307, and 8080 are not in use
- **Manual setup**: Backend runs on port 3000, Frontend runs on port 5173 by default (Vite)
- Change ports in the respective configuration files if needed

## API Endpoints

### Backend API
- `GET /` - Health check and database connection test
- `GET /api/` - API routes (when using proxy)

### Proxy Routes (Recommended)
- `GET /` - Frontend application
- `GET /api/*` - Backend API routes
- `GET /health` - Health check endpoint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request
