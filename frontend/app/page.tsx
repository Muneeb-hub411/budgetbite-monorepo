"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Header } from "./components/Header";
import { CalculatorForm } from "./components/CalculatorForm";
import { ResultCard } from "./components/ResultCard";
import { SkeletonCard } from "./components/SkeletonCard";
import { MatchResponse, MatchOption } from "./types";
import { Utensils, AlertCircle, Sparkles, TrendingUp, HelpCircle } from "lucide-react";

export default function Home() {
  const [budget, setBudget] = useState<number>(2000);
  const [persons, setPersons] = useState<number>(4);
  const [city, setCity] = useState<string>("Islamabad");

  const [results, setResults] = useState<MatchResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const performMatch = async (b: number, p: number, c: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          budget: b,
          persons: p,
          city: c,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to calculate meal matches");
      }

      const data: MatchResponse = await response.json();
      setResults(data);
      setHasSearched(true);
    } catch (err: any) {
      setError(err?.message || "Could not connect to matching server");
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial match on page load with default values (2000 budget, 4 persons)
  useEffect(() => {
    performMatch(2000, 4, "Islamabad");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performMatch(budget, persons, city);
  };

  const handleScenario = (testBudget: number, testPersons: number) => {
    setBudget(testBudget);
    setPersons(testPersons);
    performMatch(testBudget, testPersons, city);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-10">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Frictionless Student Food Matching</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-[1.1]">
            Pool your money. <br className="hidden sm:inline" />
            Find what you can afford.
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-lg mx-auto">
            Input your group’s total pooled budget and headcount. The engine
            computes exact deals and permutations so nobody overpays.
          </p>

          {/* Quick preset scenario pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-stone-400 font-medium">Quick Test:</span>
            <button
              type="button"
              onClick={() => handleScenario(2000, 4)}
              className="px-2.5 py-1 rounded-md bg-stone-200/70 hover:bg-stone-300 text-stone-700 font-medium transition-colors cursor-pointer"
            >
              4 People • Rs 2,000
            </button>
            <button
              type="button"
              onClick={() => handleScenario(1000, 2)}
              className="px-2.5 py-1 rounded-md bg-stone-200/70 hover:bg-stone-300 text-stone-700 font-medium transition-colors cursor-pointer"
            >
              2 People • Rs 1,000
            </button>
            <button
              type="button"
              onClick={() => handleScenario(3500, 6)}
              className="px-2.5 py-1 rounded-md bg-stone-200/70 hover:bg-stone-300 text-stone-700 font-medium transition-colors cursor-pointer"
            >
              6 People • Rs 3,500
            </button>
          </div>
        </div>

        {/* The Hero Calculator Bar */}
        <CalculatorForm
          budget={budget}
          setBudget={setBudget}
          persons={persons}
          setPersons={setPersons}
          city={city}
          setCity={setCity}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
            <div>
              <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
                <Utensils className="w-5 h-5 text-stone-700" />
                <span>Recommended Food Options</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Top 3 meal permutations satisfying your group size and budget limit
              </p>
            </div>

            {results?.query && !isLoading && (
              <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg font-medium">
                <span>Budget: Rs {results.query.budget.toLocaleString()}</span>
                <span>•</span>
                <span>{results.query.persons} persons</span>
                <span>•</span>
                <span className="text-stone-900 font-bold">
                  Rs {results.query.per_head_budget.toLocaleString()}/head max
                </span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Error finding options</p>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {/* Actual Results Cards */}
          {!isLoading && results && results.options.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {results.options.map((option, idx) => (
                <ResultCard key={option.id || idx} option={option} index={idx} />
              ))}
            </div>
          )}

          {/* Empty / No Matches State */}
          {!isLoading && results && results.options.length === 0 && (
            <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center space-y-4 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">
                  No direct meal matches found
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Rs {budget} isn't quite enough for {persons} people in {city}.
                  Try increasing your pooled budget by Rs 200–500 or adjusting the headcount.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBudget(budget + 300)}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Try Rs {(budget + 300).toLocaleString()} instead
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-stone-200 bg-white py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center sm:flex sm:justify-between sm:items-center text-xs text-stone-500">
          <p>© BudgetBite — Frictionless meal deal finder for students.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px] text-stone-400">
            FastAPI Engine + Next.js App Router
          </p>
        </div>
      </footer>
    </div>
  );
}
