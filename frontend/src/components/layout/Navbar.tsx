import React from "react";
import { Leaf, LayoutDashboard, History as HistoryIcon, Award, ShieldAlert, Lock, PlusCircle, Sparkles, ChevronDown, LogOut, User } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
  activeTab: "dashboard" | "history" | "goals" | "admin";
  setActiveTab: (tab: "dashboard" | "history" | "goals" | "admin") => void;
  onOpenLogModal: () => void;
  onOpenReportModal: () => void;
  onOpenPrivacyModal: () => void;
  onOpenGpsHealthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLogModal,
  onOpenReportModal,
  onOpenPrivacyModal,
  onOpenGpsHealthModal,
}) => {
  const { user, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-white bg-clip-text text-transparent">
              EcoSense
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              AI Sustainability Assistant
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "history", label: "History", icon: HistoryIcon },
            { id: "goals", label: "Goals", icon: Award },
            ...(user?.role === "admin" ? [{ id: "admin", label: "Admin Panel", icon: ShieldAlert }] : []),
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === id
                  ? "bg-slate-800 text-emerald-400 border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {onOpenGpsHealthModal && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenGpsHealthModal}
              className="hidden md:inline-flex border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
            >
              📱 GPS & Health Sync
            </Button>
          )}

          <button
            onClick={onOpenPrivacyModal}
            className="hidden sm:flex p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition"
            title="Privacy Settings"
          >
            <Lock className="w-4 h-4" />
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenReportModal}
            icon={<Sparkles className="w-4 h-4 text-emerald-400" />}
            className="hidden lg:inline-flex"
          >
            AI Report
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenLogModal}
            icon={<PlusCircle className="w-4 h-4" />}
          >
            <span className="hidden sm:inline">Log Activity</span>
            <span className="sm:hidden">Log</span>
          </Button>

          {/* User Avatar Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full ring-2 ring-emerald-500/40"
                />
                <span className="hidden sm:block text-xs font-semibold text-slate-200 max-w-[90px] truncate">
                  {user.name.split(" ")[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-12 z-50 w-56 glass-card border border-slate-800 rounded-2xl shadow-2xl overflow-hidden py-1">
                    <div className="px-4 py-3 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full" />
                        <div>
                          <div className="text-sm font-bold text-slate-100">{user.name}</div>
                          <div className="text-xs text-slate-400 truncate">{user.email}</div>
                          <div className="text-[10px] text-emerald-400 font-semibold mt-0.5 capitalize">
                            via {user.provider}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={onOpenPrivacyModal}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Privacy & Settings
                    </button>
                    <button
                      onClick={() => { signOut(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
