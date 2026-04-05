# Uni Help Desk System

A full-stack web application for University Help Desk — Resource & Library Management Module.

## Project Structure

```
Uni-Help-desk/
├── Backend/               # Express.js REST API (Node.js + MongoDB)
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/           # Uploaded resource files (auto-created)
│   ├── server.js
│   ├── .env.example       # Copy to .env and fill in your values
│   └── package.json
├── Frontend/              # React + Vite SPA (TailwindCSS)
│   ├── public/
│   ├── src/
│   │   ├── Components/    # Feature components (Student / Admin / Lecturer)
│   │   ├── Pages/
│   │   ├── services/      # API service layer (api.js)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js     # Includes dev proxy → backend :5000
│   ├── .env.example       # Copy to .env if overriding API URL for production
│   └── package.json
└── package.json           # Root scripts to run both together
```

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)

### 1. Install Dependencies

```bash
# From Uni-Help-desk/
npm run install:all
```

Or install separately:
```bash
cd Backend && npm install
cd ../Frontend && npm install
```

### 2. Configure Backend Environment

```bash
cd Backend
cp .env.example .env
# Edit .env and fill in MONGO_URI and JWT_SECRET
```

### 3. Run in Development

From the `Uni-Help-desk/` root:
```bash
npm run dev
```

This starts:
- 🚀 **Backend** on `http://localhost:5000`
- ⚡ **Frontend** on `http://localhost:5173` (with `/api` proxied to backend)

Or run them separately:
```bash
npm run dev:backend    # Backend only
npm run dev:frontend   # Frontend only
```

### 4. Build for Production

```bash
npm run build          # Builds Frontend → Frontend/dist/
```

> For production, set `VITE_API_URL` in `Frontend/.env` to your live backend URL.

## Portals

| Role     | URL                             |
|----------|----------------------------------|
| Student  | `http://localhost:5173/student`  |
| Admin    | `http://localhost:5173/admin`    |
| Lecturer | `http://localhost:5173/lecturer` |

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 19, Vite, TailwindCSS       |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB Atlas (Mongoose)          |
| Auth      | JWT (JSON Web Tokens)             |
