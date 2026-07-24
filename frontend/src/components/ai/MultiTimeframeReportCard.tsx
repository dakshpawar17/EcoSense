import React, { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Sparkles, TrendingDown, Calendar, ArrowRight, ShieldCheck, Leaf } from "lucide-react";
import { telemetryService } from "../../services/api";

interface MultiTimeframeData {
  timeframe: "daily" | "weekly" | "monthly";
  totalCo2Kg: number;
  co2SavedVsCar: number;
  topMode: string;
  insights: string[];
  forecastNextPeriodCo2Kg: number;
  recommendations: Array<{ title: string; description: string; impact_saved: number }>;
}

export const MultiTimeframeReportCard: React.FC = () => {
  const [activeTimeframe, setActiveTimeframe] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [data, setData] = useState<MultiTimeframeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async (tf: "daily" | "weekly" | "monthly") => {
    setIsLoading(true);
    try {
      const res = await telemetryService.getMultiTimeframeSummary(tf);
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.warn("Failed to fetch multi-timeframe summary:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(activeTimeframe);
  }, [activeTimeframe]);

  return (
    <Card glow className="bg-slate-900 border-slate-800 p-6 space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            AI Multi-Timeframe Carbon Summary
          </h2>
          <p className="text-xs text-slate-400">
            Groq Llama 3.3 historical breakdown & proactive future emission forecast
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(["daily", "weekly", "monthly"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTimeframe === tf
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Synthesizing {activeTimeframe} AI analytics...</p>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Key Metric Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="text-xs font-medium text-slate-400 uppercase">Total {activeTimeframe} Footprint</div>
              <div className="text-2xl font-black text-white mt-1">{data.totalCo2Kg} <span className="text-xs font-normal text-slate-400">kg CO₂</span></div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <Leaf className="w-3 h-3" /> Top: {data.topMode.toUpperCase()}
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="text-xs font-medium text-slate-400 uppercase">CO₂ Offset Saved vs Car</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">-{data.co2SavedVsCar} <span className="text-xs font-normal text-emerald-400/80">kg CO₂</span></div>
              <div className="text-[11px] text-slate-400 mt-1">From active walking/biking</div>
            </div>

            <div className="bg-gradient-to-br from-indigo-950/40 to-slate-950 p-4 rounded-xl border border-indigo-500/30">
              <div className="text-xs font-semibold text-indigo-400 uppercase flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" /> AI Forecast (Next {activeTimeframe})
              </div>
              <div className="text-2xl font-black text-indigo-200 mt-1">{data.forecastNextPeriodCo2Kg} <span className="text-xs font-normal text-indigo-300">kg CO₂</span></div>
              <div className="text-[11px] text-indigo-400/80 mt-1 font-medium">Predicted ~8% reduction target</div>
            </div>
          </div>

          {/* AI Insights List */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Insights & Trends</h4>
            <div className="space-y-2">
              {data.insights.map((insight, idx) => (
                <div key={idx} className="bg-slate-950/40 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Opportunities */}
          {data.recommendations.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Targeted Reduction Opportunities</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-200">{rec.title}</div>
                      <Badge variant="emerald">Save {rec.impact_saved} kg</Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400">No report available. Log activities to view AI summaries.</div>
      )}
    </Card>
  );
};
