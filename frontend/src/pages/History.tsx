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
} from "lucide-react";
import { Entry } from "../types";
import { entryService } from "../services/api";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";

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
        limit: 8,
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

    const csvRows = entries.map((e) => [
      e.id,
      new Date(e.createdAt).toISOString(),
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

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Activity History Logs</h1>
          <p className="text-xs text-slate-400">
            Search, filter, and export past carbon footprint records ({totalCount} total entries)
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

      {/* Table Container */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs font-semibold uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">Transport</th>
                <th className="px-5 py-3.5">Energy</th>
                <th className="px-5 py-3.5">Food</th>
                <th className="px-5 py-3.5">Shopping</th>
                <th className="px-5 py-3.5">Total CO₂</th>
                <th className="px-5 py-3.5">EcoScore</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="px-5 py-3">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))}

              {!loading && entries.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    No activity logs found matching your criteria.
                  </td>
                </tr>
              )}

              {!loading &&
                entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-900/40 transition">
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs font-medium text-slate-200">
                      {new Date(entry.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Car className="w-3.5 h-3.5 text-sky-400" />
                        <span className="capitalize">{entry.transportMode}</span>
                        <span className="text-slate-500">({entry.transportKm}km)</span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>{entry.energyKwh} kWh</span>
                        <span className="text-slate-500">({entry.energySource})</span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="capitalize">{entry.dietType.replace("_", " ")}</span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs">
                        <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
                        <span>{entry.shoppingOrders} orders</span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap font-bold text-white">
                      {entry.co2Total} kg
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <Badge
                        variant={
                          entry.ecoScore >= 80 ? "emerald" : entry.ecoScore >= 60 ? "blue" : "amber"
                        }
                        size="sm"
                      >
                        {entry.ecoScore} pts
                      </Badge>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                        title="Delete log entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-3.5 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
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
      </Card>
    </div>
  );
};
