import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("❌ Error Handler Caught Exception:", err);

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    res.status(400).json({
      success: false,
      message: "Validation failed for request payload",
      errors: formattedErrors,
    });
    return;
  }

  if (err.name === "UnauthorizedError") {
    res.status(401).json({ success: false, message: "Unauthorized access" });
    return;
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error occurred";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
}
