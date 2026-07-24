import React from "react";
import { Leaf, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="font-semibold text-slate-200">EcoSense</span>
          <span>— AI Carbon Footprint Analyzer & Sustainability Coach</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-500">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for a greener, sustainable future</span>
        </div>
      </div>
    </footer>
  );
};
