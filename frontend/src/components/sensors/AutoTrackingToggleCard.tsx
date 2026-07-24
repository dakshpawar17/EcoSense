import React, { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Activity, Navigation, ShieldCheck, Power, RefreshCw, Smartphone, AlertCircle } from "lucide-react";

interface AutoTrackingToggleCardProps {
  onSyncNow: () => void;
  onOpenSensorsModal: () => void;
}

export const AutoTrackingToggleCard: React.FC<AutoTrackingToggleCardProps> = ({
  onSyncNow,
  onOpenSensorsModal,
}) => {
  const [isAutoTrackingEnabled, setIsAutoTrackingEnabled] = useState<boolean>(() => {
    return localStorage.getItem("ecosense_auto_tracking") !== "disabled";
  });

  const [healthStatus, setHealthStatus] = useState<"ACTIVE" | "PAUSED" | "DENIED">("ACTIVE");
  const [gpsStatus, setGpsStatus] = useState<"ACTIVE" | "PAUSED" | "DENIED">("ACTIVE");
  const [lastSyncTime, setLastSyncTime] = useState<string>("Just now");

  const toggleAutoTracking = () => {
    const nextState = !isAutoTrackingEnabled;
    setIsAutoTrackingEnabled(nextState);
    localStorage.setItem("ecosense_auto_tracking", nextState ? "enabled" : "disabled");
    if (!nextState) {
      setHealthStatus("PAUSED");
      setGpsStatus("PAUSED");
    } else {
      setHealthStatus("ACTIVE");
      setGpsStatus("ACTIVE");
      setLastSyncTime(new Date().toLocaleTimeString());
    }
  };

  return (
    <Card glow className="bg-slate-900/80 border-slate-800 p-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Status Summary */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
              AI Automatic Carbon Tracking
            </h3>
            <Badge variant={isAutoTrackingEnabled ? "emerald" : "amber"}>
              {isAutoTrackingEnabled ? "AUTO-SYNC ACTIVE" : "PAUSED (MANUAL FALLBACK)"}
            </Badge>
          </div>
          <p className="text-xs text-slate-400">
            Real-time HealthKit, Google Health Connect & GPS Telemetry Sync • Last synced: {lastSyncTime}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSensorsModal}
            className="border-slate-700 text-slate-200 hover:bg-slate-800 gap-2"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            Sensor Hub
          </Button>

          <Button
            variant={isAutoTrackingEnabled ? "ghost" : "primary"}
            size="sm"
            onClick={toggleAutoTracking}
            className={`gap-2 text-xs font-semibold ${
              isAutoTrackingEnabled
                ? "text-rose-400 hover:bg-rose-950/30 border border-rose-500/30"
                : "bg-emerald-500 hover:bg-emerald-600 text-slate-950"
            }`}
          >
            <Power className="w-4 h-4" />
            {isAutoTrackingEnabled ? "Disable Tracking" : "Enable Auto-Tracking"}
          </Button>
        </div>
      </div>

      {/* Sensor Status Grid */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-300">Apple / Google Health</div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> {isAutoTrackingEnabled ? "Permission Granted" : "Opted Out"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-300">GPS Transport AI</div>
            <div className="text-[11px] text-sky-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> {isAutoTrackingEnabled ? "Classifier Active" : "Paused"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-300">Privacy & Fallback</div>
            <div className="text-[11px] text-slate-400 font-semibold">
              Manual logging 100% active
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
