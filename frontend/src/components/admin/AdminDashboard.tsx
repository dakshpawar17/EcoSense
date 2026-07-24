import React, { useState, useEffect } from "react";
import { Users, Server, Activity, ShieldCheck, Cpu, HardDrive } from "lucide-react";
import { AdminAnalytics } from "../../types";
import { adminService } from "../../services/api";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Skeleton } from "../ui/Skeleton";

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAnalytics().then((res) => {
      if (res.success) setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Skeleton className="h-96 w-full" />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">System & Telemetry Admin</h1>
          <p className="text-xs text-slate-400">
            Real-time aggregate platform metrics, environmental impact stats, and AI API performance
          </p>
        </div>
        <Badge variant="emerald" size="md">
          <ShieldCheck className="w-4 h-4 mr-1" />
          System Health: {data.systemStatus}
        </Badge>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Platform Users</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{data.totalUsers}</div>
          <div className="text-xs text-slate-400 mt-1">{data.activeLoggers} active loggers</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Aggregate CO₂ Saved</span>
            <Activity className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-teal-300">{data.totalCo2Saved} kg</div>
          <div className="text-xs text-slate-400 mt-1">Platform community total</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>AI Service Latency</span>
            <Cpu className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{data.aiServiceLatencyMs} ms</div>
          <div className="text-xs text-slate-400 mt-1">Groq API response time</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>AI Confidence Avg</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-purple-300">
            {Math.round(data.aiConfidenceAverage * 100)}%
          </div>
          <div className="text-xs text-slate-400 mt-1">Automated mode precision</div>
        </Card>
      </div>

      {/* Aggregate Category Impact Table */}
      <Card>
        <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-emerald-400" />
          Platform Aggregate Category Emission Totals
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400">Transport CO₂</div>
            <div className="text-lg font-bold text-sky-400">{data.categoryTotals.transport} kg</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400">Energy CO₂</div>
            <div className="text-lg font-bold text-amber-400">{data.categoryTotals.energy} kg</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400">Food CO₂</div>
            <div className="text-lg font-bold text-emerald-400">{data.categoryTotals.food} kg</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400">Shopping CO₂</div>
            <div className="text-lg font-bold text-purple-400">{data.categoryTotals.shopping} kg</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
