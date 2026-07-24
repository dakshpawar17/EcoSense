import React from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingDown, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import { AIReport } from "../../types";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Skeleton } from "../ui/Skeleton";

interface AIReportCardProps {
  report: AIReport | null;
  isLoading: boolean;
  onGenerate: () => void;
}

export const AIReportCard: React.FC<AIReportCardProps> = ({
  report,
  isLoading,
  onGenerate,
}) => {
  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden border border-emerald-500/30">
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              AI Sustainability Coach Report
            </h2>
            <p className="text-xs text-slate-400">
              Personalized carbon analysis powered by Groq AI
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onGenerate}
          isLoading={isLoading}
          icon={<Sparkles className="w-4 h-4 text-white" />}
        >
          {report ? "Refresh AI Report" : "Generate Eco Report"}
        </Button>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !report && (
        <div className="text-center py-8 space-y-3">
          <ShieldCheck className="w-12 h-12 text-emerald-400/80 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">No AI Analysis Generated Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click the "Generate Eco Report" button above to run Groq AI's deep analysis on your logged footprint.
          </p>
        </div>
      )}

      {/* Active AI Report Display */}
      {!isLoading && report && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Banner */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <p className="text-sm leading-relaxed text-slate-200">{report.summary}</p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Biggest Contributor</div>
                <div className="text-sm font-bold text-amber-400">{report.biggest_contributor}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">National Comparison</div>
                <div className="text-sm font-bold text-emerald-400">{report.comparison}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">AI EcoScore</div>
                <div className="text-sm font-bold text-teal-300">
                  {report.score} / 100 <span className="text-xs">({report.grade})</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Targeted AI Recommendations */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Top Actionable Sustainability Recommendations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/40 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-sm font-bold text-slate-100">{rec.title}</h4>
                    <Badge variant="emerald" size="sm">
                      -{rec.impact_saved} kg CO₂
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
