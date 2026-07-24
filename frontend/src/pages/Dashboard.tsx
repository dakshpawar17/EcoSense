import React from "react";
import {
  Calendar,
  Flame,
  TrendingDown,
  Award,
  Zap,
  Leaf,
  PieChart as PieIcon,
  BarChart3,
  LineChart,
} from "lucide-react";
import { SummaryStats, AIReport } from "../types";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { CategoryPieChart } from "../components/charts/CategoryPieChart";
import { WeeklyTrendChart } from "../components/charts/WeeklyTrendChart";
import { ComparisonBarChart } from "../components/charts/ComparisonBarChart";
import { EcoScoreRing } from "../components/charts/EcoScoreRing";
import { AIReportCard } from "../components/ai/AIReportCard";
import { EcoBadges } from "../components/achievements/EcoBadges";
import { EnvironmentalEquivalentsCard } from "../components/dashboard/EnvironmentalEquivalentsCard";
import { CarbonBudgetCard } from "../components/dashboard/CarbonBudgetCard";
import { AIForecastCard } from "../components/dashboard/AIForecastCard";
import { AutoTrackingToggleCard } from "../components/sensors/AutoTrackingToggleCard";
import { MultiTimeframeReportCard } from "../components/ai/MultiTimeframeReportCard";
import { GPSHealthTrackerModal } from "../components/sensors/GPSHealthTrackerModal";
import { getGradeFromScore } from "../utils/calculationPreview";

interface DashboardProps {
  summary: SummaryStats | null;
  report: AIReport | null;
  isReportLoading: boolean;
  onGenerateReport: () => void;
  onOpenLogModal: () => void;
  onRefreshData?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  summary,
  report,
  isReportLoading,
  onGenerateReport,
  onOpenLogModal,
  onRefreshData,
}) => {
  const [isSensorsModalOpen, setIsSensorsModalOpen] = React.useState(false);

  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const todayTotal = summary ? summary.todayTotal : 14.8;
  const todayScore = summary ? summary.todayEcoScore : 72;
  const grade = getGradeFromScore(todayScore);

  return (
    <div className="space-y-8">
      {/* Auto-Tracking Opt-In & Privacy Banner */}
      <AutoTrackingToggleCard
        onSyncNow={() => onRefreshData && onRefreshData()}
        onOpenSensorsModal={() => setIsSensorsModalOpen(true)}
      />
      {/* Top Banner / Hero Header */}
      <Card glow className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>{currentDateFormatted}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              AI Sustainability Dashboard
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Real-time daily footprint analysis, 7-day predictive AI carbon forecasts, carbon allowance budgeting, and real-world environmental equivalents.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 shrink-0">
            <EcoScoreRing score={todayScore} grade={grade} size={110} />

            <div className="space-y-1">
              <div className="text-xs text-slate-400 font-medium">Today's Emissions</div>
              <div className="text-3xl font-extrabold text-white">
                {todayTotal} <span className="text-xs font-normal text-slate-400">kg CO₂</span>
              </div>
              <Button variant="primary" size="sm" onClick={onOpenLogModal} className="mt-1">
                + Log Today's Entry
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Statistics 6-Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Today's Total</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white">{todayTotal} kg</div>
            <div className="text-[11px] text-slate-400">Daily Logged CO₂</div>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Weekly Average</span>
            <LineChart className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {summary ? summary.weeklyAverage : 11.2} kg
            </div>
            <div className="text-[11px] text-slate-400">Per day past 7d</div>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Best Day</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400">
              {summary ? summary.bestDay.co2Total : 6.8} kg
            </div>
            <div className="text-[11px] text-slate-400">
              {summary ? summary.bestDay.date : "Lowest CO₂"}
            </div>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Worst Day</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-amber-400">
              {summary ? summary.worstDay.co2Total : 18.5} kg
            </div>
            <div className="text-[11px] text-slate-400">
              {summary ? summary.worstDay.date : "Highest CO₂"}
            </div>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>vs Avg Baseline</span>
            <TrendingDown className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-teal-300">
              {summary ? summary.averageComparison : "-12% below"}
            </div>
            <div className="text-[11px] text-slate-400">Natl Benchmark 12.5kg</div>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Logging Streak</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-orange-400">
              {summary ? summary.currentStreak : 5} Days
            </div>
            <div className="text-[11px] text-slate-400">Active Logging</div>
          </div>
        </Card>
      </div>

      {/* Real-World Environmental Equivalents Card */}
      {summary && (
        <EnvironmentalEquivalentsCard equivalents={summary.environmentalEquivalents} />
      )}

      {/* Carbon Budget & 7-Day AI Forecast Grid */}
      {summary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CarbonBudgetCard budget={summary.monthlyBudget} />
          <AIForecastCard forecast={summary.forecast} />
        </div>
      )}

      {/* Multi-Timeframe AI Report Section */}
      <MultiTimeframeReportCard />

      {/* AI Coach Sustainability Section */}
      <AIReportCard
        report={report}
        isLoading={isReportLoading}
        onGenerate={onGenerateReport}
      />

      {/* Interactive Visualizations 3-Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-200">Category Breakdown</h3>
            </div>
            <span className="text-xs text-slate-400">Emissions Share</span>
          </div>
          <CategoryPieChart
            breakdown={
              summary
                ? summary.breakdown
                : {
                    co2Transport: 4.5,
                    co2Energy: 3.6,
                    co2Food: 4.5,
                    co2Shopping: 2.2,
                    co2Total: 14.8,
                  }
            }
          />
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-200">Weekly Emission Trend</h3>
            </div>
            <span className="text-xs text-slate-400">Daily Footprint (kg CO₂)</span>
          </div>
          <WeeklyTrendChart data={summary ? summary.weeklyTrend : []} />
        </Card>
      </div>

      {/* Benchmark Comparison & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-200">Benchmark Comparison</h3>
            </div>
            <span className="text-xs text-slate-400">kg/day</span>
          </div>
          <ComparisonBarChart userAverage={summary ? summary.weeklyAverage : 9.5} />
        </Card>

        <div className="lg:col-span-2">
          <EcoBadges
            streak={summary ? summary.currentStreak : 5}
            ecoScore={todayScore}
            totalEntries={summary ? summary.totalEntries : 10}
          />
        </div>
      </div>

      {/* Sensor & Health Modal */}
      <GPSHealthTrackerModal
        isOpen={isSensorsModalOpen}
        onClose={() => setIsSensorsModalOpen(false)}
        onSuccess={() => onRefreshData && onRefreshData()}
      />
    </div>
  );
};
