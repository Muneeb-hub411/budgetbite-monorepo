import os
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from database import get_database
from matcher import find_meal_matches

app = FastAPI(
    title="BudgetBite API",
    description="Mathematical permutation and meal recommendation engine for BudgetBite",
    version="1.0.0",
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MatchRequest(BaseModel):
    budget: float = Field(..., gt=0, description="Total budget in PKR (e.g. 2000)")
    persons: int = Field(..., gt=0, description="Number of people (e.g. 4)")
    city: str = Field(..., min_length=1, description="City name (e.g. Islamabad)")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "BudgetBite API",
        "docs": "/docs"
    }

@app.get("/api/v1/health")
def health_check():
    try:
        db = get_database()
        # Ping database
        db.command("ping")
        return {
            "status": "ok",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "degraded",
            "database_error": str(e)
        }

@app.get("/api/v1/cities")
def get_available_cities():
    """Returns distinct cities available in the database."""
    try:
        db = get_database()
        cities = db["restaurants"].distinct("city")
        return {"cities": cities}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/match")
def match_deals(payload: MatchRequest):
    """
    Computes per-head spend and finds top 3 curated food options
    where serving_size >= persons and price <= budget.
    """
    try:
        per_head = round(payload.budget / payload.persons, 2)
        matches = find_meal_matches(
            budget=payload.budget,
            persons=payload.persons,
            city=payload.city
        )

        return {
            "query": {
                "budget": payload.budget,
                "persons": payload.persons,
                "city": payload.city,
                "per_head_budget": per_head
            },
            "count": len(matches),
            "options": matches
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error computing meal matches: {str(e)}")
