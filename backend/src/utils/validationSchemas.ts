import { z } from "zod";

export const createEntrySchema = z.object({
  transportMode: z.enum(["car", "bus", "train", "flight", "bike", "walk"], {
    errorMap: () => ({ message: "Transport mode must be car, bus, train, flight, bike, or walk" }),
  }),
  transportKm: z.number().min(0, "Transport km must be >= 0"),
  energyKwh: z.number().min(0, "Energy kWh must be >= 0"),
  energySource: z.enum(["grid", "solar", "mixed"], {
    errorMap: () => ({ message: "Energy source must be grid, solar, or mixed" }),
  }),
  dietType: z.enum(["meat_heavy", "mixed", "vegetarian", "vegan"], {
    errorMap: () => ({ message: "Diet type must be meat_heavy, mixed, vegetarian, or vegan" }),
  }),
  meals: z.number().int().min(0, "Meals must be an integer >= 0"),
  shoppingOrders: z.number().int().min(0, "Shopping orders must be an integer >= 0"),
  shoppingCategory: z.enum(["clothing", "electronics", "general"], {
    errorMap: () => ({ message: "Shopping category must be clothing, electronics, or general" }),
  }),
});

export const reportRequestSchema = z.object({
  entryId: z.string().optional(),
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
