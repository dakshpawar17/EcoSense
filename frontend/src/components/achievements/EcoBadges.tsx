import React from "react";
import { Award, Zap, Flame, Bike, Leaf, ShieldAlert, Check } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface EcoBadgesProps {
  streak: number;
  ecoScore: number;
  totalEntries: number;
}

export const EcoBadges: React.FC<EcoBadgesProps> = ({ streak, ecoScore, totalEntries }) => {
  const badges = [
    {
      id: "first_log",
      title: "First Step",
      description: "Logged your first daily carbon footprint",
      icon: <Leaf className="w-5 h-5 text-emerald-400" />,
      unlocked: totalEntries >= 1,
    },
    {
      id: "streak_3",
      title: "3-Day Streak",
      description: "Logged daily activities for 3 consecutive days",
      icon: <Flame className="w-5 h-5 text-amber-400" />,
      unlocked: streak >= 3,
    },
    {
      id: "score_80",
      title: "Green Warrior",
      description: "Achieved an EcoScore of 80 or above",
      icon: <Award className="w-5 h-5 text-teal-400" />,
      unlocked: ecoScore >= 80,
    },
    {
      id: "clean_transit",
      title: "Clean Transit",
      description: "Logged zero-emission transit (bike/walk)",
      icon: <Bike className="w-5 h-5 text-sky-400" />,
      unlocked: totalEntries >= 2,
    },
    {
      id: "solar_power",
      title: "Solar Pioneer",
      description: "Powered your day with renewable energy",
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      unlocked: totalEntries >= 3,
    },
    {
      id: "eco_champion",
      title: "Eco Champion",
      description: "Maintained A+ grade (Score 90+)",
      icon: <ShieldAlert className="w-5 h-5 text-emerald-300" />,
      unlocked: ecoScore >= 90,
    },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-slate-100">Sustainability Badges & Milestones</h3>
        </div>
        <Badge variant="emerald" size="sm">
          {badges.filter((b) => b.unlocked).length} / {badges.length} Unlocked
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
              b.unlocked
                ? "bg-slate-900/80 border-slate-700/80 hover:border-emerald-500/40"
                : "bg-slate-950/40 border-slate-900 opacity-40 grayscale"
            }`}
          >
            <div className="p-2.5 rounded-xl bg-slate-800/80 mb-2 relative">
              {b.icon}
              {b.unlocked && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </div>
            <div className="text-xs font-bold text-slate-200 mb-0.5">{b.title}</div>
            <div className="text-[10px] text-slate-400 leading-tight">{b.description}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};
