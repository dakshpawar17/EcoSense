export interface EnvironmentalEquivalents {
  co2SavedKg: number;
  treesPlanted: number;
  gasolineSavedGallons: number;
  smartphoneChargesAvoided: number;
  milesNotDriven: number;
}

export function calculateEnvironmentalEquivalents(co2TotalKg: number, benchmarkKg = 12.5): EnvironmentalEquivalents {
  const co2SavedKg = Math.max(0, benchmarkKg - co2TotalKg);

  // EPA GHG Equivalencies Factors
  const treesPlanted = parseFloat((co2SavedKg / 21.0).toFixed(2));
  const gasolineSavedGallons = parseFloat((co2SavedKg / 8.89).toFixed(2));
  const smartphoneChargesAvoided = Math.round(co2SavedKg / 0.00822);
  const milesNotDriven = parseFloat((co2SavedKg / 0.40).toFixed(1));

  return {
    co2SavedKg: parseFloat(co2SavedKg.toFixed(2)),
    treesPlanted,
    gasolineSavedGallons,
    smartphoneChargesAvoided,
    milesNotDriven,
  };
}
