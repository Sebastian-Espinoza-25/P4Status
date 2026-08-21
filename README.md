# P4Status

A lightweight web application for remotely monitoring the status of a self-hosted Perforce server.

P4Status receives periodic heartbeats from the machine hosting the Perforce server and displays whether the server is currently online, along with information about the latest Perforce changelist.

## Features

- Live Perforce server status
- Automatic heartbeat monitoring
- Latest changelist information
- Latest changelist author
- Latest changelist description
- Last heartbeat timestamp
- Responsive web interface
- PWA-style Home Screen support
- Automatic frontend and backend deployments through GitHub

## Architecture

P4Status consists of three main components:

```text
Perforce Server PC
       │
       │ Heartbeat every 15 minutes
       ▼
Cloudflare Worker API
       │
       │ Stores latest status
       ▼
Cloudflare KV
       │
       │ GET /status
       ▼
React Frontend
```

### Heartbeat

The computer hosting the Perforce server periodically sends a heartbeat to the backend.

The heartbeat includes:

- Latest changelist number
- User responsible for the latest change
- Changelist description
- Time of the latest change

The backend adds the current heartbeat timestamp before storing the status.

### Online Status

The server sends a heartbeat every **15 minutes**.

The backend considers the server online when the latest heartbeat is less than **25 minutes old**.

```text
Heartbeat age < 25 minutes
        ↓
      ONLINE

Heartbeat age >= 25 minutes
        ↓
      OFFLINE
```

The additional 10-minute window prevents a slightly delayed heartbeat from immediately marking the server as offline.

## Automatic Heartbeat Task

The heartbeat script runs automatically on the Perforce server computer using **Windows Task Scheduler**.

**Task name:**

```text
P4Server Heartbeat
```

**Interval:**

```text
Every 15 minutes
```

The task gathers the latest Perforce changelist information and sends it to the P4Status backend.

## Project Structure

```text
P4Status/
├── backend/
│   └── Cloudflare Worker API
│
├── frontend/
│   └── React + Vite web application
│
├── heartbeat/
│   └── Server heartbeat script
│
└── README.md
```

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite

**Backend**
- Cloudflare Workers
- Cloudflare KV
- TypeScript

**Server Integration**
- Perforce
- Windows Task Scheduler

**Deployment**
- GitHub
- Cloudflare Workers Builds

## Deployment

Both applications are automatically deployed from the `main` branch.

The repository uses separate build watch paths:

```text
frontend/* → Frontend deployment
backend/*  → Backend deployment
```

This allows frontend and backend changes to deploy independently.

## Development

### Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```

### Backend

```bash
cd backend
pnpm install
pnpm exec wrangler dev
```

Local secrets and environment variables should not be committed to Git.

## Status Flow

```text
Perforce server running
        │
        ▼
Windows scheduled task
        │
        │ every 15 min
        ▼
POST /heartbeat
        │
        ▼
Cloudflare Worker
        │
        ▼
Cloudflare KV
        │
        ▼
GET /status
        │
        ▼
P4Status Frontend
        │
        ├── ONLINE → animated green heart
        │
        └── OFFLINE → red offline indicator
```

## Purpose

P4Status was created as a small monitoring tool for a self-hosted Perforce server used during game development.

Instead of remotely connecting to the server machine to check whether it is running, P4Status provides a simple public dashboard showing the server's current availability and latest Perforce activity.