import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Dashboard } from "./pages/Dashboard";
import { History } from "./pages/History";
import { Goals } from "./pages/Goals";
import { Admin } from "./pages/Admin";
import { LoginPage } from "./pages/LoginPage";
import { Modal } from "./components/ui/Modal";
import { ActivityLoggerForm } from "./components/forms/ActivityLoggerForm";
import { PrivacySettingsModal } from "./components/privacy/PrivacySettingsModal";
import { GPSHealthTrackerModal } from "./components/sensors/GPSHealthTrackerModal";
import { ToastNotification } from "./components/ui/ToastNotification";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { summaryService, reportService, entryService } from "./services/api";
import { ActivityFormInput, SummaryStats, AIReport } from "./types";

function AppInner() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "history" | "goals" | "admin">("dashboard");
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [report, setReport] = useState<AIReport | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isGpsHealthModalOpen, setIsGpsHealthModalOpen] = useState(false);
  const [isLogSubmitting, setIsLogSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string | null; type: "success" | "error" }>({
    message: null,
    type: "success",
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: null, type: "success" }), 4000);
  };

  const fetchSummary = async () => {
    try {
      const res = await summaryService.getSummary();
      if (res.success) setSummary(res.data);
    } catch (err) {
      console.error("Failed to load summary:", err);
    }
  };

  const handleGenerateReport = async (entryId?: string) => {
    setIsReportLoading(true);
    try {
      const res = await reportService.generateReport(entryId);
      if (res.success) {
        setReport(res.data);
        showToast("AI Eco Report generated!", "success");
      }
    } catch {
      showToast("Failed to generate AI report", "error");
    } finally {
      setIsReportLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchSummary();
  }, [user]);

  const handleCreateEntry = async (data: ActivityFormInput) => {
    setIsLogSubmitting(true);
    try {
      const res = await entryService.createEntry(data);
      if (res.success) {
        showToast("Activity logged and calculated!", "success");
        setIsLogModalOpen(false);
        await fetchSummary();
        handleGenerateReport(res.data.id);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to log activity", "error");
    } finally {
      setIsLogSubmitting(false);
    }
  };

  // Loading splash screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-pulse">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-slate-400 font-medium animate-pulse">Loading EcoSense…</div>
        </div>
      </div>
    );
  }

  // If not logged in → show login page
  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogModal={() => setIsLogModalOpen(true)}
        onOpenReportModal={() => handleGenerateReport()}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onOpenGpsHealthModal={() => setIsGpsHealthModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <Dashboard
                summary={summary}
                report={report}
                isReportLoading={isReportLoading}
                onGenerateReport={() => handleGenerateReport()}
                onOpenLogModal={() => setIsLogModalOpen(true)}
              />
            </motion.div>
          )}
          {activeTab === "history" && (
            <motion.div key="history" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <History onRefreshSummary={fetchSummary} showToast={showToast} />
            </motion.div>
          )}
          {activeTab === "goals" && (
            <motion.div key="goals" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <Goals />
            </motion.div>
          )}
          {activeTab === "admin" && (
            <motion.div key="admin" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <Admin />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      <Modal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} title="Log Today's Lifestyle Activity" maxWidth="xl">
        <ActivityLoggerForm onSubmit={handleCreateEntry} isLoading={isLogSubmitting} />
      </Modal>

      <GPSHealthTrackerModal
        isOpen={isGpsHealthModalOpen}
        onClose={() => setIsGpsHealthModalOpen(false)}
        onSuccess={fetchSummary}
      />

      <PrivacySettingsModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} showToast={showToast} />

      <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast({ message: null, type: "success" })} />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
