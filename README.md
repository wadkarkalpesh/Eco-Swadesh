# Deccan Origin - Monorepo Architecture 🌾⚡

Deccan Origin is an Enterprise Organic Agriculture, Bulk Tonnage Marketplace, FinTech Escrow Protection, IoT Cold-Chain Logistics, and AI Agronomy platform.

---

## 📁 Repository Directory Layout

```
Deccan-Origin/
├── Frontend/                 # Expo v54 React Native Mobile & Web Application
│   ├── app/                  # Expo Router file-based pages & screens
│   ├── components/           # Reusable UI Components
│   ├── constants/            # API contracts, theme design tokens & mock data
│   ├── context/              # Auth, Notification & Cart React contexts
│   ├── hooks/                # Custom React hooks
│   ├── services/             # Frontend services & Supabase integration
│   ├── utils/                # API Client SDK with mock fallback & utilities
│   ├── assets/               # Branding assets, fonts, icons
│   ├── app.json              # Expo application configuration
│   └── package.json          # Frontend dependency manifest
│
├── Backend/                  # Node.js / Express / Supabase API Server
│   ├── config/               # Database & service configurations
│   ├── controllers/          # Business logic handlers
│   ├── middleware/           # Auth JWT & validation middleware
│   ├── routes/               # REST API Endpoints (/v1/*)
│   ├── services/             # Agronomy, Escrow & IoT Services
│   ├── tests/                # Automated API Verification Suite (32 tests)
│   ├── supabase/             # Database migrations, schema.sql & seed.sql
│   ├── server.js             # Main Express server entry point
│   ├── Dockerfile            # Container definition
│   └── docker-compose.yml    # Docker orchestration setup
│
├── package.json              # Root workspace orchestrator
└── README.md                 # Project documentation
```

---

## 🚀 Quick Start Guide

### 1. Launching from Workspace Root

You can launch both the **Frontend** and **Backend** directly from the root workspace directory:

- **Start Backend API Server**:
  ```bash
  npm run start:backend
  ```
  *(Server runs at `http://localhost:5000/v1`)*

- **Start Backend in Dev Mode (Nodemon)**:
  ```bash
  npm run dev:backend
  ```

- **Run Backend Verification Test Suite**:
  ```bash
  npm run test:backend
  ```

- **Start Frontend (Expo App)**:
  ```bash
  npm run start:frontend
  ```

- **Start Frontend Web Version**:
  ```bash
  npm run dev:frontend
  ```

---

## 🛠️ Integration Safety

- The **Frontend** communicates with the **Backend** REST API via `Frontend/utils/apiClient.js`.
- By default, requests target `http://localhost:5000/v1` (or the URL set in `EXPO_PUBLIC_API_URL`).
- Built-in zero-crash network resilience ensures graceful fallback to offline mock data if the API server is unavailable during local mobile testing.
