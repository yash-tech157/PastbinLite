# Pastebin Lite

A lightweight Pastebin-like application where users can create text pastes and share a link to view them.  
Supports optional time-based expiry (TTL) and view-count limits.

## Features
- Create a paste with optional TTL and max views
- Shareable URL for each paste
- Automatic expiry based on time or views
- Safe rendering (no script execution)
- Deterministic time testing support

## Tech Stack
- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js (Vercel Serverless Functions)
- Persistence: Vercel KV (Redis)
- Deployment: Vercel

## API Endpoints

### Health Check



