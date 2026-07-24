import React from "react";
import { TrendingDown, TrendingUp, Minus, Sparkles, CheckCircle2 } from "lucide-react";
import { ForecastResult } from "../../types";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface AIForecastCardProps {
  forecast: ForecastResult;
}

export const AIForecastCard: React.FC<AIForecastCardProps> = ({ forecast }) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-bold text-slate-100">7-Day AI Carbon Forecast</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="blue" size="sm">
            Confidence {Math.round(forecast.confidenceScore * 100)}%
          </Badge>
          <Badge
            variant={
              forecast.trendDirection === "decreasing"
                ? "emerald"
                : forecast.trendDirection === "increasing"
                ? "rose"
                : "slate"
            }
            size="sm"
          >
            {forecast.trendDirection === "decreasing" ? (
              <span className="flex items-center gap-1">
                <TrendingDown className="w-3 h-3" /> Decreasing Trend
              </span>
            ) : forecast.trendDirection === "increasing" ? (
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Increasing Spikes
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Minus className="w-3 h-3" /> Stable Trend
              </span>
            )}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Predicted Daily Average Next Week</span>
          <span className="text-base font-extrabold text-teal-300">
            {forecast.predictedWeeklyAverage} kg CO₂ / day
          </span>
        </div>

        {/* 7-Day Mini Bar Forecast */}
        <div className="grid grid-cols-7 gap-1.5 pt-2">
          {forecast.forecastDays.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-center">
              <span className="text-[10px] text-slate-400">{day.dayLabel}</span>
              <div className="w-full bg-slate-800 h-16 rounded-lg relative overflow-hidden flex items-end">
                <div
                  className="w-full bg-gradient-to-t from-teal-500 to-emerald-400 rounded-b-lg transition-all"
                  style={{ height: `${Math.min(100, (day.predictedCo2 / 18) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-300">{day.predictedCo2}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
