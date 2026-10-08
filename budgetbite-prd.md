# 🚀 BUDGETBITE - MASTER PRD & MONOREPO ARCHITECTURE

## 🤖 AI SYSTEM INSTRUCTIONS (READ FIRST)
You are an expert Full-Stack AI Developer. You are working in a **Monorepo Workspace**. 
Your strict operational boundaries are:
1. **Context Awareness:** Understand that `/frontend` and `/backend` are completely decoupled systems living in the same repository.
2. **Path Strictness:** Do NOT mix package managers. Run `npm/pnpm` commands ONLY inside `/frontend`. Run `pip/python` commands ONLY inside `/backend`.
3. **Execution Mode:** Do NOT attempt to build everything at once. Ask for user approval before moving from one phase to the next.

---

## 📖 1. PROJECT SCOPE & CORE LOOP
**BudgetBite** is a frictionless, single-purpose web utility for college students. 
*   **The Problem:** Groups of students struggle to figure out what food they can afford when pooling their money.
*   **The Solution:** User inputs: `Total Budget`, `Number of People`, `City`. 
*   **The Output:** The engine calculates `Max_Spend per head` and returns exact, actionable food combinations (e.g., "Buy 1 Family Deal from KFC, serves 4, saves Rs 150").

---

## 📂 2. MONOREPO DIRECTORY STRUCTURE
```text
budgetbite-monorepo/
├── frontend/                 # Hosted on Vercel
│   ├── package.json          # Next.js 14+ (App Router), React, Tailwind, Shadcn UI
│   ├── .env.local            # NEXT_PUBLIC_API_URL=http://localhost:8000
│   └── app/                  # UI and Frontend Routing
│
├── backend/                  # Hosted on Render/Koyeb
│   ├── requirements.txt      # Python 3.10+, FastAPI, Uvicorn, PyMongo
│   ├── .env                  # MONGODB_URI=...
│   ├── main.py               # FastAPI entry point
│   └── database.py           # MongoDB connection logic
│
└── budgetbite-prd.md         # This documentation file
```

---

## ⚙️ 3. BACKEND SPECIFICATIONS (/backend)
- **Framework:** Python FastAPI (for high-speed mathematical permutation logic).
- **Database:** MongoDB Atlas.
- **Database Schema:**
  - `restaurants` collection: `{ _id, name, city, area, logo_url }`
  - `menu_items` collection: `{ _id, restaurant_id, item_name, price, serving_size, type (Deal/Single) }`
- **Core API Endpoint:** `POST /api/v1/match`
  - Payload: `{ "budget": 2000, "persons": 4, "city": "Islamabad" }`
  - Logic: Calculate `per_head = budget / persons`. Fetch items from DB. Find permutations where `(serving_size >= persons)` AND `(price <= budget)`. Sort by closest match to total budget.
  - Response: JSON array of top 3 curated meal options.
- **CORS:** Must be configured to allow requests from the Next.js frontend domain (`localhost:3000` for dev).

---

## 🎨 4. FRONTEND SPECIFICATIONS (/frontend)
- **Framework:** Next.js (App Router).
- **UI Libraries:** Tailwind CSS + Shadcn UI (for fast, accessible, mobile-first components).
- **Design Vibe:** Clean, minimalist, similar to iLovePDF. No logins, no heavy dashboards.
- **State Management:** React useState / useTransition for handling loading states while fetching from the Python API.
- **UX Flow:**
  - Hero section with 3 inputs (Budget, People, City).
  - "Find Food" big CTA button.
  - Skeleton loader while API calculates.
  - Display 3 clean "Option Cards" showing the Restaurant, Items to Order, Total Price, and "Amount Saved".

---

## 📋 5. PHASE-WISE EXECUTION PLAN (FOR AI)
### Phase 1: Workspace Initialization
- Initialize the root directory.
- Create `/frontend` using `create-next-app`.
- Create `/backend` and set up a basic Python virtual environment with FastAPI and Uvicorn.
- WAIT FOR USER APPROVAL.

### Phase 2: Backend & Database (The Engine)
- Create MongoDB connection in `/backend`.
- Write a `seed.py` script to inject 5 dummy restaurants and 15 dummy menu items for testing.
- Develop the matching algorithm and expose the `POST /api/v1/match` endpoint.
- Test the endpoint locally using Swagger UI (`/docs`).
- WAIT FOR USER APPROVAL.

### Phase 3: Frontend (The Interface)
- Setup Tailwind and Shadcn inside `/frontend`.
- Build the Hero Input form.
- Write the API fetching logic to hit `http://localhost:8000/api/v1/match`.
- Design and render the Result Cards.
- WAIT FOR USER APPROVAL.

### Phase 4: Production Readiness (Completed)
- [x] Configure environment variables for Vercel (Frontend) and Render (Backend).
  - Provided `backend/.env.example` and `frontend/.env.example`.
- [x] Ensure CORS is strictly set to the production frontend URL with regex support for Vercel previews.
- [x] Configure Render deployment blueprint (`render.yaml`) and Vercel settings (`frontend/vercel.json`).
- [x] Production timeouts, error resilience, and healthcheck endpoints (`/healthz`, `/api/v1/health`).
- [x] Comprehensive deployment walkthrough created (`DEPLOYMENT.md`).
