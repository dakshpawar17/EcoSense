import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Car,
  Zap,
  Utensils,
  ShoppingBag,
  Calendar,
  Clock,
  Globe,
} from "lucide-react";
import { Entry } from "../types";
import { entryService } from "../services/api";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { groupEntriesByDate, formatActivityTime } from "../utils/dateTime";

interface HistoryProps {
  onRefreshSummary: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export const History: React.FC<HistoryProps> = ({ onRefreshSummary, showToast }) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [transportFilter, setTransportFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await entryService.getEntries({
        page,
        limit: 12,
        search,
        transportMode: transportFilter,
        sortBy: "createdAt",
        order: "desc",
      });
      if (res.success) {
        setEntries(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotalCount(res.pagination.totalCount);
      }
    } catch (err) {
      showToast("Failed to fetch historical entries", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [page, search, transportFilter]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this activity log?")) return;
    try {
      await entryService.deleteEntry(id);
      showToast("Entry deleted successfully", "success");
      fetchEntries();
      onRefreshSummary();
    } catch (err) {
      showToast("Failed to delete entry", "error");
    }
  };

  const handleExportCSV = () => {
    if (entries.length === 0) return;
    const headers = [
      "ID",
      "Date",
      "Time",
      "Timezone",
      "Transport Mode",
      "Transport (km)",
      "Energy (kWh)",
      "Diet",
      "Shopping Orders",
      "CO2 Transport (kg)",
      "CO2 Energy (kg)",
      "CO2 Food (kg)",
      "CO2 Shopping (kg)",
      "Total CO2 (kg)",
      "EcoScore",
    ];

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const csvRows = entries.map((e) => [
      e.id,
      new Date(e.createdAt).toISOString().split("T")[0],
      formatActivityTime(e.createdAt),
      tz,
      e.transportMode,
      e.transportKm,
      e.energyKwh,
      e.dietType,
      e.shoppingOrders,
      e.co2Transport,
      e.co2Energy,
      e.co2Food,
      e.co2Shopping,
      e.co2Total,
      e.ecoScore,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...csvRows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ecosense_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("CSV history exported successfully", "success");
  };

  const groupedEntries = groupEntriesByDate(entries);
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Daily Activity Logs</h1>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Timezone: <strong className="text-slate-300">{userTimezone}</strong></span>
            <span>• {totalCount} total activities logged</span>
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          icon={<Download className="w-4 h-4 text-emerald-400" />}
        >
          Export CSV
        </Button>
      </div>

      {/* Filter & Search Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by transport, diet, or shopping category..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={transportFilter}
              onChange={(e) => {
                setTransportFilter(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
            >
              <option value="all">All Modes</option>
              <option value="car">Car</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="flight">Flight</option>
              <option value="bike">Bike</option>
              <option value="walk">Walk</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Grouped Daily Logs Container */}
      <div className="space-y-6">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-16 w-full" />
            </Card>
          ))}

        {!loading && entries.length === 0 && (
          <Card className="p-12 text-center text-slate-400">
            No activity logs found matching your criteria.
          </Card>
        )}

        {!loading &&
          groupedEntries.map((group, groupIdx) => (
            <Card key={groupIdx} className="p-0 overflow-hidden">
              {/* Group Date Header */}
              <div className="px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  <span>{group.label}</span>
                </div>
                <span className="text-xs text-slate-400">
                  {group.entries.length} {group.entries.length === 1 ? "activity" : "activities"}
                </span>
              </div>

              {/* Group Entries List */}
              <div className="divide-y divide-slate-800/60">
                {group.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/40 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
                        {entry.transportMode === "bike" || entry.transportMode === "walk" ? (
                          <span className="text-emerald-400 font-bold text-xs uppercase">{entry.transportMode}</span>
                        ) : entry.transportMode === "car" ? (
                          <Car className="w-4 h-4 text-sky-400" />
                        ) : entry.transportMode === "bus" || entry.transportMode === "train" ? (
                          <Car className="w-4 h-4 text-teal-400" />
                        ) : (
                          <Car className="w-4 h-4 text-purple-400" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-100 capitalize">
                            {entry.transportMode} ({entry.transportKm} km)
                          </span>
                          <Badge variant="slate" size="sm">
                            {entry.energyKwh} kWh {entry.energySource}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {formatActivityTime(entry.createdAt)}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{entry.dietType.replace("_", " ")}</span>
                          <span>•</span>
                          <span>{entry.shoppingOrders} orders</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-white">{entry.co2Total} kg CO₂</div>
                        <Badge
                          variant={
                            entry.ecoScore >= 80 ? "emerald" : entry.ecoScore >= 60 ? "blue" : "amber"
                          }
                          size="sm"
                        >
                          {entry.ecoScore} pts
                        </Badge>
                      </div>

                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                        title="Delete log entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}

        {/* Pagination Footer */}
        <div className="px-5 py-3 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-400">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
