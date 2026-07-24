export interface ActivityInput {
  transportMode: string;
  transportKm: number;
  energyKwh: number;
  energySource: string;
  dietType: string;
  meals: number;
  shoppingOrders: number;
  shoppingCategory: string;
}

export interface CalculationResult {
  co2Transport: number;
  co2Energy: number;
  co2Food: number;
  co2Shopping: number;
  co2Total: number;
  ecoScore: number;
  grade: string;
}

// Emission Factors (in kg CO2e)
export const EMISSION_FACTORS = {
  transport: {
    car: 0.21,
    bus: 0.10,
    train: 0.04,
    flight: 0.25,
    bike: 0.0,
    walk: 0.0,
  } as Record<string, number>,

  energy: {
    grid: 0.45,
    solar: 0.0,
    mixed: 0.22,
  } as Record<string, number>,

  food: {
    meat_heavy: 7.2,
    mixed: 4.5,
    vegetarian: 2.5,
    vegan: 2.0,
  } as Record<string, number>,

  shopping: 2.5, // kg per order
};

export function calculateEmissions(input: ActivityInput): CalculationResult {
  // Transport CO2
  const transportRate = EMISSION_FACTORS.transport[input.transportMode.toLowerCase()] ?? 0.21;
  const co2Transport = Math.max(0, input.transportKm) * transportRate;

  // Energy CO2
  const energyRate = EMISSION_FACTORS.energy[input.energySource.toLowerCase()] ?? 0.45;
  const co2Energy = Math.max(0, input.energyKwh) * energyRate;

  // Food CO2 (scaled by meals count, 3 meals = 100% daily diet factor)
  const foodRate = EMISSION_FACTORS.food[input.dietType.toLowerCase()] ?? 4.5;
  const mealMultiplier = Math.max(0, input.meals) / 3.0;
  const co2Food = foodRate * mealMultiplier;

  // Shopping CO2
  const co2Shopping = Math.max(0, input.shoppingOrders) * EMISSION_FACTORS.shopping;

  // Total CO2
  const co2Total = parseFloat((co2Transport + co2Energy + co2Food + co2Shopping).toFixed(2));

  // Compute EcoScore (0 to 100)
  const ecoScore = calculateEcoScore(co2Total);
  const grade = getGradeFromScore(ecoScore);

  return {
    co2Transport: parseFloat(co2Transport.toFixed(2)),
    co2Energy: parseFloat(co2Energy.toFixed(2)),
    co2Food: parseFloat(co2Food.toFixed(2)),
    co2Shopping: parseFloat(co2Shopping.toFixed(2)),
    co2Total,
    ecoScore,
    grade,
  };
}

export function calculateEcoScore(co2Total: number): number {
  // Benchmark daily emission target = ~12.5 kg CO2/day
  // 0 kg -> 100 score
  // 6 kg -> ~90 score (A+)
  // 12.5 kg -> ~75 score (B)
  // 25 kg -> ~50 score (D)
  // 40+ kg -> < 30 score (F)
  if (co2Total <= 0) return 100;
  const rawScore = 100 - (co2Total / 25.0) * 50;
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

export function getGradeFromScore(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
}
