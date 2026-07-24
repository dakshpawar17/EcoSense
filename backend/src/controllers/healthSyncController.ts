import { Request, Response } from "express";
import { prisma } from "../database/db";
import { EMISSION_FACTORS } from "../utils/calculationEngine";

// POST /api/sync/health - Batch sync Apple HealthKit / Google Health Connect telemetry
export const syncHealthData = async (req: Request, res: Response) => {
  try {
    const { provider, stepCount, walkingDistanceKm, cyclingDistanceKm } = req.body;

    let totalWalkKm = Number(walkingDistanceKm) || 0;
    let totalBikeKm = Number(cyclingDistanceKm) || 0;
    const steps = Number(stepCount) || 0;

    // Auto-convert step count to distance if walkingDistanceKm was omitted (1 step ≈ 0.00075 km)
    if (totalWalkKm === 0 && steps > 0) {
      totalWalkKm = Number((steps * 0.00075).toFixed(2));
    }

    const savedKm = Number((totalWalkKm + totalBikeKm).toFixed(2));
    // Car baseline emission offset: 0.21 kg CO2/km saved
    const co2OffsetKg = Number((savedKm * 0.21).toFixed(2));

    let createdEntries = [];

    if (totalWalkKm > 0) {
      const walkEntry = await prisma.entry.create({
        data: {
          transportMode: "walk",
          transportKm: totalWalkKm,
          co2Transport: 0,
          co2Total: 0,
          ecoScore: 98,
        },
      });
      createdEntries.push(walkEntry);
    }

    if (totalBikeKm > 0) {
      const bikeEntry = await prisma.entry.create({
        data: {
          transportMode: "bike",
          transportKm: totalBikeKm,
          co2Transport: 0,
          co2Total: 0,
          ecoScore: 99,
        },
      });
      createdEntries.push(bikeEntry);
    }

    return res.status(200).json({
      success: true,
      message: savedKm > 0 
        ? `Successfully synced ${savedKm} km from ${provider || "Health App"}`
        : "Health app connected (0 km activity recorded)",
      data: {
        stepCount: steps,
        syncedDistanceKm: savedKm,
        co2OffsetKg,
        entriesCount: createdEntries.length,
        entries: createdEntries,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to sync health telemetry data",
      error: error.message,
    });
  }
};

// POST /api/sync/gps - Save real-time GPS location tracking session
export const saveGPSTrip = async (req: Request, res: Response) => {
  try {
    const { distanceKm, transportMode } = req.body;

    const distance = Number(distanceKm) || 0;
    const mode = (transportMode || "car").toLowerCase();
    const factor = EMISSION_FACTORS.transport[mode] ?? 0.21;
    const co2Transport = Number((distance * factor).toFixed(2));

    let ecoScore = 75;
    if (mode === "walk" || mode === "bike") ecoScore = 98;
    else if (mode === "train" || mode === "bus") ecoScore = 85;
    else if (co2Transport > 10) ecoScore = 45;

    const entry = await prisma.entry.create({
      data: {
        transportMode: mode,
        transportKm: distance,
        co2Transport,
        co2Total: co2Transport,
        ecoScore,
      },
    });

    return res.status(201).json({
      success: true,
      message: "GPS trip logged successfully",
      data: entry,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to save GPS trip",
      error: error.message,
    });
  }
};

// POST /api/sync/weekly - Process 7-day weekly telemetry sync from Apple Health / Google Health Connect
export const syncWeeklyHealthAnalysis = async (req: Request, res: Response) => {
  try {
    const { provider, weeklyData } = req.body;

    const daysArray = Array.isArray(weeklyData) ? weeklyData : [];

    let totalWeeklySteps = 0;
    let totalActiveKm = 0;
    let bestDay = { day: "N/A", km: 0 };
    const processedDays = [];

    for (const item of daysArray) {
      const steps = Number(item.steps) || 0;
      let walkKm = Number(item.walkKm) || 0;
      const bikeKm = Number(item.bikeKm) || 0;

      // Fallback: 1 step ≈ 0.00075 km
      if (walkKm === 0 && steps > 0) {
        walkKm = Number((steps * 0.00075).toFixed(2));
      }

      const dayTotalKm = Number((walkKm + bikeKm).toFixed(2));
      totalWeeklySteps += steps;
      totalActiveKm += dayTotalKm;

      if (dayTotalKm > bestDay.km) {
        bestDay = { day: item.day || item.date || "Day", km: dayTotalKm };
      }

      if (dayTotalKm > 0) {
        const created = await prisma.entry.create({
          data: {
            transportMode: bikeKm > walkKm ? "bike" : "walk",
            transportKm: dayTotalKm,
            co2Transport: 0,
            co2Total: 0,
            ecoScore: 98,
          },
        });
        processedDays.push({
          day: item.day || "Day",
          steps,
          activeKm: dayTotalKm,
          co2OffsetKg: Number((dayTotalKm * 0.21).toFixed(2)),
          entryId: created.id,
        });
      }
    }

    totalActiveKm = Number(totalActiveKm.toFixed(2));
    const totalCo2SavedKg = Number((totalActiveKm * 0.21).toFixed(2));
    const averageDailySteps = Math.round(daysArray.length > 0 ? totalWeeklySteps / daysArray.length : 0);

    return res.status(200).json({
      success: true,
      message: `Weekly health analysis complete for ${daysArray.length} days from ${provider || "Health App"}`,
      analysis: {
        totalWeeklySteps,
        averageDailySteps,
        totalActiveKm,
        totalCo2SavedKg,
        equivalentTreesPlanted: Number((totalCo2SavedKg / 0.06).toFixed(1)),
        bestDay: `${bestDay.day} (${bestDay.km} km)`,
        sustainabilityRating: totalCo2SavedKg > 15 ? "S-Tier Eco Leader" : totalCo2SavedKg > 8 ? "A-Tier Active Walker" : "B-Tier Sustainability Contributor",
        processedDays,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to process weekly health telemetry analysis",
      error: error.message,
    });
  }
};
