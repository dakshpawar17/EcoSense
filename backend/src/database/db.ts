import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import fs from "fs";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getVercelDatabaseUrl(): string {
  const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isVercel) {
    const tmpDbPath = "/tmp/ecosense.db";
    const dbUrl = `file:${tmpDbPath}`;
    process.env.DATABASE_URL = dbUrl;

    if (!fs.existsSync(tmpDbPath)) {
      try {
        console.log("⚡ Initializing SQLite database at /tmp/ecosense.db for Vercel...");
        execSync("npx prisma db push --accept-data-loss", {
          env: { ...process.env, DATABASE_URL: dbUrl },
          timeout: 10000,
        });
      } catch (err) {
        console.warn("Failed to push Prisma schema to /tmp/ecosense.db:", err);
      }
    }
    return dbUrl;
  }

  return process.env.DATABASE_URL || "file:./ecosense.db";
}

const dbUrl = getVercelDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
