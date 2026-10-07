"use client";

import React, { useState } from "react";
import { MatchOption } from "../types";
import { Check, Copy, Users, Sparkles, ShoppingBag, ArrowUpRight } from "lucide-react";

interface ResultCardProps {
  option: MatchOption;
  index: number;
}

export function ResultCard({ option, index }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const getRankBadge = (idx: number) => {
    switch (idx) {
      case 0:
        return {
          label: "Best Budget Fit",
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case 1:
        return {
          label: "Runner-Up Value",
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
      default:
        return {
          label: "Alternative Option",
          className: "bg-stone-100 text-stone-700 border-stone-200",
        };
    }
  };

  const badge = getRankBadge(index);

  const handleCopyOrder = () => {
    const itemsText = option.items
      .map((it) => `${it.quantity}x ${it.name}`)
      .join(" + ");

    const textToCopy = `🍔 BudgetBite Order from ${option.restaurant.name}:\nItems: ${itemsText}\n👥 Serves: ${option.total_servings} people (Rs ${option.cost_per_person.toFixed(0)}/head)\n💰 Total Bill: Rs ${option.total_price.toLocaleString()} (Saves Rs ${option.amount_saved.toLocaleString()})\n📍 Branch: ${option.restaurant.area}, ${option.restaurant.city}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200/90 hover:border-stone-400/80 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden">
      {/* Top Banner Accent */}
      <div className={`h-1.5 w-full ${index === 0 ? "bg-rose-500" : index === 1 ? "bg-amber-500" : "bg-stone-400"}`} />

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header with Restaurant & Badge */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-800 text-base shadow-xs overflow-hidden shrink-0">
                {option.restaurant.logo_url ? (
                  <img
                    src={option.restaurant.logo_url}
                    alt={option.restaurant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to initial
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  option.restaurant.name.charAt(0)
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-stone-900 tracking-tight leading-tight">
                  {option.restaurant.name}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {option.restaurant.area} • {option.restaurant.city}
                </p>
              </div>
            </div>

            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full border shrink-0 ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>

          {/* Actionable Headline */}
          <div className="mb-4 bg-stone-50 rounded-xl p-3 border border-stone-100">
            <p className="text-xs font-medium text-stone-700 leading-relaxed">
              {option.headline}
            </p>
          </div>

          {/* Breakdown of what to order */}
          <div className="mb-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-400 uppercase tracking-wider px-1">
              <span>Items to Order</span>
              <span>Subtotal</span>
            </div>

            <div className="space-y-1.5">
              {option.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50/70 hover:bg-stone-50 border border-stone-100 text-sm transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-stone-900 text-white font-mono text-xs font-bold shrink-0">
                      {item.quantity}×
                    </span>
                    <span className="font-medium text-stone-800 truncate text-xs sm:text-sm">
                      {item.name}
                    </span>
                    {item.type === "Deal" && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded shrink-0">
                        Deal
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-stone-700 tabular-nums text-xs sm:text-sm shrink-0">
                    Rs {item.total_price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Bottom Section */}
        <div>
          <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-3 mb-4">
            <div>
              <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
                Total Bill
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-stone-900 tabular-nums tracking-tight">
                  Rs {option.total_price.toLocaleString()}
                </span>
              </div>
              <span className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-stone-400" />
                <span>
                  <strong className="text-stone-700 font-semibold tabular-nums">
                    Rs {option.cost_per_person.toFixed(0)}
                  </strong>{" "}
                  / head
                </span>
              </span>
            </div>

            <div className="flex flex-col items-end justify-center">
              <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block text-right">
                Savings
              </span>
              <div className="mt-0.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span>+Rs {option.amount_saved.toLocaleString()} left</span>
              </div>
              <span className="text-[11px] text-stone-400 mt-1">
                Serves {option.total_servings} people
              </span>
            </div>
          </div>

          {/* Copy Button for Students WhatsApp */}
          <button
            type="button"
            onClick={handleCopyOrder}
            className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-stone-900 hover:bg-stone-800 text-white active:scale-[0.99]"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Copied for WhatsApp Group!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-300" />
                <span>Copy Order for WhatsApp</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
