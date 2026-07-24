import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/db";
import { calculateEnvironmentalEquivalents } from "../utils/environmentalEquivalents";
import { generate7DayForecast } from "../services/forecastEngine";

export async function getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const allEntries = await prisma.entry.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (allEntries.length === 0) {
      res.status(200).json({
        success: true,
        data: {
          todayTotal: 0,
          todayEcoScore: 100,
          weeklyAverage: 0,
          bestDay: { date: "N/A", co2Total: 0 },
          worstDay: { date: "N/A", co2Total: 0 },
          averageComparison: "0%",
          currentStreak: 0,
          totalEntries: 0,
          breakdown: {
            co2Transport: 0,
            co2Energy: 0,
            co2Food: 0,
            co2Shopping: 0,
            co2Total: 0,
          },
          weeklyTrend: [],
          environmentalEquivalents: calculateEnvironmentalEquivalents(0),
          forecast: generate7DayForecast([]),
          monthlyBudget: {
            allowanceKg: 250,
            usedKg: 0,
            remainingKg: 250,
          },
        },
      });
      return;
    }

    const latestEntry = allEntries[0];
    const todayTotal = latestEntry.co2Total;
    const todayEcoScore = latestEntry.ecoScore;

    const recentEntries = allEntries.slice(0, 7);
    const sumTotal = recentEntries.reduce((acc, curr) => acc + curr.co2Total, 0);
    const weeklyAverage = parseFloat((sumTotal / recentEntries.length).toFixed(2));

    let best = allEntries[0];
    let worst = allEntries[0];

    allEntries.forEach((entry) => {
      if (entry.co2Total < best.co2Total) best = entry;
      if (entry.co2Total > worst.co2Total) worst = entry;
    });

    const diffPct = (((weeklyAverage - 12.5) / 12.5) * 100).toFixed(1);
    const averageComparison =
      weeklyAverage <= 12.5
        ? `${Math.abs(parseFloat(diffPct))}% below avg`
        : `${Math.abs(parseFloat(diffPct))}% above avg`;

    const currentStreak = Math.min(allEntries.length, 14);

    const breakdown = allEntries.reduce(
      (acc, curr) => {
        acc.co2Transport += curr.co2Transport;
        acc.co2Energy += curr.co2Energy;
        acc.co2Food += curr.co2Food;
        acc.co2Shopping += curr.co2Shopping;
        acc.co2Total += curr.co2Total;
        return acc;
      },
      { co2Transport: 0, co2Energy: 0, co2Food: 0, co2Shopping: 0, co2Total: 0 }
    );

    const weeklyTrend = recentEntries
      .slice()
      .reverse()
      .map((e) => ({
        id: e.id,
        date: new Date(e.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        co2Total: e.co2Total,
        co2Transport: e.co2Transport,
        co2Energy: e.co2Energy,
        co2Food: e.co2Food,
        co2Shopping: e.co2Shopping,
        ecoScore: e.ecoScore,
      }));

    // Environmental equivalents calculation
    const equivalents = calculateEnvironmentalEquivalents(todayTotal);

    // Predictive 7-day forecast
    const pastTotals = allEntries.map((e) => e.co2Total);
    const forecast = generate7DayForecast(pastTotals);

    // Monthly Carbon Budget
    const usedKg = parseFloat(breakdown.co2Total.toFixed(2));
    const allowanceKg = 250;
    const remainingKg = parseFloat(Math.max(0, allowanceKg - usedKg).toFixed(2));

    res.status(200).json({
      success: true,
      data: {
        todayTotal,
        todayEcoScore,
        weeklyAverage,
        bestDay: {
          date: new Date(best.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          co2Total: best.co2Total,
        },
        worstDay: {
          date: new Date(worst.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          co2Total: worst.co2Total,
        },
        averageComparison,
        currentStreak,
        totalEntries: allEntries.length,
        breakdown: {
          co2Transport: parseFloat(breakdown.co2Transport.toFixed(2)),
          co2Energy: parseFloat(breakdown.co2Energy.toFixed(2)),
          co2Food: parseFloat(breakdown.co2Food.toFixed(2)),
          co2Shopping: parseFloat(breakdown.co2Shopping.toFixed(2)),
          co2Total: parseFloat(breakdown.co2Total.toFixed(2)),
        },
        weeklyTrend,
        environmentalEquivalents: equivalents,
        forecast,
        monthlyBudget: {
          allowanceKg,
          usedKg,
          remainingKg,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}
