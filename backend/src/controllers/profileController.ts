import { Request, Response, NextFunction } from "express";

let userProfileMemory = {
  name: "Alex Morgan",
  homeLocation: "San Francisco, CA",
  officeLocation: "Downtown Tech Hub",
  preferredTransport: "electric_bus",
  dietType: "vegetarian",
  monthlyCarbonBudgetKg: 250,
  currentXp: 850,
  currentLevel: 3,
  levelTitle: "Carbon Cutter",
  privacyConsent: true,
};

export async function getUserProfile(_req: Request, res: Response, _next: NextFunction): Promise<void> {
  res.status(200).json({
    success: true,
    data: userProfileMemory,
  });
}

export async function updateUserProfile(req: Request, res: Response, _next: NextFunction): Promise<void> {
  userProfileMemory = {
    ...userProfileMemory,
    ...req.body,
  };
  res.status(200).json({
    success: true,
    message: "User AI profile preferences updated successfully",
    data: userProfileMemory,
  });
}
