import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatLastSynced } from "../../utils/dateTime";

export type SyncState = "synced" | "syncing" | "offline" | "error";

interface SyncStatusBadgeProps {
  syncState: SyncState;
  lastSyncedAt: Date | null;
  pendingCount?: number;
}

const CONFIG: Record<SyncState, { icon: React.ElementType; label: string; color: string; dot: string }> = {
  synced: {
    icon: CheckCircle2,
    label: "Synced",
    color: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  syncing: {
    icon: RefreshCw,
    label: "Syncing…",
    color: "text-amber-400",
    dot: "bg-amber-400",
  },
  offline: {
    icon: WifiOff,
    label: "Offline",
    color: "text-rose-400",
    dot: "bg-rose-400",
  },
  error: {
    icon: AlertTriangle,
    label: "Sync Error",
    color: "text-orange-400",
    dot: "bg-orange-400",
  },
};

export const SyncStatusBadge: React.FC<SyncStatusBadgeProps> = ({
  syncState,
  lastSyncedAt,
  pendingCount = 0,
}) => {
  const cfg = CONFIG[syncState];
  const Icon = cfg.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={syncState}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.2 }}
        className="group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-800/80 bg-slate-900/70 cursor-default select-none"
        title={
          syncState === "synced" && lastSyncedAt
            ? `Last synced: ${formatLastSynced(lastSyncedAt)}`
            : syncState === "offline"
            ? `${pendingCount} activities queued locally`
            : undefined
        }
      >
        {/* Animated status dot */}
        <span className="relative flex h-2 w-2">
          {syncState === "syncing" && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-60`} />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`} />
        </span>

        <Icon
          className={`w-3.5 h-3.5 ${cfg.color} ${syncState === "syncing" ? "animate-spin" : ""}`}
        />

        <span className={`text-[11px] font-semibold ${cfg.color} hidden sm:inline`}>
          {cfg.label}
          {syncState === "offline" && pendingCount > 0 && ` (${pendingCount})`}
        </span>

        {/* Tooltip on hover */}
        {syncState === "synced" && lastSyncedAt && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card border border-slate-700 shadow-2xl whitespace-nowrap pointer-events-none">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-xs text-slate-200">
              Last synced: {formatLastSynced(lastSyncedAt)}
            </span>
          </div>
        )}
        {syncState === "offline" && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card border border-slate-700 shadow-2xl whitespace-nowrap pointer-events-none">
            <WifiOff className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="text-xs text-slate-200">
              {pendingCount > 0 ? `${pendingCount} activities queued for sync` : "No internet connection"}
            </span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
