import { Request, Response } from "express";
import { prisma } from "../database/db";
import { EMISSION_FACTORS } from "../utils/calculationEngine";

// POST /api/sync/health - Batch sync Apple HealthKit / Google Health Connect telemetry
export const syncHealthData = async (req: Request, res: Response) => {
  try {
    const { provider, stepCount, walkingDistanceKm, cyclingDistanceKm } = req.body;

    const totalWalkKm = Number(walkingDistanceKm) || 0;
    const totalBikeKm = Number(cyclingDistanceKm) || 0;

    const savedKm = totalWalkKm + totalBikeKm;
    // Car baseline emission offset: 0.21 kg CO2/km
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

    return res.status(201).json({
      success: true,
      message: `Successfully synced ${savedKm.toFixed(1)} km from ${provider || "Health App"}`,
      data: {
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
