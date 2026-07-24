import { describe, it, expect } from "vitest";
import {
  calculateEmissions,
  calculateEcoScore,
  getGradeFromScore,
} from "../utils/calculationEngine";

describe("Carbon Calculation Engine Tests", () => {
  it("should correctly compute emissions for car + grid + meat_heavy + shopping", () => {
    const input = {
      transportMode: "car",
      transportKm: 10, // 10 * 0.21 = 2.1
      energyKwh: 10, // 10 * 0.45 = 4.5
      energySource: "grid",
      dietType: "meat_heavy", // 7.2 * (3/3) = 7.2
      meals: 3,
      shoppingOrders: 1, // 1 * 2.5 = 2.5
      shoppingCategory: "general",
    };

    const result = calculateEmissions(input);

    expect(result.co2Transport).toBe(2.1);
    expect(result.co2Energy).toBe(4.5);
    expect(result.co2Food).toBe(7.2);
    expect(result.co2Shopping).toBe(2.5);
    expect(result.co2Total).toBe(16.3);
    expect(result.ecoScore).toBeGreaterThanOrEqual(0);
    expect(result.ecoScore).toBeLessThanOrEqual(100);
  });

  it("should return zero emissions for bike + solar + vegan + 0 shopping", () => {
    const input = {
      transportMode: "bike",
      transportKm: 15,
      energyKwh: 20,
      energySource: "solar",
      dietType: "vegan",
      meals: 0,
      shoppingOrders: 0,
      shoppingCategory: "general",
    };

    const result = calculateEmissions(input);

    expect(result.co2Transport).toBe(0);
    expect(result.co2Energy).toBe(0);
    expect(result.co2Food).toBe(0);
    expect(result.co2Shopping).toBe(0);
    expect(result.co2Total).toBe(0);
    expect(result.ecoScore).toBe(100);
    expect(result.grade).toBe("A+");
  });

  it("should correctly map EcoScores to letter grades", () => {
    expect(getGradeFromScore(95)).toBe("A+");
    expect(getGradeFromScore(85)).toBe("A");
    expect(getGradeFromScore(75)).toBe("B");
    expect(getGradeFromScore(65)).toBe("C");
    expect(getGradeFromScore(50)).toBe("D");
    expect(getGradeFromScore(30)).toBe("F");
  });
});
