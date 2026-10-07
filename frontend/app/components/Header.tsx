"use client";

import React, { useEffect, useState } from "react";
import { UtensilsCrossed, CircleDot, Zap } from "lucide-react";

export function Header() {
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    // Check backend health
    fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ budget: 1000, persons: 2, city: "Islamabad" }),
    })
      .then((res) => {
        setIsBackendOnline(res.ok);
      })
      .catch(() => {
        setIsBackendOnline(false);
      });
  }, []);

  return (
    <header className="w-full border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center text-white shadow-xs">
            <UtensilsCrossed className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-stone-900">
                Budget<span className="text-rose-600">Bite</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-medium bg-stone-100 text-stone-600 rounded-md border border-stone-200">
                Student Utility
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden md:block">
              Group meal deal permutation calculator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-50 border border-stone-200 text-stone-600">
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendOnline === true
                  ? "bg-emerald-500 ring-4 ring-emerald-50"
                  : isBackendOnline === false
                  ? "bg-amber-500"
                  : "bg-stone-300 animate-pulse"
              }`}
            />
            <span className="text-[11px]">
              {isBackendOnline === true
                ? "Engine Ready"
                : isBackendOnline === false
                ? "Local Backend"
                : "Checking Engine"}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs text-stone-500 bg-stone-100/80 px-2.5 py-1 rounded-md">
            <Zap className="w-3.5 h-3.5 text-stone-600" />
            <span>Instant Results</span>
          </div>
        </div>
      </div>
    </header>
  );
}
