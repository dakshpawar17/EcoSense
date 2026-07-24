import React, { useState, useEffect, useRef } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Navigation, HeartPulse, Activity, Zap, Play, Square, RefreshCw, CheckCircle2 } from "lucide-react";
import { api } from "../../services/api";

interface GPSHealthTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Haversine formula to compute distance between 2 GPS coordinates in km
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const GPSHealthTrackerModal: React.FC<GPSHealthTrackerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<"gps" | "health">("gps");

  // GPS Tracking State
  const [isTracking, setIsTracking] = useState(false);
  const [currentSpeedKmH, setCurrentSpeedKmH] = useState(0);
  const [totalDistanceKm, setTotalDistanceKm] = useState(0);
  const [detectedMode, setDetectedMode] = useState<"WALK" | "BIKE" | "CAR" | "TRAIN">("WALK");
  const [accumulatedCo2Kg, setAccumulatedCo2Kg] = useState(0);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isSavingGps, setIsSavingGps] = useState(false);

  const prevCoordsRef = useRef<{ lat: number; lon: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Health App Telemetry State
  const [healthProvider, setHealthProvider] = useState<"Apple HealthKit" | "Google Health Connect">("Apple HealthKit");
  const [stepCount, setStepCount] = useState(8450);
  const [walkingDistanceKm, setWalkingDistanceKm] = useState(6.2);
  const [cyclingDistanceKm, setCyclingDistanceKm] = useState(4.5);
  const [isSyncingHealth, setIsSyncingHealth] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  // Speed-based Transport Mode Auto Classifier
  useEffect(() => {
    let mode: "WALK" | "BIKE" | "CAR" | "TRAIN" = "WALK";
    let factor = 0; // kg CO2 / km

    if (currentSpeedKmH > 90) {
      mode = "TRAIN";
      factor = 0.04;
    } else if (currentSpeedKmH > 25) {
      mode = "CAR";
      factor = 0.21;
    } else if (currentSpeedKmH > 6) {
      mode = "BIKE";
      factor = 0.0;
    } else {
      mode = "WALK";
      factor = 0.0;
    }

    setDetectedMode(mode);
    setAccumulatedCo2Kg(Number((totalDistanceKm * factor).toFixed(2)));
  }, [currentSpeedKmH, totalDistanceKm]);

  // Start Real-Time Phone GPS Geolocation Tracking
  const startGpsTracking = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser or device.");
      return;
    }

    setIsTracking(true);
    prevCoordsRef.current = null;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed } = position.coords;
        const speedKmH = speed !== null && speed >= 0 ? Number((speed * 3.6).toFixed(1)) : 0;
        setCurrentSpeedKmH(speedKmH);

        if (prevCoordsRef.current) {
          const deltaKm = calculateHaversineDistance(
            prevCoordsRef.current.lat,
            prevCoordsRef.current.lon,
            latitude,
            longitude
          );
          if (deltaKm > 0.005) { // Filter out micro GPS jitter
            setTotalDistanceKm((prev) => Number((prev + deltaKm).toFixed(2)));
          }
        }
        prevCoordsRef.current = { lat: latitude, lon: longitude };
      },
      (err) => {
        setGpsError(`GPS Error: ${err.message}`);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
      }
    );
  };

  // Stop GPS Geolocation Tracking
  const stopGpsTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  };

  // Save Logged GPS Trip to Backend API
  const handleSaveGpsTrip = async () => {
    if (totalDistanceKm <= 0) return;
    setIsSavingGps(true);
    try {
      await api.post("/sync/gps", {
        distanceKm: totalDistanceKm,
        transportMode: detectedMode,
        avgSpeedKmH: currentSpeedKmH,
      });
      stopGpsTracking();
      onSuccess();
      onClose();
    } catch (err: any) {
      setGpsError(err.response?.data?.message || "Failed to log GPS trip");
    } finally {
      setIsSavingGps(false);
    }
  };

  // Sync Telemetry from Health Apps
  const handleSyncHealthData = async () => {
    setIsSyncingHealth(true);
    setSyncSuccessMsg(null);
    try {
      const res = await api.post("/sync/health", {
        provider: healthProvider,
        stepCount,
        walkingDistanceKm,
        cyclingDistanceKm,
      });
      setSyncSuccessMsg(res.data.message);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      setGpsError(err.response?.data?.message || "Failed to sync health telemetry");
    } finally {
      setIsSyncingHealth(false);
    }
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📱 Phone GPS & Health App Telemetry Sync" maxWidth="lg">
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("gps")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === "gps"
                ? "bg-emerald-500 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Navigation className="w-4 h-4" />
            Live GPS Trip Tracker
          </button>
          <button
            onClick={() => setActiveTab("health")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === "health"
                ? "bg-emerald-500 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            HealthKit & Health Connect
          </button>
        </div>

        {/* Error Alert */}
        {gpsError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300">
            {gpsError}
          </div>
        )}

        {/* Success Alert */}
        {syncSuccessMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {syncSuccessMsg}
          </div>
        )}

        {/* TAB 1: Live GPS Location Tracking */}
        {activeTab === "gps" && (
          <div className="space-y-5">
            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Live Distance
                </div>
                <div className="text-xl font-black text-white mt-1">
                  {totalDistanceKm.toFixed(2)} <span className="text-xs font-normal text-slate-400">km</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-sky-400" />
                  Speed
                </div>
                <div className="text-xl font-black text-white mt-1">
                  {currentSpeedKmH} <span className="text-xs font-normal text-slate-400">km/h</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400">AI Transport Mode</div>
                <div className="mt-1">
                  <Badge variant={detectedMode === "WALK" || detectedMode === "BIKE" ? "emerald" : "amber"} size="sm">
                    {detectedMode}
                  </Badge>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400">Est. Carbon Emitted</div>
                <div className="text-xl font-black text-amber-400 mt-1">
                  {accumulatedCo2Kg} <span className="text-xs font-normal text-slate-400">kg CO₂</span>
                </div>
              </div>
            </div>

            {/* GPS Controls */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {!isTracking ? (
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={startGpsTracking}
                  icon={<Play className="w-4 h-4" />}
                >
                  Start Live GPS Location Tracking
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1 border-red-500/40 text-red-400 hover:bg-red-500/10"
                  onClick={stopGpsTracking}
                  icon={<Square className="w-4 h-4" />}
                >
                  Pause Location Tracking
                </Button>
              )}

              <Button
                variant="primary"
                className="flex-1 bg-teal-500 hover:bg-teal-400"
                onClick={handleSaveGpsTrip}
                isLoading={isSavingGps}
                disabled={totalDistanceKm <= 0}
              >
                Log GPS Trip to Footprint
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: Apple HealthKit & Google Health Connect */}
        {activeTab === "health" && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">Select Health Telemetry Provider</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHealthProvider("Apple HealthKit")}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    healthProvider === "Apple HealthKit"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  🍏 Apple HealthKit (iOS)
                </button>

                <button
                  type="button"
                  onClick={() => setHealthProvider("Google Health Connect")}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    healthProvider === "Google Health Connect"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  🤖 Google Health Connect (Android)
                </button>
              </div>
            </div>

            {/* Health Sensor Inputs / Auto-Sync Simulator */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                <label className="text-xs text-slate-400">Step Count</label>
                <input
                  type="number"
                  value={stepCount}
                  onChange={(e) => setStepCount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-sm text-slate-100 font-bold"
                />
              </div>

              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                <label className="text-xs text-slate-400">Walking Dist. (km)</label>
                <input
                  type="number"
                  step="0.1"
                  value={walkingDistanceKm}
                  onChange={(e) => setWalkingDistanceKm(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-sm text-slate-100 font-bold"
                />
              </div>

              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                <label className="text-xs text-slate-400">Cycling Dist. (km)</label>
                <input
                  type="number"
                  step="0.1"
                  value={cyclingDistanceKm}
                  onChange={(e) => setCyclingDistanceKm(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-sm text-slate-100 font-bold"
                />
              </div>
            </div>

            {/* Health Offset Savings Card */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs text-emerald-300 font-semibold">Net Zero-Emission Distance</div>
                <div className="text-lg font-black text-emerald-400">
                  {(walkingDistanceKm + cyclingDistanceKm).toFixed(1)} km Active
                </div>
              </div>
              <Badge variant="emerald" size="md">
                -{((walkingDistanceKm + cyclingDistanceKm) * 0.21).toFixed(2)} kg CO₂ Offset vs Driving
              </Badge>
            </div>

            {/* Action Button */}
            <Button
              variant="primary"
              className="w-full"
              onClick={handleSyncHealthData}
              isLoading={isSyncingHealth}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Sync {healthProvider} Telemetry to Footprint
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
