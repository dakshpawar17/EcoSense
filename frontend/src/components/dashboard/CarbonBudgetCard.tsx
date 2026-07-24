import React from "react";
import { Gauge } from "lucide-react";
import { MonthlyBudget } from "../../types";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface CarbonBudgetCardProps {
  budget: MonthlyBudget;
}

export const CarbonBudgetCard: React.FC<CarbonBudgetCardProps> = ({ budget }) => {
  const usedPct = Math.min(100, Math.round((budget.usedKg / budget.allowanceKg) * 100));

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100">Monthly Carbon Allowance Budget</h3>
        </div>
        <Badge variant={usedPct > 80 ? "amber" : "emerald"} size="sm">
          {usedPct}% Used
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-extrabold text-white">{budget.usedKg}</span>
            <span className="text-xs text-slate-400"> / {budget.allowanceKg} kg CO₂ target</span>
          </div>
          <div className="text-xs text-emerald-400 font-semibold">
            {budget.remainingKg} kg remaining
          </div>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              usedPct > 90
                ? "bg-rose-500"
                : usedPct > 70
                ? "bg-amber-400"
                : "bg-gradient-to-r from-emerald-500 to-teal-400"
            }`}
            style={{ width: `${usedPct}%` }}
          />
        </div>

        <p className="text-xs text-slate-400">
          Your current monthly carbon limit is set to {budget.allowanceKg} kg CO₂. You are pacing safely within your sustainable allowance.
        </p>
      </div>
    </Card>
  );
};
