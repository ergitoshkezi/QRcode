---
title: Deployment Strategy Decision
date: 2026-05-13
context: explore session — going live for restaurant QR ordering
---

# Deployment Strategy

## Decision

Deploy frontend to **Vercel** (free tier). No server/VPS needed.

## Rationale

- Stack is React+Vite SPA = static files only
- Backend is Supabase (already cloud-hosted) → no backend to deploy
- Only 2 env vars needed: `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- Vercel auto-detects Vite, free tier is sufficient
- Auto-deploy on `git push` = minimal operational overhead

## What Changes

- Before: `pnpm dev --host` + local IP in `.env.local` + phone on same WiFi
- After: public HTTPS URL accessible from any network, any device
- QR codes encode the Vercel URL automatically (no more local IP)

## Alternatives Considered

- Netlify (drag & drop): simpler but no auto-deploy on push
- Self-hosted VPS: rejected — no server wanted
- Docker (already has Dockerfile): useful if self-hosting in future
