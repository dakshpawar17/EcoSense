import React from "react";
import { TreePine, Fuel, Smartphone, CarFront } from "lucide-react";
import { EnvironmentalEquivalents } from "../../types";
import { Card } from "../ui/Card";

interface EnvironmentalEquivalentsCardProps {
  equivalents: EnvironmentalEquivalents;
}

export const EnvironmentalEquivalentsCard: React.FC<EnvironmentalEquivalentsCardProps> = ({ equivalents }) => {
  return (
    <Card className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <TreePine className="w-4 h-4 text-emerald-400" />
            Real-World Environmental Equivalents
          </h3>
          <p className="text-xs text-slate-400">
            Tangible real-world climate impact of your saved carbon emissions ({equivalents.co2SavedKg} kg CO₂ saved)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <TreePine className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-white">{equivalents.treesPlanted}</div>
            <div className="text-[11px] text-slate-400">Trees Planted / Yr</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-white">{equivalents.gasolineSavedGallons} gal</div>
            <div className="text-[11px] text-slate-400">Gasoline Saved</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-white">{equivalents.smartphoneChargesAvoided.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400">Phone Charges</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
            <CarFront className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-white">{equivalents.milesNotDriven} mi</div>
            <div className="text-[11px] text-slate-400">Miles Not Driven</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
