import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/db";
import { generateClaudeReport, FootprintSummary } from "../services/claudeService";
import { getGradeFromScore } from "../utils/calculationEngine";

export async function generateReport(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { entryId } = req.body;

    let targetEntry;
    if (entryId) {
      targetEntry = await prisma.entry.findUnique({ where: { id: entryId } });
    }

    if (!targetEntry) {
      // Fetch latest entry or aggregate averages
      targetEntry = await prisma.entry.findFirst({
        orderBy: { createdAt: "desc" },
      });
    }

    if (!targetEntry) {
      // Fallback default mock data for empty state
      const defaultSummary: FootprintSummary = {
        co2Transport: 4.2,
        co2Energy: 3.6,
        co2Food: 4.5,
        co2Shopping: 2.5,
        co2Total: 14.8,
        ecoScore: 70,
        grade: "B",
        averageComparison: "+18.4% above average",
      };
      const report = await generateClaudeReport(defaultSummary);
      res.status(200).json({ success: true, data: report });
      return;
    }

    const isBelowAvg = targetEntry.co2Total <= 12.5;
    const diffPct = Math.abs(((targetEntry.co2Total - 12.5) / 12.5) * 100).toFixed(1);
    const avgComp = isBelowAvg ? `${diffPct}% below average` : `${diffPct}% above average`;

    const summaryData: FootprintSummary = {
      co2Transport: targetEntry.co2Transport,
      co2Energy: targetEntry.co2Energy,
      co2Food: targetEntry.co2Food,
      co2Shopping: targetEntry.co2Shopping,
      co2Total: targetEntry.co2Total,
      ecoScore: targetEntry.ecoScore,
      grade: getGradeFromScore(targetEntry.ecoScore),
      averageComparison: avgComp,
    };

    const report = await generateClaudeReport(summaryData);

    res.status(200).json({
      success: true,
      data: report,
      entry: targetEntry,
    });
  } catch (error) {
    next(error);
  }
}
