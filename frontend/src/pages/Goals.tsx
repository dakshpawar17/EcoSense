import React, { useState } from "react";
import { Target, CheckCircle2, Trophy, ArrowRight, ShieldCheck } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

export const Goals: React.FC = () => {
  const [goals, setGoals] = useState([
    {
      id: "1",
      title: "Reduce Transport CO₂ by 20%",
      category: "Transport",
      targetKg: 3.5,
      currentKg: 4.8,
      progressPct: 65,
      completed: false,
    },
    {
      id: "2",
      title: "Switch to 100% Renewable Home Tariff",
      category: "Energy",
      targetKg: 0.0,
      currentKg: 2.2,
      progressPct: 40,
      completed: false,
    },
    {
      id: "3",
      title: "Maintain 3 Meatless Days / Week",
      category: "Diet",
      targetKg: 2.5,
      currentKg: 2.5,
      progressPct: 100,
      completed: true,
    },
    {
      id: "4",
      title: "Zero Package Deliveries for 14 Days",
      category: "Shopping",
      targetKg: 0.0,
      currentKg: 1.0,
      progressPct: 80,
      completed: false,
    },
  ]);

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              completed: !g.completed,
              progressPct: !g.completed ? 100 : Math.round((g.targetKg / g.currentKg) * 100),
            }
          : g
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Sustainability Goals & Milestones</h1>
        <p className="text-xs text-slate-400">
          Set custom carbon reduction targets and track your personal journey toward Net-Zero.
        </p>
      </div>

      {/* Hero Goal Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glow className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-slate-100">Monthly Net-Zero Progress</h3>
            </div>
            <Badge variant="emerald">On Track</Badge>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Target: 250 kg CO₂ / month</span>
                <span className="text-emerald-400 font-bold">172 kg achieved (68.8%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[68.8%]" />
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              At your current pace, you are set to save approximately <strong className="text-emerald-300">85 kg of CO₂</strong> this month compared to average national households!
            </p>
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center p-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-3 text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-100">Level 4 Eco Pioneer</h4>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            3 completed goals away from Level 5 Green Guardian
          </p>
          <Button variant="outline" size="sm">
            View Leaderboard
          </Button>
        </Card>
      </div>

      {/* Active Goals List */}
      <Card>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-slate-100">Active Action Targets</h3>
          <Button variant="primary" size="sm">
            + Add Custom Target
          </Button>
        </div>

        <div className="space-y-4">
          {goals.map((g) => (
            <div
              key={g.id}
              className={`p-4 rounded-xl border transition-all ${
                g.completed
                  ? "bg-slate-900/40 border-emerald-500/40"
                  : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleGoal(g.id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                      g.completed
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-600 hover:border-emerald-500"
                    }`}
                  >
                    {g.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>

                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        g.completed ? "line-through text-slate-400" : "text-slate-100"
                      }`}
                    >
                      {g.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="slate" size="sm">
                        {g.category}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        Target: {g.targetKg} kg CO₂/day
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400">{g.progressPct}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${g.progressPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
