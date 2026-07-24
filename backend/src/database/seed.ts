import { PrismaClient } from "@prisma/client";
import { calculateEmissions } from "../utils/calculationEngine";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding EcoSense Database with 10 realistic entries...");

  // Clear existing entries
  await prisma.entry.deleteMany({});

  const sampleInputs = [
    { transportMode: "car", transportKm: 25, energyKwh: 12, energySource: "grid", dietType: "meat_heavy", meals: 3, shoppingOrders: 1, shoppingCategory: "electronics", dayOffset: 9 },
    { transportMode: "bus", transportKm: 15, energyKwh: 8, energySource: "mixed", dietType: "mixed", meals: 3, shoppingOrders: 0, shoppingCategory: "general", dayOffset: 8 },
    { transportMode: "train", transportKm: 30, energyKwh: 6, energySource: "solar", dietType: "vegetarian", meals: 3, shoppingOrders: 1, shoppingCategory: "clothing", dayOffset: 7 },
    { transportMode: "bike", transportKm: 10, energyKwh: 5, energySource: "solar", dietType: "vegan", meals: 3, shoppingOrders: 0, shoppingCategory: "general", dayOffset: 6 },
    { transportMode: "walk", transportKm: 5, energyKwh: 7, energySource: "mixed", dietType: "vegetarian", meals: 3, shoppingOrders: 0, shoppingCategory: "general", dayOffset: 5 },
    { transportMode: "car", transportKm: 18, energyKwh: 10, energySource: "grid", dietType: "mixed", meals: 3, shoppingOrders: 2, shoppingCategory: "clothing", dayOffset: 4 },
    { transportMode: "bus", transportKm: 20, energyKwh: 9, energySource: "grid", dietType: "meat_heavy", meals: 3, shoppingOrders: 1, shoppingCategory: "general", dayOffset: 3 },
    { transportMode: "flight", transportKm: 150, energyKwh: 14, energySource: "grid", dietType: "meat_heavy", meals: 3, shoppingOrders: 1, shoppingCategory: "electronics", dayOffset: 2 },
    { transportMode: "train", transportKm: 40, energyKwh: 6, energySource: "solar", dietType: "vegan", meals: 3, shoppingOrders: 0, shoppingCategory: "general", dayOffset: 1 },
    { transportMode: "bike", transportKm: 12, energyKwh: 6, energySource: "solar", dietType: "vegetarian", meals: 3, shoppingOrders: 0, shoppingCategory: "general", dayOffset: 0 },
  ];

  const now = new Date();

  for (const input of sampleInputs) {
    const calc = calculateEmissions(input);
    const entryDate = new Date(now.getTime() - input.dayOffset * 24 * 60 * 60 * 1000);

    await prisma.entry.create({
      data: {
        createdAt: entryDate,
        transportMode: input.transportMode,
        transportKm: input.transportKm,
        energyKwh: input.energyKwh,
        energySource: input.energySource,
        dietType: input.dietType,
        meals: input.meals,
        shoppingOrders: input.shoppingOrders,
        shoppingCategory: input.shoppingCategory,
        co2Transport: calc.co2Transport,
        co2Energy: calc.co2Energy,
        co2Food: calc.co2Food,
        co2Shopping: calc.co2Shopping,
        co2Total: calc.co2Total,
        ecoScore: calc.ecoScore,
      },
    });
  }

  console.log("✅ Database successfully seeded with 10 realistic activity logs.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
