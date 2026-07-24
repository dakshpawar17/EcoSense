import { ActivityFormInput } from "../types";

export const EMISSION_FACTORS = {
  transport: {
    car: 0.21,
    bus: 0.10,
    train: 0.04,
    flight: 0.25,
    bike: 0.0,
    walk: 0.0,
  },
  energy: {
    grid: 0.45,
    solar: 0.0,
    mixed: 0.22,
  },
  food: {
    meat_heavy: 7.2,
    mixed: 4.5,
    vegetarian: 2.5,
    vegan: 2.0,
  },
  shopping: 2.5,
};

export function getGradeFromScore(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
}

export function estimateEmissions(input: Partial<ActivityFormInput>) {
  const mode = input.transportMode || "car";
  const km = input.transportKm || 0;
  const transportRate = EMISSION_FACTORS.transport[mode] || 0.21;
  const co2Transport = km * transportRate;

  const energySource = input.energySource || "grid";
  const kwh = input.energyKwh || 0;
  const energyRate = EMISSION_FACTORS.energy[energySource] || 0.45;
  const co2Energy = kwh * energyRate;

  const diet = input.dietType || "mixed";
  const meals = input.meals !== undefined ? input.meals : 3;
  const foodRate = EMISSION_FACTORS.food[diet] || 4.5;
  const co2Food = foodRate * (meals / 3.0);

  const orders = input.shoppingOrders || 0;
  const co2Shopping = orders * EMISSION_FACTORS.shopping;

  const total = parseFloat((co2Transport + co2Energy + co2Food + co2Shopping).toFixed(2));

  let score = 100;
  if (total > 0) {
    score = Math.max(0, Math.min(100, Math.round(100 - (total / 25.0) * 50)));
  }

  const grade = getGradeFromScore(score);

  return {
    co2Transport: parseFloat(co2Transport.toFixed(2)),
    co2Energy: parseFloat(co2Energy.toFixed(2)),
    co2Food: parseFloat(co2Food.toFixed(2)),
    co2Shopping: parseFloat(co2Shopping.toFixed(2)),
    total,
    score,
    grade,
  };
}
