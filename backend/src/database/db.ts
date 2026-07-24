import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getVercelDatabaseUrl(): string {
  const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isVercel) {
    const tmpDbPath = "/tmp/ecosense.db";
    const dbUrl = `file:${tmpDbPath}`;
    process.env.DATABASE_URL = dbUrl;

    if (!fs.existsSync(tmpDbPath)) {
      try {
        const candidatePaths = [
          path.join(process.cwd(), "prisma", "ecosense.db"),
          path.join(process.cwd(), "backend", "prisma", "ecosense.db"),
          path.join(process.cwd(), "ecosense.db"),
          "./prisma/ecosense.db",
          "./ecosense.db",
        ];

        let foundTemplate = false;
        for (const cand of candidatePaths) {
          if (fs.existsSync(cand)) {
            fs.copyFileSync(cand, tmpDbPath);
            console.log(`⚡ Successfully copied DB template from ${cand} to /tmp/ecosense.db`);
            foundTemplate = true;
            break;
          }
        }

        if (!foundTemplate) {
          fs.writeFileSync(tmpDbPath, "");
        }
      } catch (err) {
        console.warn("Vercel DB template copy warning:", err);
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
