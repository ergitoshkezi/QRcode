---
title: Deploy to GitHub + Vercel
date: 2026-05-13
priority: high
---

# Deploy to GitHub + Vercel

Make the app publicly accessible so the admin can manage orders/menus/QR codes from any smartphone and customers can scan QR codes at tables.

## Steps

1. **Create GitHub repo**
   - Go to github.com → New repository
   - Name: `drinkqr` (or similar), set to private if preferred
   - Do NOT initialize with README (you have existing code)

2. **Push local code**
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit"
   git remote add origin https://github.com/<your-username>/drinkqr.git
   git push -u origin main
   ```

3. **Create Vercel account**
   - Go to vercel.com → Sign up (free, use GitHub login)

4. **Import project in Vercel**
   - New Project → Import from GitHub → pick `drinkqr`
   - Framework: Vite (auto-detected)
   - Build command: `pnpm build` (or `npm run build`)
   - Output dir: `dist`

5. **Set environment variables in Vercel UI**
   - `VITE_SUPABASE_URL` → copy from `.env.local`
   - `VITE_SUPABASE_ANON_KEY` → copy from `.env.local`

6. **Deploy**
   - Click Deploy → wait ~1 min
   - Get public URL: `https://drinkqr.vercel.app` (or similar)

7. **Verify**
   - Open URL on smartphone → login should work
   - QR codes generated now encode the public Vercel URL

## Notes

- Every `git push` triggers auto-redeploy (no manual steps)
- `.env.local` is gitignored — secrets never go to GitHub
- Custom domain can be added in Vercel settings for free
