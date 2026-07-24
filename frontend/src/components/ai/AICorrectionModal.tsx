import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Brain, CheckCircle2, Sparkles, AlertTriangle, Car, Bus, Train, Bike, Footprints } from "lucide-react";
import { telemetryService } from "../../services/api";

interface AICorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictedMode: string;
  confidenceScore: number;
  speedKmH: number;
  distanceKm: number;
  entryId?: string;
  onSuccess: () => void;
}

export const AICorrectionModal: React.FC<AICorrectionModalProps> = ({
  isOpen,
  onClose,
  predictedMode,
  confidenceScore,
  speedKmH,
  distanceKm,
  entryId,
  onSuccess,
}) => {
  const [selectedActualMode, setSelectedActualMode] = useState<string>(predictedMode);
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const transportOptions = [
    { mode: "walk", label: "Walking / Running", icon: Footprints, co2Factor: "0.0 kg/km" },
    { mode: "bike", label: "Cycling / E-Bike", icon: Bike, co2Factor: "0.0 kg/km" },
    { mode: "bus", label: "City Bus", icon: Bus, co2Factor: "0.10 kg/km" },
    { mode: "train", label: "Train / Metro", icon: Train, co2Factor: "0.06 kg/km" },
    { mode: "car", label: "Personal Car", icon: Car, co2Factor: "0.21 kg/km" },
  ];

  const handleSubmitCorrection = async () => {
    setIsSubmitting(true);
    setFeedbackMsg(null);
    try {
      await telemetryService.submitCorrection({
        entryId,
        predictedMode,
        actualMode: selectedActualMode,
        speedKmH,
        distanceKm,
        reason: reason || "User manual correction",
      });
      setFeedbackMsg(`AI Trained! Corrected to ${selectedActualMode.toUpperCase()}. Model parameters updated.`);
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setFeedbackMsg("Failed to train model. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Train AI Transport Classifier">
      <div className="space-y-5">
        {/* Banner */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
              <Brain className="w-5 h-5 text-indigo-400" />
              AI Mobility Guess
            </div>
            <Badge variant={confidenceScore > 0.85 ? "emerald" : "amber"}>
              {(confidenceScore * 100).toFixed(0)}% Confidence
            </Badge>
          </div>
          <p className="text-xs text-slate-300">
            Groq AI classified your <span className="font-semibold text-white">{distanceKm} km</span> trip at{" "}
            <span className="font-semibold text-white">{speedKmH} km/h</span> as{" "}
            <span className="uppercase font-bold text-indigo-400">{predictedMode}</span>. Was this correct?
          </p>
        </div>

        {/* Transport Options Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Select Actual Transport Mode
          </label>
          <div className="grid grid-cols-1 gap-2">
            {transportOptions.map((item) => {
              const IconComp = item.icon;
              const isSelected = selectedActualMode === item.mode;
              return (
                <button
                  key={item.mode}
                  type="button"
                  onClick={() => setSelectedActualMode(item.mode)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-indigo-950/40 border-indigo-500/80 text-white shadow-lg shadow-indigo-500/10"
                      : "bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-800 text-slate-400"}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-200">{item.label}</div>
                      <div className="text-[11px] text-slate-500">Emission Factor: {item.co2Factor}</div>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback message */}
        {feedbackMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs font-semibold text-emerald-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> {feedbackMsg}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmitCorrection}
            isLoading={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
          >
            <Brain className="w-4 h-4" />
            Correct AI & Train Model
          </Button>
        </div>
      </div>
    </Modal>
  );
};
