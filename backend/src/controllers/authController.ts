import { Request, Response } from "express";
import { prisma } from "../database/db";

// POST /api/auth/login - Store/sync user data upon login & return assigned role
export const loginOrRegisterUser = async (req: Request, res: Response) => {
  try {
    const { email, name, avatar, provider, role: requestedRole } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Determine role (Admin role if admin email or requested admin)
    const isAdminEmail = email.toLowerCase().includes("admin") || email.toLowerCase() === "alex.morgan@gmail.com";
    const assignedRole = isAdminEmail || requestedRole === "admin" ? "admin" : "user";

    console.log(`🔑 [USER LOGIN] Name: ${name || "User"} | Email: ${email} | Provider: ${provider || "demo"} | Role: ${assignedRole.toUpperCase()}`);

    let dbUser = null;
    try {
      dbUser = await prisma.user.upsert({
        where: { email },
        update: {
          name: name || "EcoSense User",
          avatar: avatar || null,
          provider: provider || "demo",
          role: assignedRole,
        },
        create: {
          email,
          name: name || "EcoSense User",
          avatar: avatar || null,
          provider: provider || "demo",
          role: assignedRole,
        },
      });
    } catch (dbErr) {
      console.warn("User persistence warning (returning mock user profile):", dbErr);
    }

    return res.status(200).json({
      success: true,
      message: "User login recorded successfully",
      user: dbUser || {
        id: "user-session-" + Date.now(),
        email,
        name: name || "EcoSense User",
        avatar: avatar || "",
        provider: provider || "demo",
        role: assignedRole,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Authentication processing failed",
      error: error.message,
    });
  }
};
