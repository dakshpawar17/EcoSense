import { Request, Response } from "express";
import { prisma } from "../database/db";
import { predictTransportModeWithAI, generateMultiTimeframeSummary } from "../services/claudeService";
import { EMISSION_FACTORS } from "../utils/calculationEngine";

// POST /api/telemetry/predict-mode - AI Predict transport mode using telemetry + correction history
export const predictTransportMode = async (req: Request, res: Response) => {
  try {
    const { speedKmH, distanceKm } = req.body;

    const speed = Number(speedKmH) || 0;
    const dist = Number(distanceKm) || 0;

    // Fetch past user corrections to train / adjust prediction
    const pastCorrections = await prisma.userCorrection.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: { predictedMode: true, actualMode: true },
    });

    const result = await predictTransportModeWithAI(speed, dist, pastCorrections);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to predict transport mode",
      error: error.message,
    });
  }
};

// POST /api/telemetry/correct-mode - Store user feedback correction and update entry
export const submitUserCorrection = async (req: Request, res: Response) => {
  try {
    const { entryId, predictedMode, actualMode, speedKmH, distanceKm, confidenceScore, reason } = req.body;

    if (!predictedMode || !actualMode) {
      return res.status(400).json({ success: false, message: "predictedMode and actualMode are required." });
    }

    // Store in UserCorrection table to train future predictions
    const correction = await prisma.userCorrection.create({
      data: {
        predictedMode: String(predictedMode).toLowerCase(),
        actualMode: String(actualMode).toLowerCase(),
        speedKmH: Number(speedKmH) || 0,
        distanceKm: Number(distanceKm) || 0,
        confidenceScore: Number(confidenceScore) || 0.8,
        reason: reason || "User manual correction",
      },
    });

    // If entryId provided, update the corresponding activity entry with recalculated CO2
    let updatedEntry = null;
    if (entryId) {
      const mode = String(actualMode).toLowerCase();
      const dist = Number(distanceKm) || 0;
      const factor = EMISSION_FACTORS.transport[mode] ?? 0.21;
      const co2Transport = Number((dist * factor).toFixed(2));

      let ecoScore = 75;
      if (mode === "walk" || mode === "bike") ecoScore = 98;
      else if (mode === "bus" || mode === "train") ecoScore = 85;
      else if (co2Transport > 10) ecoScore = 45;

      updatedEntry = await prisma.entry.update({
        where: { id: String(entryId) },
        data: {
          transportMode: mode,
          co2Transport,
          co2Total: co2Transport,
          ecoScore,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: `AI trained: corrected prediction from ${predictedMode} to ${actualMode}.`,
      data: {
        correction,
        updatedEntry,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit correction feedback",
      error: error.message,
    });
  }
};

// GET /api/telemetry/summaries - Multi-timeframe AI sustainability report
export const getMultiTimeframeSummary = async (req: Request, res: Response) => {
  try {
    const timeframe = (req.query.timeframe as "daily" | "weekly" | "monthly") || "weekly";

    // Date boundary based on timeframe
    const now = new Date();
    let startDate = new Date();
    if (timeframe === "daily") {
      startDate.setDate(now.getDate() - 1);
    } else if (timeframe === "weekly") {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setDate(now.getDate() - 30);
    }

    const entries = await prisma.entry.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: "desc" },
    });

    const report = await generateMultiTimeframeSummary(timeframe, entries);

    return res.status(200).json({
      success: true,
      timeframe,
      data: report,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate multi-timeframe report",
      error: error.message,
    });
  }
};
