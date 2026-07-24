import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/db";
import { createEntrySchema } from "../utils/validationSchemas";
import { calculateEmissions } from "../utils/calculationEngine";

export async function createEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedData = createEntrySchema.parse(req.body);
    const calculations = calculateEmissions(validatedData);

    const newEntry = await prisma.entry.create({
      data: {
        userEmail: req.body.userEmail || null,
        userId: req.body.userId || null,
        transportMode: validatedData.transportMode,
        transportKm: validatedData.transportKm,
        energyKwh: validatedData.energyKwh,
        energySource: validatedData.energySource,
        dietType: validatedData.dietType,
        meals: validatedData.meals,
        shoppingOrders: validatedData.shoppingOrders,
        shoppingCategory: validatedData.shoppingCategory,
        co2Transport: calculations.co2Transport,
        co2Energy: calculations.co2Energy,
        co2Food: calculations.co2Food,
        co2Shopping: calculations.co2Shopping,
        co2Total: calculations.co2Total,
        ecoScore: calculations.ecoScore,
      },
    });

    res.status(201).json({
      success: true,
      message: "Activity logged successfully",
      data: newEntry,
      calculation: calculations,
    });
  } catch (error) {
    next(error);
  }
}

export async function getEntries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || 1)) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(String(req.query.limit || 10)) || 10));
    const skip = (page - 1) * limit;

    const search = String(req.query.search || "");
    const transportMode = String(req.query.transportMode || "");
    const energySource = String(req.query.energySource || "");
    const sortBy = String(req.query.sortBy || "createdAt");
    const order = String(req.query.order || "desc") === "asc" ? "asc" : "desc";

    const whereClause: any = {};

    if (transportMode && transportMode !== "all") {
      whereClause.transportMode = transportMode;
    }
    if (energySource && energySource !== "all") {
      whereClause.energySource = energySource;
    }
    if (search) {
      whereClause.OR = [
        { transportMode: { contains: search } },
        { energySource: { contains: search } },
        { dietType: { contains: search } },
        { shoppingCategory: { contains: search } },
      ];
    }

    const [entries, totalCount] = await Promise.all([
      prisma.entry.findMany({
        where: whereClause,
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
      }),
      prisma.entry.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    res.status(200).json({
      success: true,
      data: entries,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getEntryById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id);
    const entry = await prisma.entry.findUnique({ where: { id } });

    if (!entry) {
      res.status(404).json({ success: false, message: "Entry not found" });
      return;
    }

    res.status(200).json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
}

export async function deleteEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id);
    const existing = await prisma.entry.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ success: false, message: "Entry not found" });
      return;
    }

    await prisma.entry.delete({ where: { id } });

    res.status(200).json({ success: true, message: "Entry deleted successfully" });
  } catch (error) {
    next(error);
  }
}
