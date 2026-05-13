# DrinkQR 🍹

Menu digitale via QR code per bar e locali. Mobile-first, anonimo, frictionless.

## Stack
- **Frontend:** React 19 + TypeScript + Vite + TailwindCSS
- **UI:** Framer Motion + Lucide Icons
- **Backend:** Supabase (PostgreSQL + Storage)
- **Deploy:** Vercel

## Setup rapido

### 1. Clona e installa
```bash
git clone <repo>
cd drinkqr
pnpm install
```

### 2. Configura Supabase
1. Crea progetto su [supabase.com](https://supabase.com)
2. Vai in **SQL Editor** e lancia `supabase/schema.sql`
3. Crea bucket storage `drink-images` (public) — già incluso nello schema

### 3. Variabili d'ambiente
```bash
cp .env.example .env.local
# Inserisci VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY dal dashboard Supabase
```

### 4. Avvia
```bash
pnpm dev
# → http://localhost:5173
```

## Struttura progetto
```
src/
  components/
    ui/          # Button, Input, Skeleton, Toast, ErrorBoundary
    menu/        # DrinkCard, CategorySection
  pages/         # LandingPage, MenuPage, AdminDashboard, DrinkManager, QrManager
  layouts/       # AdminLayout
  hooks/         # useMenu, useQrValidator, useAdminData
  services/      # drinksService, qrService
  lib/           # supabase.ts, utils.ts
  types/         # index.ts
supabase/
  schema.sql     # Schema + RLS + sample data
```

## URL principali
| URL | Descrizione |
|-----|-------------|
| `/` | Landing page |
| `/q/:qrId` | Menu pubblico (es. `/q/QR001`) |
| `/admin` | Dashboard admin |
| `/admin/drinks` | Gestione bibite |
| `/admin/qr` | Gestione QR codes |

## Docker

### Build + run
```bash
# Con docker-compose (usa .env.local per le variabili)
docker compose up --build

# App disponibile su http://localhost:3000
```

### Build manuale
```bash
docker build \
  --build-arg VITE_SUPABASE_URL=https://xxx.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=your-key \
  -t drinkqr .

docker run -p 3000:80 drinkqr
```

> ⚠️ Le env var Supabase vengono iniettate **a build time** (non runtime) perché Vite le embeds nel bundle. Devi ribuilare l'immagine se cambiano.

## Deploy su Vercel
```bash
vercel --prod
# Aggiungi env vars nel dashboard Vercel:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
```

## Note importanti
- **Admin senza auth (v1):** URL `/admin` è pubblico. Aggiungere auth in v2.
- **QR codes** sono solo etichette testuali. Tutti mostrano lo stesso menu.
- **Pagamenti** avvengono fisicamente — nessuna transazione online.
- **Upload immagini** richiede che il bucket `drink-images` sia public su Supabase.

## v2 Roadmap
- Auth admin (Supabase Auth o env var)
- Menu per-QR (area VIP, terrazza, ecc.)
- Ordini digitali con realtime
- Multi-locale (SaaS)
- Analytics scan QR
- PWA installabile
