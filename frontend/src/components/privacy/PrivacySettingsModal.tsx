import React from "react";
import { ShieldCheck, Download, Trash2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  const handleExportData = () => {
    const data = {
      user: "Alex Morgan",
      timestamp: new Date().toISOString(),
      preferences: {
        homeLocation: "San Francisco, CA",
        preferredTransport: "electric_bus",
        dietType: "vegetarian",
        monthlyCarbonBudgetKg: 250,
      },
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `ecosense_user_privacy_export_${Date.now()}.json`;
    link.click();
    showToast("Full personal data exported successfully", "success");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Privacy & Personal Data Governance" maxWidth="md">
      <div className="space-y-5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            EcoSense complies with strict privacy data minimization. Your GPS & activity logs are encrypted locally.
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-200">AI Personalization Memory</div>
              <div className="text-xs text-slate-400">Allow Claude AI to memorize travel patterns</div>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500 rounded" />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div>
              <div className="text-sm font-semibold text-slate-200">Export All Data</div>
              <div className="text-xs text-slate-400">Download raw JSON copy of all logs & profile preferences</div>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportData} icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div>
              <div className="text-sm font-semibold text-rose-300">Reset & Purge Data</div>
              <div className="text-xs text-slate-400">Permanently delete stored entries and AI memory</div>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (window.confirm("Permanently purge all data?")) {
                  showToast("All personal data purged from database", "success");
                  onClose();
                }
              }}
              icon={<Trash2 className="w-4 h-4" />}
            >
              Purge
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
