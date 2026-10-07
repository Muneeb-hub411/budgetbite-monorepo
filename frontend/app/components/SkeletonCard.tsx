import React from "react";

export function SkeletonCard() {
  return (
    <div className="w-full bg-white rounded-2xl border border-stone-200 p-6 shadow-xs animate-pulse flex flex-col justify-between h-[360px]">
      <div>
        {/* Header row */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-stone-200" />
            <div className="space-y-2">
              <div className="w-28 h-4 bg-stone-200 rounded-sm" />
              <div className="w-20 h-3 bg-stone-100 rounded-sm" />
            </div>
          </div>
          <div className="w-16 h-6 bg-stone-200 rounded-full" />
        </div>

        {/* Headline preview */}
        <div className="w-full h-4 bg-stone-100 rounded-sm mb-2" />
        <div className="w-3/4 h-4 bg-stone-100 rounded-sm mb-6" />

        {/* Items box */}
        <div className="p-3.5 bg-stone-50 rounded-xl space-y-2.5 border border-stone-100">
          <div className="flex justify-between items-center">
            <div className="w-36 h-3.5 bg-stone-200 rounded-sm" />
            <div className="w-14 h-3.5 bg-stone-200 rounded-sm" />
          </div>
          <div className="flex justify-between items-center">
            <div className="w-28 h-3.5 bg-stone-200 rounded-sm" />
            <div className="w-14 h-3.5 bg-stone-200 rounded-sm" />
          </div>
        </div>
      </div>

      {/* Footer financial row */}
      <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
        <div className="space-y-1">
          <div className="w-16 h-3 bg-stone-100 rounded-sm" />
          <div className="w-24 h-6 bg-stone-200 rounded-sm" />
        </div>
        <div className="w-24 h-9 bg-stone-200 rounded-lg" />
      </div>
    </div>
  );
}
