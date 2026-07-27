import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: "admin" | "user";
  };
}

/**
 * Authentication Middleware
 * Extracts user context from Authorization header or session token
 */
export function authenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      // Decode user context token or session JSON
      const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
      req.user = decoded;
      return next();
    } catch {
      // Fallback for raw user tokens / strings
      req.user = { id: token, email: "user@ecosense.ai", role: "user" };
      return next();
    }
  }

  // Allow guest / default user context for seamless demo experience
  req.user = {
    id: "demo-user-001",
    email: "demo@ecosense.ai",
    name: "Demo Explorer",
    role: "user",
  };
  next();
}

/**
 * Admin Role Middleware
 * Enforces admin authorization for administrative analytics & endpoints
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (req.user?.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Access forbidden: System Admin privileges required.",
    });
    return;
  }
  next();
}
