"use client";

import React from "react";
import { Search, Users, Banknote, MapPin, Sparkles, ArrowRight } from "lucide-react";

interface CalculatorFormProps {
  budget: number;
  setBudget: (b: number) => void;
  persons: number;
  setPersons: (p: number) => void;
  city: string;
  setCity: (c: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const BUDGET_PRESETS = [1000, 1500, 2000, 2500, 3500];
const PERSON_PRESETS = [2, 3, 4, 5, 6];
const CITIES = ["Islamabad", "Rawalpindi", "Lahore", "Karachi"];

export function CalculatorForm({
  budget,
  setBudget,
  persons,
  setPersons,
  city,
  setCity,
  onSubmit,
  isLoading,
}: CalculatorFormProps) {
  const perHead = persons > 0 && budget > 0 ? Math.round(budget / persons) : 0;

  return (
    <form
      onSubmit={onSubmit}
      className="w-full bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 transition-all"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input 1: Total Budget */}
        <div className="space-y-2.5">
          <label className="flex items-center justify-between text-xs font-bold text-stone-700 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-emerald-600" />
              Total Budget (PKR)
            </span>
          </label>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-400 text-sm">
              Rs
            </span>
            <input
              type="number"
              min={100}
              step={50}
              value={budget || ""}
              onChange={(e) => setBudget(Number(e.target.value) || 0)}
              placeholder="e.g. 2000"
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 font-bold text-lg text-stone-900 tabular-nums transition-all"
            />
          </div>

          {/* Quick Budget Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {BUDGET_PRESETS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setBudget(val)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors tabular-nums ${
                  budget === val
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 hover:bg-stone-200/80 text-stone-600"
                }`}
              >
                {val.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Input 2: Number of People */}
        <div className="space-y-2.5">
          <label className="flex items-center justify-between text-xs font-bold text-stone-700 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-rose-600" />
              Number of People
            </span>
          </label>

          <div className="relative">
            <input
              type="number"
              min={1}
              max={20}
              value={persons || ""}
              onChange={(e) => setPersons(Number(e.target.value) || 1)}
              placeholder="e.g. 4"
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 font-bold text-lg text-stone-900 tabular-nums transition-all"
            />
          </div>

          {/* Quick Headcount Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {PERSON_PRESETS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setPersons(val)}
                className={`w-8 h-6 flex items-center justify-center text-xs font-semibold rounded-lg transition-colors tabular-nums ${
                  persons === val
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 hover:bg-stone-200/80 text-stone-600"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Input 3: City */}
        <div className="space-y-2.5">
          <label className="flex items-center justify-between text-xs font-bold text-stone-700 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              City
            </span>
          </label>

          <div className="relative">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 font-bold text-base text-stone-900 appearance-none transition-all cursor-pointer"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 font-medium text-xs">
              ▼
            </div>
          </div>

          {/* Real-time Per-Head Live Pill */}
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
              <span>Max target:</span>
              <strong className="text-stone-900 font-bold tabular-nums">
                Rs {perHead.toLocaleString()}
              </strong>
              <span>/ person</span>
            </span>
          </div>
        </div>
      </div>

      {/* CTA Button Bar */}
      <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-stone-500 text-center sm:text-left">
          Calculates combinations from real local restaurant menus & deals.
        </p>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto min-w-[200px] px-8 py-3.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold text-base rounded-2xl shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Matching Deals...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Find Food</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
