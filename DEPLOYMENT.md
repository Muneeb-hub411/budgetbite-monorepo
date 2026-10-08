# 🚀 BudgetBite Production Deployment Guide

This guide covers deploying **BudgetBite** to production using **Render** (Backend API & Matching Engine) and **Vercel** (Next.js 14+ Frontend), connected to **MongoDB Atlas**.

---

## 🏗️ Architecture Overview

| Component | Platform | Tech Stack | Root Directory | Environment Variables |
| :--- | :--- | :--- | :--- | :--- |
| **Backend API** | [Render](https://render.com) | FastAPI + Uvicorn + Python 3.10 | `backend/` | `MONGODB_URI`, `DB_NAME`, `ALLOWED_ORIGINS` |
| **Frontend UI** | [Vercel](https://vercel.com) | Next.js 14+ App Router + React | `frontend/` | `NEXT_PUBLIC_API_URL`, `BACKEND_API_URL` |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) | MongoDB Cluster | N/A | Included in `MONGODB_URI` |

---

## 🗄️ Step 1: MongoDB Atlas Preparation

1. Log into your **MongoDB Atlas** dashboard.
2. Under **Security > Network Access**:
   - Ensure IP Access List includes `0.0.0.0/0` (Allow Access from Anywhere) so Render's cloud servers can connect to the database.
3. Under **Security > Database Access**:
   - Ensure a database user exists with read & write permissions on database `budgetbite`.
4. Copy your connection string in the format:
   ```text
   mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/?retryWrites=true&w=majority
   ```
5. *(Optional)* Seed initial restaurants & menu items if you haven't already:
   ```bash
   cd backend
   python seed.py
   ```

---

## ⚙️ Step 2: Deploy Backend to Render

### Option A: 1-Click Blueprint Deploy (Recommended)
Because the repository includes `render.yaml`, Render can configure the service automatically:
1. Go to [Render Dashboard > Blueprints](https://dashboard.render.com/blueprints).
2. Connect your GitHub repository: `budgetbite-monorepo`.
3. Render will detect `render.yaml`.
4. Provide the value for `MONGODB_URI` and `ALLOWED_ORIGINS` when prompted.
5. Click **Apply**.

### Option B: Manual Web Service Setup
1. In Render Dashboard, click **New + > Web Service**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Name:** `budgetbite-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Region:** Frankfurt (EU Central) or Oregon (US West)
   - **Branch:** `main` (or your deployment branch)
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path:** `/api/v1/health`
4. Add **Environment Variables**:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net` | MongoDB Atlas URI |
   | `DB_NAME` | `budgetbite` | Database Name |
   | `ALLOWED_ORIGINS` | `https://your-frontend.vercel.app,http://localhost:3000` | Frontend domains |
   | `ALLOWED_ORIGIN_REGEX` | `^https:\/\/.*\.vercel\.app$` | Allows Vercel preview URLs |
   | `PYTHON_VERSION` | `3.10.12` | Python version |
5. Click **Deploy Web Service**.
6. Once deployed, copy your backend URL:
   `https://budgetbite-backend.onrender.com`

---

## 🎨 Step 3: Deploy Frontend to Vercel

1. Log into [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... > Project**.
2. Import your GitHub repository: `budgetbite-monorepo`.
3. In the project configuration modal:
   - **Framework Preset:** Next.js
   - **Root Directory:** Click *Edit* and select **`frontend`** (Critical).
4. Expand **Environment Variables** and add:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://budgetbite-backend.onrender.com` | Your Render backend URL |
   | `BACKEND_API_URL` | `https://budgetbite-backend.onrender.com` | Server-to-server route URL |
5. Click **Deploy**.
6. Vercel will build and assign a domain:
   `https://budgetbite.vercel.app`

---

## 🔄 Step 4: Finalize CORS on Render

Once your Vercel deployment URL is generated:
1. Return to **Render > budgetbite-backend > Environment**.
2. Update `ALLOWED_ORIGINS` to include your exact Vercel production domain:
   ```text
   https://budgetbite.vercel.app,http://localhost:3000
   ```
3. Save changes (Render will automatically re-deploy in seconds).

---

## ✅ Step 5: Verification & Smoke Test

1. **Verify Backend Health:**
   ```bash
   curl https://budgetbite-backend.onrender.com/api/v1/health
   # Expected response: {"status": "ok", "database": "connected"}
   ```

2. **Verify City List:**
   ```bash
   curl https://budgetbite-backend.onrender.com/api/v1/cities
   # Expected response: {"cities": ["Islamabad", ...]}
   ```

3. **Verify Match Engine:**
   ```bash
   curl -X POST https://budgetbite-backend.onrender.com/api/v1/match \
     -H "Content-Type: application/json" \
     -d '{"budget": 2000, "persons": 4, "city": "Islamabad"}'
   ```

4. **Verify Frontend End-to-End:**
   - Visit `https://budgetbite.vercel.app`
   - Select Budget (Rs 2,000), Persons (4), City (Islamabad).
   - Click **Find Best Food Options**.
   - Check that the 3 curated option cards load immediately with calculated savings and item combinations.
