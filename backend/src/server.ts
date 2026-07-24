import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import entryRoutes from "./routes/entryRoutes";
import reportRoutes from "./routes/reportRoutes";
import summaryRoutes from "./routes/summaryRoutes";
import adminRoutes from "./routes/adminRoutes";
import profileRoutes from "./routes/profileRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5001;

// Security & Middleware
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// API Routes
app.use("/api/entries", entryRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "EcoSense AI Personal Sustainability Assistant API",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🌱 EcoSense Backend running on http://localhost:${PORT}`);
  });
}

export default app;
