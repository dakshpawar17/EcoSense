export interface Entry {
  id: string;
  createdAt: string;
  transportMode: "car" | "bus" | "train" | "flight" | "bike" | "walk";
  transportKm: number;
  energyKwh: number;
  energySource: "grid" | "solar" | "mixed";
  dietType: "meat_heavy" | "mixed" | "vegetarian" | "vegan";
  meals: number;
  shoppingOrders: number;
  shoppingCategory: "clothing" | "electronics" | "general";
  co2Transport: number;
  co2Energy: number;
  co2Food: number;
  co2Shopping: number;
  co2Total: number;
  ecoScore: number;
}

export interface ActivityFormInput {
  transportMode: "car" | "bus" | "train" | "flight" | "bike" | "walk";
  transportKm: number;
  energyKwh: number;
  energySource: "grid" | "solar" | "mixed";
  dietType: "meat_heavy" | "mixed" | "vegetarian" | "vegan";
  meals: number;
  shoppingOrders: number;
  shoppingCategory: "clothing" | "electronics" | "general";
}

export interface AIRecommendation {
  title: string;
  description: string;
  impact_saved: number;
}

export interface AIReport {
  summary: string;
  score: number;
  grade: string;
  biggest_contributor: string;
  comparison: string;
  recommendations: AIRecommendation[];
  confidenceScore?: number;
}

export interface EnvironmentalEquivalents {
  co2SavedKg: number;
  treesPlanted: number;
  gasolineSavedGallons: number;
  smartphoneChargesAvoided: number;
  milesNotDriven: number;
}

export interface ForecastDay {
  dayLabel: string;
  predictedCo2: number;
}

export interface ForecastResult {
  predictedWeeklyAverage: number;
  trendDirection: "decreasing" | "stable" | "increasing";
  forecastDays: ForecastDay[];
  confidenceScore: number;
}

export interface MonthlyBudget {
  allowanceKg: number;
  usedKg: number;
  remainingKg: number;
}

export interface SummaryStats {
  todayTotal: number;
  todayEcoScore: number;
  weeklyAverage: number;
  bestDay: { date: string; co2Total: number };
  worstDay: { date: string; co2Total: number };
  averageComparison: string;
  currentStreak: number;
  totalEntries: number;
  breakdown: {
    co2Transport: number;
    co2Energy: number;
    co2Food: number;
    co2Shopping: number;
    co2Total: number;
  };
  weeklyTrend: Array<{
    id: string;
    date: string;
    co2Total: number;
    co2Transport: number;
    co2Energy: number;
    co2Food: number;
    co2Shopping: number;
    ecoScore: number;
  }>;
  environmentalEquivalents: EnvironmentalEquivalents;
  forecast: ForecastResult;
  monthlyBudget: MonthlyBudget;
}

export interface AdminAnalytics {
  totalUsers: number;
  activeLoggers: number;
  totalEntries: number;
  totalCo2Logged: number;
  totalCo2Saved: number;
  averageEcoScore: number;
  systemStatus: string;
  aiServiceLatencyMs: number;
  aiConfidenceAverage: number;
  categoryTotals: {
    transport: number;
    energy: number;
    food: number;
    shopping: number;
  };
}

export interface UserProfile {
  name: string;
  homeLocation: string;
  officeLocation: string;
  preferredTransport: string;
  dietType: string;
  monthlyCarbonBudgetKg: number;
  currentXp: number;
  currentLevel: number;
  levelTitle: string;
  privacyConsent: boolean;
}
