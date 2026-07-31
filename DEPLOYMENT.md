# IBEN Studio — Production Deployment Guide (Option 1: Vercel + Render)

This manual outlines the production deployment procedure for hosting **IBEN Studio** using a decoupled architecture:
- **Frontend CDN**: [Vercel](https://vercel.com) (Static HTML, CSS, JavaScript, and Figma-grade animations)
- **Backend API**: [Render](https://render.com) (Node.js Express API & Persistent JSON / SQL Database)

---

## 1. Architecture Overview

```
       [ Client Browser / Mobile Device ]
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  FRONTEND (CDN) │     │  BACKEND (API)  │
│   iben.studio   │     │ api.iben.studio │
│  (Vercel Edge)  │     │  (Render Node)  │
└─────────────────┘     └─────────────────┘
         │                       ▲
         └────── /api/v1/* ──────┘
         (Vercel Rewrite Proxy — No CORS issues)
```

### Why This Stack?
1. **Zero CORS Issues**: The `vercel.json` rewrite proxy automatically forwards any frontend call to `/api/v1/*` directly to your Render API server.
2. **Global Edge Caching**: All static HTML, CSS tokens, and images are cached immutably across Vercel's global CDN.
3. **Persistent Data**: The Express API on Render uses an attached persistent disk so `iben-studio.json` is preserved across deployments and restarts.

---

## 2. Step 1: Deploy Backend API to Render

You can deploy automatically using the included `render.yaml` Blueprint or configure manually.

### Option A: Using `render.yaml` Blueprint (Recommended)
1. In your Render Dashboard, select **New** → **Blueprint**.
2. Connect your GitHub repository.
3. Render will detect [render.yaml](file:///c:/Users/HP/.gemini/antigravity-ide/scratch/irpen-studio-website/render.yaml) and automatically create the **`iben-studio-api`** Web Service and **`iben-studio-data`** persistent disk (1 GB).
4. Click **Apply**.

### Option B: Manual Web Service Setup
1. In Render, select **New** → **Web Service**.
2. Connect your GitHub repository and configure:
   - **Name**: `iben-studio-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `ALLOWED_ORIGINS` = `*`
4. *(Optional for persistence)* Under **Disks**, add a disk named `iben-studio-data` mounted at `/opt/render/project/src/server/data`.
5. Once deployed, copy your Render service URL (e.g., `https://iben-studio-api.onrender.com`).

---

## 3. Step 2: Configure Vercel Proxy URL

1. Open [vercel.json](file:///c:/Users/HP/.gemini/antigravity-ide/scratch/irpen-studio-website/vercel.json) in the root directory.
2. Verify the `rewrites` destination points to your Render backend URL:
   ```json
   "rewrites": [
     {
       "source": "/api/v1/:path*",
       "destination": "https://iben-studio-api.onrender.com/api/v1/:path*"
     }
   ]
   ```
   *(Replace `iben-studio-api.onrender.com` with your actual Render hostname if different).*

---

## 4. Step 3: Deploy Frontend to Vercel

1. Log into your [Vercel Dashboard](https://vercel.com) and click **Add New** → **Project**.
2. Import your GitHub repository.
3. Leave **Framework Preset** as `Other` (Vanilla static site).
4. Leave **Root Directory** as `./` (Project root).
5. Click **Deploy**.

Vercel will build your site in seconds and assign a live `.vercel.app` domain (or your custom `iben.studio` domain).

---

## 5. Step 4: Custom Domain & DNS Configuration (Optional)

To serve from a custom domain (`iben.studio` and `api.iben.studio`):
1. In **Vercel**, go to Project Settings → **Domains** and add `iben.studio` and `www.iben.studio`.
   - Add the required `A` or `CNAME` records in your DNS registrar (Cloudflare, Namecheap, GoDaddy, etc.).
2. In **Render**, go to your Service → **Custom Domains** and add `api.iben.studio`.
   - Create a `CNAME` record in your DNS registrar pointing `api.iben.studio` to your `.onrender.com` domain.
3. Once DNS propagates, update `vercel.json` destination to `https://api.iben.studio/api/v1/:path*`.

---

## 6. Verification Checklist

After deploying to production, run the following verification checks:

- [ ] **1. Clean HTML Navigation**:
  - Visit `https://your-domain.vercel.app/disciplines` (without `.html`) and verify Vercel serves `disciplines.html` cleanly.
- [ ] **2. Figma Micro-Animations**:
  - Hover over discipline cards and verify the radial gold spotlight follows your cursor.
  - Hover over CTAs and verify the magnetic sheen effect.
- [ ] **3. Responsive Scaling**:
  - Test on mobile (iPhone/Android) and ultra-wide screens; verify typography scales fluidly using `clamp()`.
- [ ] **4. API Health Proxy**:
  - Open `https://your-domain.vercel.app/api/v1/health` in your browser.
  - Verify it returns `{"success": true, "status": "ONLINE", ...}` from Render.
- [ ] **5. Form & Estimator Submissions**:
  - Submit a test commission on `/contact.html` and verify `#INQ-` ID is generated and stored in the database.
