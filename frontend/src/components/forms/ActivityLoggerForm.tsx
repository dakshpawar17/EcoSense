import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Car, Zap, Utensils, ShoppingBag, Sparkles, CheckCircle } from "lucide-react";
import { ActivityFormInput } from "../../types";
import { estimateEmissions } from "../../utils/calculationPreview";
import { Button } from "../ui/Button";

const formSchema = z.object({
  transportMode: z.enum(["car", "bus", "train", "flight", "bike", "walk"]),
  transportKm: z.number().min(0, "Km must be >= 0"),
  energyKwh: z.number().min(0, "kWh must be >= 0"),
  energySource: z.enum(["grid", "solar", "mixed"]),
  dietType: z.enum(["meat_heavy", "mixed", "vegetarian", "vegan"]),
  meals: z.number().int().min(0, "Meals must be >= 0"),
  shoppingOrders: z.number().int().min(0, "Orders must be >= 0"),
  shoppingCategory: z.enum(["clothing", "electronics", "general"]),
});

interface ActivityLoggerFormProps {
  onSubmit: (data: ActivityFormInput) => Promise<void>;
  isLoading?: boolean;
}

export const ActivityLoggerForm: React.FC<ActivityLoggerFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [activeStep, setActiveStep] = useState<"transport" | "energy" | "food" | "shopping">("transport");
  const [preview, setPreview] = useState(() =>
    estimateEmissions({
      transportMode: "car",
      transportKm: 15,
      energyKwh: 8,
      energySource: "grid",
      dietType: "mixed",
      meals: 3,
      shoppingOrders: 1,
      shoppingCategory: "general",
    })
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ActivityFormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transportMode: "car",
      transportKm: 15,
      energyKwh: 8,
      energySource: "grid",
      dietType: "mixed",
      meals: 3,
      shoppingOrders: 1,
      shoppingCategory: "general",
    },
  });

  const formValues = watch();

  useEffect(() => {
    const estimated = estimateEmissions(formValues);
    setPreview(estimated);
  }, [JSON.stringify(formValues)]);

  const handleFormSubmit = async (data: ActivityFormInput) => {
    await onSubmit(data);
  };

  return (
    <div className="space-y-6">
      {/* Live Estimate Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Live Carbon Preview
          </div>
          <div className="text-2xl font-bold text-white mt-0.5">
            {preview.total} <span className="text-sm font-normal text-slate-400">kg CO₂ / day</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="text-xs text-slate-400">Est. EcoScore</div>
            <div className="text-lg font-bold text-emerald-400">
              {preview.score} <span className="text-xs">({preview.grade})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => setActiveStep("transport")}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition ${
            activeStep === "transport"
              ? "bg-slate-800 border-emerald-500 text-emerald-400"
              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <Car className="w-5 h-5 mb-1" />
          <span>Transport</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStep("energy")}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition ${
            activeStep === "energy"
              ? "bg-slate-800 border-emerald-500 text-emerald-400"
              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <Zap className="w-5 h-5 mb-1" />
          <span>Energy</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStep("food")}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition ${
            activeStep === "food"
              ? "bg-slate-800 border-emerald-500 text-emerald-400"
              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <Utensils className="w-5 h-5 mb-1" />
          <span>Food</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStep("shopping")}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition ${
            activeStep === "shopping"
              ? "bg-slate-800 border-emerald-500 text-emerald-400"
              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <ShoppingBag className="w-5 h-5 mb-1" />
          <span>Shopping</span>
        </button>
      </div>

      {/* Form Fields Body */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* Step 1: Transport */}
        {activeStep === "transport" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Primary Mode of Transport
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "car", label: "Car (0.21 kg/km)" },
                  { id: "bus", label: "Bus (0.10 kg/km)" },
                  { id: "train", label: "Train (0.04 kg/km)" },
                  { id: "flight", label: "Flight (0.25 kg/km)" },
                  { id: "bike", label: "Bike (0 kg/km)" },
                  { id: "walk", label: "Walk (0 kg/km)" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setValue("transportMode", mode.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition ${
                      formValues.transportMode === mode.id
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-sm font-medium text-slate-300 mb-1">
                <span>Distance Traveled</span>
                <span className="text-emerald-400 font-bold">{formValues.transportKm} km</span>
              </div>
              <input
                type="number"
                step="1"
                {...register("transportKm", { valueAsNumber: true })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition"
              />
              {errors.transportKm && (
                <span className="text-xs text-rose-400 mt-1 block">{errors.transportKm.message}</span>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Energy */}
        {activeStep === "energy" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Electricity Source
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "grid", label: "National Grid (0.45 kg/kWh)" },
                  { id: "mixed", label: "Mixed Energy (0.22 kg/kWh)" },
                  { id: "solar", label: "100% Solar / Renewable (0 kg)" },
                ].map((src) => (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => setValue("energySource", src.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition ${
                      formValues.energySource === src.id
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {src.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-sm font-medium text-slate-300 mb-1">
                <span>Daily Power Usage</span>
                <span className="text-emerald-400 font-bold">{formValues.energyKwh} kWh</span>
              </div>
              <input
                type="number"
                step="0.5"
                {...register("energyKwh", { valueAsNumber: true })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition"
              />
              {errors.energyKwh && (
                <span className="text-xs text-rose-400 mt-1 block">{errors.energyKwh.message}</span>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Food */}
        {activeStep === "food" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Dietary Pattern
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "meat_heavy", label: "Meat Heavy (7.2 kg/day)" },
                  { id: "mixed", label: "Mixed Omnivore (4.5 kg/day)" },
                  { id: "vegetarian", label: "Vegetarian (2.5 kg/day)" },
                  { id: "vegan", label: "Vegan (2.0 kg/day)" },
                ].map((diet) => (
                  <button
                    key={diet.id}
                    type="button"
                    onClick={() => setValue("dietType", diet.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition ${
                      formValues.dietType === diet.id
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {diet.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-sm font-medium text-slate-300 mb-1">
                <span>Meals Logged Today</span>
                <span className="text-emerald-400 font-bold">{formValues.meals} meals</span>
              </div>
              <input
                type="number"
                min="0"
                max="6"
                {...register("meals", { valueAsNumber: true })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition"
              />
              {errors.meals && (
                <span className="text-xs text-rose-400 mt-1 block">{errors.meals.message}</span>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Shopping */}
        {activeStep === "shopping" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Shopping Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "clothing", label: "Clothing" },
                  { id: "electronics", label: "Electronics" },
                  { id: "general", label: "General Goods" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setValue("shoppingCategory", cat.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition ${
                      formValues.shoppingCategory === cat.id
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-sm font-medium text-slate-300 mb-1">
                <span>New Orders / Package Purchases</span>
                <span className="text-emerald-400 font-bold">{formValues.shoppingOrders} orders</span>
              </div>
              <input
                type="number"
                min="0"
                {...register("shoppingOrders", { valueAsNumber: true })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition"
              />
              {errors.shoppingOrders && (
                <span className="text-xs text-rose-400 mt-1 block">{errors.shoppingOrders.message}</span>
              )}
            </div>
          </div>
        )}

        {/* Navigation & Submit controls */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          <div className="flex items-center gap-2">
            {activeStep !== "transport" && (
              <button
                type="button"
                onClick={() => {
                  if (activeStep === "energy") setActiveStep("transport");
                  else if (activeStep === "food") setActiveStep("energy");
                  else if (activeStep === "shopping") setActiveStep("food");
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Back
              </button>
            )}

            {activeStep !== "shopping" && (
              <button
                type="button"
                onClick={() => {
                  if (activeStep === "transport") setActiveStep("energy");
                  else if (activeStep === "energy") setActiveStep("food");
                  else if (activeStep === "food") setActiveStep("shopping");
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700"
              >
                Next Step
              </button>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            icon={<CheckCircle className="w-4 h-4" />}
          >
            Save & Calculate Log
          </Button>
        </div>
      </form>
    </div>
  );
};
